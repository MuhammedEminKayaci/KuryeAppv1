"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ListingCard } from "../hosgeldiniz/_components/ListingCard";
import { Pagination } from "../hosgeldiniz/_components/Pagination";

const DEMO_COURIERS = [
  { id: 1, first_name: "Ahmet", last_name: "Yılmaz", avatar_url: "/images/icon-profile.png", province: "İstanbul", district: "Kadıköy", license_type: "B Sınıfı", working_type: "Tam Zamanlı", working_hours: "09:00-18:00", phone: "0532 123 4567", created_at: new Date().toISOString() },
  { id: 2, first_name: "Mehmet", last_name: "Demir", avatar_url: "/images/icon-profile.png", province: "Ankara", district: "Çankaya", license_type: "A2 Sınıfı", working_type: "Esnek", working_hours: "08:00-17:00", phone: "0533 234 5678", created_at: new Date().toISOString() },
  { id: 3, first_name: "Ayşe", last_name: "Kaya", avatar_url: "/images/icon-profile.png", province: "İzmir", district: "Bornova", license_type: "B Sınıfı", working_type: "Yarı Zamanlı", working_hours: "10:00-19:00", phone: "0534 345 6789", created_at: new Date().toISOString() },
  { id: 4, first_name: "Fatma", last_name: "Şahin", avatar_url: "/images/icon-profile.png", province: "İstanbul", district: "Beşiktaş", license_type: "A1 Sınıfı", working_type: "Tam Zamanlı", working_hours: "07:00-16:00", phone: "0535 456 7890", created_at: new Date().toISOString() },
  { id: 5, first_name: "Ali", last_name: "Çelik", avatar_url: "/images/icon-profile.png", province: "Bursa", district: "Nilüfer", license_type: "B Sınıfı", working_type: "Esnek", working_hours: "09:00-18:00", phone: "0536 567 8901", created_at: new Date().toISOString() },
  { id: 6, first_name: "Zeynep", last_name: "Arslan", avatar_url: "/images/icon-profile.png", province: "Antalya", district: "Muratpaşa", license_type: "A2 Sınıfı", working_type: "Tam Zamanlı", working_hours: "08:00-17:00", phone: "0537 678 9012", created_at: new Date().toISOString() },
  { id: 7, first_name: "Can", last_name: "Yıldız", avatar_url: "/images/icon-profile.png", province: "İstanbul", district: "Üsküdar", license_type: "A Sınıfı", working_type: "Yarı Zamanlı", working_hours: "10:00-15:00", phone: "0538 789 0123", created_at: new Date().toISOString() },
  { id: 8, first_name: "Elif", last_name: "Aydın", avatar_url: "/images/icon-profile.png", province: "Ankara", district: "Keçiören", license_type: "B Sınıfı", working_type: "Tam Zamanlı", working_hours: "09:00-18:00", phone: "0539 890 1234", created_at: new Date().toISOString() },
];

export default function KuryeBulPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const handleCardClick = () => {
    router.push("/kayit-ol");
  };

  // Filtre mantığı
  const filteredItems = useMemo(() => {
    let result = [...DEMO_COURIERS];
    if (filters.province) result = result.filter(c => c.province.toLowerCase().includes(filters.province.toLowerCase()));
    if (filters.district) result = result.filter(c => c.district.toLowerCase().includes(filters.district.toLowerCase()));
    if (filters.license_type) result = result.filter(c => c.license_type.includes(filters.license_type));
    if (filters.working_type) result = result.filter(c => c.working_type.toLowerCase().includes(filters.working_type.toLowerCase()));
    if (filters.working_hours) result = result.filter(c => c.working_hours.includes(filters.working_hours));
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
          <h1 className="text-3xl font-extrabold tracking-tight mb-8 text-black">KURYELER</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map(courier => (
              <div key={courier.id} onClick={handleCardClick} className="cursor-pointer relative">
                <ListingCard
                  title={`${courier.first_name} ${courier.last_name}`}
                  subtitle=""
                  metaParts={[courier.province, courier.district, courier.license_type, courier.working_hours].filter(Boolean)}
                  imageUrl={courier.avatar_url}
                  phone={courier.phone}
                  showActions={true}
                  time={new Date(courier.created_at).toLocaleDateString()}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl pointer-events-none">
                  <div className="text-white text-center px-6">
                    <p className="text-lg font-bold mb-2">📋 Detayları Gör</p>
                    <p className="text-sm text-white/90">Kayıt olarak devam edin</p>
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

// Demo Filter Panel
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
          <SectionToggle label="Kurye Özellikleri" open={sections.calisma} onClick={() => setSections(s => ({ ...s, calisma: !s.calisma }))} />
          {sections.calisma && (
            <div className="space-y-3">
              <Field label="Ehliyet"><Select name="license_type" value={filters["license_type"] || ""} onSelect={(v) => set("license_type", v)} options={["A1", "A2", "A", "B"]} /></Field>
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
