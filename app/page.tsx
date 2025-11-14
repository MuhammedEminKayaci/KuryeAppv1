"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react"; // useState + ESC close
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Close mobile menu on ESC for accessibility
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navItems = [
    { label: "Ana Sayfa", href: "#" },
    { label: "İletişim", href: "#" },
    { label: "Nasıl Çalışır", href: "#" },
    { label: "Daha Fazla", href: "#" },
  ];
  const sharedNavLink =
    "font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-md px-1";
  const authBtnBase =
    "bg-white text-black border-2 border-black px-10 py-2 rounded-full font-bold transition-colors transition-transform hover:bg-black hover:text-white hover:translate-y-[1px]";

  const handleProtectedNav = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      router.push("/hosgeldiniz");
    } else {
      router.push("/giris");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col font-sans">
      <header className="bg-[#ff7a00] text-white py-3 px-6 flex items-center justify-between shadow relative">
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="Ana Sayfa" className="flex items-center">
            <Image
              src="/images/headerlogo.png"
              alt="Motto Kurye Logo"
              width={300}
              height={80}
              priority
              className="object-contain select-none"
            />
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <button
          className="md:hidden z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-[#ff7a00] z-40 md:hidden flex flex-col items-center justify-center"
            role="dialog"
            aria-modal="true"
          >
            <nav className="flex flex-col items-center gap-8" role="navigation" aria-label="Mobil menü">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-xl font-bold hover:text-white/80"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/kayit-ol" className={authBtnBase} onClick={() => setIsMenuOpen(false)}>
                Kayıt Ol
              </Link>
              <Link href="/giris" className={authBtnBase} onClick={() => setIsMenuOpen(false)}>
                Giriş Yap
              </Link>
            </nav>
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6 text-base items-center" role="navigation" aria-label="Ana menü">
            {navItems.map((item, idx) => (
              <React.Fragment key={item.label}>
                <Link
                  href={item.href}
                  className={`${sharedNavLink} ${idx === 0 ? "text-black/80" : ""} hover:text-white/80`}
                >
                  {item.label}
                </Link>
                {idx < navItems.length - 1 && <span className="h-6 w-px bg-white/80" aria-hidden="true" />}
              </React.Fragment>
            ))}
          </nav>
          <Link href="/kayit-ol" className={authBtnBase}>
            Kayıt Ol
          </Link>
          <Link href="/giris" className={authBtnBase}>
            Giriş Yap
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 p-6 md:p-12 lg:p-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center md:items-start gap-6">
              <Image
                src="/images/kuryee.png"
                alt="kurye"
                width={420}
                height={420}
                className="w-64 md:w-96"
                priority
              />
              <Link href="/kurye-bul" className="bg-white text-[#ff7a00] border-2 border-[#ff7a00] px-30 py-3 rounded-full font-semibold transition-colors transition-transform hover:bg-[#ff7a00] hover:text-white hover:translate-y-[1px] hover:shadow-md">
                Kurye Bul
              </Link>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6">
              <Image
                src="/images/sirket.png"
                alt="işletme bina"
                width={420}
                height={420}
                className="w-64 md:w-96"
                priority
              />
              <Link href="/isletme-bul" className="bg-white text-black border-2 border-[#00000] px-30 py-3 rounded-full font-semibold transition-colors transition-transform hover:bg-black hover:text-white hover:translate-y-[1px] hover:shadow-md">
                İşletme Bul
              </Link>
            </div>
          </div>

        </div>
        {/* Full-width black strip with gradient */}
        <div className="w-full bg-gradient-to-b from-black to-[#2c2c2c] text-white mt-12">
          <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold max-w-md">
                İşletmen için en doğru kuryeyi bul.
              </h3>
            </div>

            <div className="w-full md:w-1/2">
              <p className="text-sm md:text-sm opacity-80 max-w-lg md:ml-auto">
                İşletmeler ve kuryelerin iyi bir iş ortaklığı ile "kazan-kazan" modeli oluşturması her iki taraf için yapılan işin verimini arttırmaktadır. Doğru eşleşmeyi sağlayarak her iki tarafın da kazançlı çıkmasını hedefliyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* Stats (ikonlu turuncu kareler — yazı ikonun içinde, beyaz renkli) */}
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <div className="flex items-center justify-center gap-6">
            {[
              { icon: "/images/icon-kuryee.png", label: "" },
              { icon: "/images/icon-isletmee.png", label: "" },
              { icon: "/images/icon-eslesmee.png", label: "" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#ff7a00] rounded-2xl w-36 h-36 md:w-50 md:h-50 flex flex-col items-center justify-center shadow-lg"
              >
                <Image
                  src={item.icon}
                  alt={item.label.replace("\n", " ")}
                  width={64}
                  height={64}
                  className="object-contain mb-1"
                  priority
                />
                <div className="text-white text-sm md:text-base font-bold text-center whitespace-pre-line">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto"> {/* yeniden içeriği devam ettirmek için container açılıyor */}

          {/* NASIL ÇALIŞIR */}
          <h2 className="mt-12 text-center text-3xl font-extrabold text-black">NASIL ÇALIŞIR ?</h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Profilini Oluştur",
                desc: "İşletme veya Kurye olarak profilini oluştur ve çalışma kriterlerini belirle.",
                icon: "/images/icon-profile.png",
              },
              {
                title: "Filtrele",
                desc: "Çalışmak istediğin kurye veya işletmeyi filtrele.",
                icon: "/images/icon-filter.png",
              },
              {
                title: "Doğru Eşleşmeyi Bul",
                desc: "Sana uygun olan işletme veya kuryeyi listele.",
                icon: "/images/icon-match.png",
              },
              {
                title: "İletişime Geç",
                desc: "Talep kabul edilirse hızlıca iletişime geç ve işlemi kolaylaştır.",
                icon: "/images/icon-contact.png",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-[#2c2c2c] rounded-lg shadow-lg border border-gray-800">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#ffffff] flex items-center justify-center">
                    <Image src={item.icon} alt={item.title} width={48} height={48} />
                  </div>
                  <h4 className="font-bold text-[#ff7a00]">{item.title}</h4>
                  <p className="text-sm text-white">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA + Telefon Mockup */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-black">
                Hemen <span className="text-[#ff7a00]">Kayıt Ol</span> !
                <br className="hidden md:block" />
                Ve Kolayca <span className="text-[#ff7a00]">Servise Başla</span> !!!
              </h3>
              <p className="mt-6 text-base text-black">
                Kolayca kayıt ol, profilini doğruyla hemen başla. Kurye isen işletmeleri ara ve bul; işletme isen kuryelerini rahatlıkla seç.
              </p>

              <div className="mt-8">
                <Link
                  href="/kayit-ol"
                  className="inline-block px-8 py-4 border-2 border-black rounded-full text-base font-semibold text-black hover:bg-black hover:text-white transition-colors"
                >
                  Hemen Kayıt Ol
                </Link>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="w-56 md:w-72">
                <Image src="/images/i-phone.png" alt="phone" width={420} height={840} className="rounded-3xl shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#ff7a00] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Logo Sol Üstte */}
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src="/images/headerlogo.png"
                alt="Motto Kurye Logo"
                width={300}
                height={80}
                className="object-contain"
              />
            </div>

            {/* Footer Navigation Sağ Üstte */}
            <div className="flex gap-8">
              <Link href="#" className="text-white hover:text-white/80">
                Nasıl Çalışır
              </Link>
              <Link href="#" className="text-white hover:text-white/80">
                Ücret Planları
              </Link>
              <Link href="#" className="text-white hover:text-white/80">
                İletişim
              </Link>
            </div>
          </div>

          {/* Açıklama Metni Menünün Altında */}
          <div className="mt-4 text-sm opacity-80 text-center md:text-right max-w-lg ml-auto">
            MottoKurye olarak çıktığımız bu yolda kuryelerin yaşadığı teslimat sorununu çözmek
            ve işletmelerin güvenilir kurye bulma gibi problemlerine çözüm düşünerek geliştirdiğimiz bu
            yenilikçi bakış uygulamalarla artık çok daha kolay.
          </div>

          {/* Copyright Altında */}
          <div className="mt-6 text-sm text-center md:text-right">
            2025 - Tüm haklar saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
// ...existing code...