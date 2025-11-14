"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ListingCard } from "../hosgeldiniz/_components/ListingCard";
import { Pagination } from "../hosgeldiniz/_components/Pagination";

const DEMO_BUSINESSES = [
  { id: 1, title: "Hızlı Kargo A.Ş.", description: "Şehir içi ve şehirler arası hızlı teslimat hizmeti", province: "İstanbul", district: "Şişli", working_type: "Tam Zamanlı", working_hours: "08:00-20:00", created_at: new Date().toISOString() },
  { id: 2, title: "Yemek Sepeti Teslimat", description: "Online yemek siparişi teslimat servisi", province: "Ankara", district: "Kızılay", working_type: "Esnek Mesai", working_hours: "10:00-23:00", created_at: new Date().toISOString() },
  { id: 3, title: "Market Express", description: "Market alışverişi anında kapıda", province: "İzmir", district: "Karşıyaka", working_type: "Yarı Zamanlı", working_hours: "09:00-18:00", created_at: new Date().toISOString() },
  { id: 4, title: "Eczane Kurye Hizmeti", description: "İlaç ve sağlık ürünleri teslimatı", province: "İstanbul", district: "Kadıköy", working_type: "Tam Zamanlı", working_hours: "07:00-22:00", created_at: new Date().toISOString() },
  { id: 5, title: "Çiçek Gönder", description: "Özel günler için çiçek teslimatı", province: "Bursa", district: "Osmangazi", working_type: "Esnek Mesai", working_hours: "08:00-19:00", created_at: new Date().toISOString() },
  { id: 6, title: "Elektronik Dağıtım", description: "Elektronik ürün teslimat ve kurulum", province: "Antalya", district: "Kepez", working_type: "Tam Zamanlı", working_hours: "09:00-18:00", created_at: new Date().toISOString() },
  { id: 7, title: "Kurumsal Evrak Servisi", description: "Kurumlar arası belge ve evrak taşıma", province: "İstanbul", district: "Beşiktaş", working_type: "Tam Zamanlı", working_hours: "08:00-17:00", created_at: new Date().toISOString() },
  { id: 8, title: "Pet Shop Express", description: "Evcil hayvan maması ve ürünleri teslimat", province: "Ankara", district: "Çankaya", working_type: "Yarı Zamanlı", working_hours: "10:00-19:00", created_at: new Date().toISOString() },
];

export default function IsletmeBulPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const handleCardClick = () => {
    router.push("/kayit-ol");
  };

  const filteredItems = useMemo(() => {
    let result = [...DEMO_BUSINESSES];
    if (filters.province) result = result.filter(b => b.province.toLowerCase().includes(filters.province.toLowerCase()));
    if (filters.district) result = result.filter(b => b.district.toLowerCase().includes(filters.district.toLowerCase()));
    if (filters.working_type) result = result.filter(b => b.working_type.toLowerCase().includes(filters.working_type.toLowerCase()));
    if (filters.working_hours) result = result.filter(b => b.working_hours.includes(filters.working_hours));
    return result;
  }, [filters]);

  const paged = useMemo(() => filteredItems.slice((page-1)*pageSize, page*pageSize), [filteredItems, page]);

  return (
    <main className="min-h-dvh w-full bg-gradient-to-b from-white to-neutral-100">
      {/* Header */}
      <header className="bg-[#ff7a00] text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/headerlogo.png" alt="Logo" width={160} height={50} className="object-contain" />
          </Link>
          <div className="flex gap-3">
            <Link href="/kayit-ol" className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition">
              Kayıt Ol
            </Link>
            <Link href="/giris" className="bg-white/10 border border-white/30 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition">
              Giriş Yap
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Filter Panel */}
        <DemoFilterPanel onChange={setFilters} />
        
        {/* Main Content */}
        <div className="flex-1 bg-white min-h-[calc(100vh-64px)] px-6 pt-8 pb-12 border-l border-neutral-200">
          <h1 className="text-3xl font-extrabold tracking-tight mb-8 text-black">İŞLETME İLANLARI</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map(business => (
              <div key={business.id} onClick={handleCardClick} className="cursor-pointer relative">
                <ListingCard
                  title={business.title}
                  subtitle={business.description}
                  metaParts={[business.province, business.district, business.working_type, business.working_hours].filter(Boolean)}
                  imageUrl={null}
                  phone={null}
                  showActions={false}
                  time={new Date(business.created_at).toLocaleDateString()}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl pointer-events-none">
                  <div className="text-white text-center px-6">
                    <p className="text-lg font-bold mb-2">📋 İlan Detaylarını Gör</p>
                    <p className="text-sm text-white/90">Kayıt olarak başvurun</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination total={filteredItems.length} page={page} pageSize={pageSize} onPage={setPage} />
        </div>
      </div>
    </main>
  );
}

// Demo Filter Panel for Business
function DemoFilterPanel({ onChange }: { onChange: (filters: Record<string, string>) => void }) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState({ temel: true, calisma: true });
  
  const set = (k: string, v: string) => {
    const next = { ...filters, [k]: v };
    setFilters(next);
    onChange(next);
  };
  
  const reset = () => { setFilters({}); onChange({}); };
  
  return (
    <aside className="bg-black text-white md:min-h-[calc(100vh-64px)] md:w-64 w-full md:rounded-none rounded-2xl md:py-8 md:px-6 p-4 flex flex-col md:sticky md:top-16">
      <div className="flex items-center justify-between md:block">
        <h3 className="text-xl font-bold tracking-tight mb-0 md:mb-6">FİLTRELER</h3>
        <button onClick={() => setOpen(o => !o)} className="md:hidden text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20">{open ? "Kapat" : "Aç"}</button>
      </div>
      <div className={`space-y-4 mt-4 ${open ? "block" : "hidden md:block"}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">Aradığını daha hızlı bul</span>
          <button onClick={reset} className="text-xs underline underline-offset-2 text-white/80 hover:text-white">Sıfırla</button>
        </div>
        <div className="space-y-5">
          <SectionToggle label="Konum" open={sections.temel} onClick={() => setSections(s => ({ ...s, temel: !s.temel }))} />
          {sections.temel && (
            <div className="space-y-3">
              <Field label="İl"><input className="w-full rounded-lg bg-white/10 px-3 py-2 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm" placeholder="İl" onChange={(e) => set("province", e.target.value)} /></Field>
              <Field label="İlçe"><input className="w-full rounded-lg bg-white/10 px-3 py-2 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm" placeholder="İlçe" onChange={(e) => set("district", e.target.value)} /></Field>
            </div>
          )}
          <SectionToggle label="Çalışma" open={sections.calisma} onClick={() => setSections(s => ({ ...s, calisma: !s.calisma }))} />
          {sections.calisma && (
            <div className="space-y-3">
              <Field label="Çalışma Tipi"><Select name="working_type" value={filters["working_type"] || ""} onSelect={(v) => set("working_type", v)} options={["Tam", "Yarı", "Esnek"]} /></Field>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-[11px] tracking-wide mb-1 text-white/70 uppercase">{label}</label>{children}</div>;
}

function SectionToggle({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="w-full flex items-center justify-between text-sm font-semibold bg-white/10 px-3 py-2 rounded-lg hover:bg-white/15 transition"><span>{label}</span><span className="text-xs">{open ? "−" : "+"}</span></button>;
}

function Select({ name, options, value, onSelect }: { name: string; options: string[]; value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => onSelect("")} className={`px-3 py-1 text-xs rounded-full border ${value === "" ? "bg-white text-black border-white" : "bg-white/10 border-white/25 text-white/90 hover:bg-white/15"}`}>Tümü</button>
      {options.map(opt => {
        const active = value === opt;
        return <button type="button" key={opt} onClick={() => onSelect(opt)} className={`px-3 py-1 text-xs rounded-full border ${active ? "bg-white text-black border-white" : "bg-white/10 border-white/25 text-white/90 hover:bg-white/15"}`}>{opt}</button>;
      })}
    </div>
  );
}

  return (
    <main className="min-h-screen w-full bg-neutral-50">
      {/* Simple Header */}
      <header className="bg-[#ff7a00] text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/headerlogo.png" alt="Logo" width={160} height={50} className="object-contain" />
          </Link>
          <div className="flex gap-3">
            <Link href="/kayit-ol" className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition">
              Kayıt Ol
            </Link>
            <Link href="/giris" className="bg-white/10 border border-white/30 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition">
              Giriş Yap
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-neutral-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">İş Fırsatları</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Kurye olarak çalışabileceğiniz güvenilir işletmeleri keşfedin.
          </p>
        </div>
      </div>

      {/* Business Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-2">İşletme İlanları</h2>
          <p className="text-neutral-600">
            İlan detaylarını görmek ve başvurmak için kayıt olun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_BUSINESSES.map((business) => (
            <button
              key={business.id}
              onClick={handleCardClick}
              className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 overflow-hidden text-left"
            >
              {/* Visual */}
              <div className="relative w-full h-44 flex items-center justify-center bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900">
                <svg className="w-20 h-20 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <h4 className="text-lg font-bold text-black tracking-tight group-hover:text-orange-600 transition">
                  {business.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 group-hover:border-orange-300 group-hover:bg-orange-50 transition">
                    {business.province}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 group-hover:border-orange-300 group-hover:bg-orange-50 transition">
                    {business.district}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 group-hover:border-orange-300 group-hover:bg-orange-50 transition">
                    {business.type}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 group-hover:border-orange-300 group-hover:bg-orange-50 transition">
                    {business.hours}
                  </span>
                </div>
              </div>

              {/* Overlay CTA */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center px-6">
                  <p className="text-lg font-bold mb-2">İlan Detaylarını Gör</p>
                  <p className="text-sm text-white/90">Kayıt olarak başvurun</p>
                </div>
              </div>

              {/* Accent bar */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-black to-neutral-800 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl">
          <h3 className="text-3xl font-extrabold mb-4">İşletmelerle Direkt İletişime Geçin</h3>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Kayıt olarak iş ilanlarına başvurun, işletmelerle görüşün ve hemen çalışmaya başlayın.
          </p>
          <Link
            href="/kayit-ol"
            className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-orange-500 hover:text-white transition shadow-lg"
          >
            Hemen Kayıt Ol
          </Link>
        </div>
      </div>
    </main>
  );
}