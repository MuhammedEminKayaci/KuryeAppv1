"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../lib/supabase";

type UserRole = "kurye" | "isletme" | null;

interface RoleHeaderProps {
  accent?: string; // allow overriding accent color if needed
}

export function RoleHeader({ accent = "#ff7a00" }: RoleHeaderProps) {
  const [role, setRole] = useState<UserRole>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const detect = async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id;
      if (!uid) return;
      const { data: c } = await supabase.from("couriers").select("id").eq("user_id", uid).limit(1);
      if (c && c.length) { setRole("kurye"); return; }
      const { data: b } = await supabase.from("businesses").select("id").eq("user_id", uid).limit(1);
      if (b && b.length) setRole("isletme");
    };
    detect();
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const logoTarget = role ? "/ilanlar" : "/"; // role yoksa ana sayfa
  const courierNav = [
    { label: "Profilim", href: "/profil" },
    { label: "İlanlar", href: "/ilanlar" }, // işletme ilanları
  ];
  const businessNav = [
    { label: "Profilim", href: "/profil" },
    { label: "İlanlar", href: "/ilanlar" }, // kuryeler listesi
    { label: "İlanlarım", href: "/ilanlarim" }, // business ilanları
  ];
  const guestNav = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Nasıl Çalışır", href: "#" },
  ];
  const nav = role === "kurye" ? courierNav : role === "isletme" ? businessNav : guestNav;

  const authButtons = !role ? (
    <div className="flex items-center gap-3 mt-6 md:mt-0">
      <Link href="/kayit-ol" className="btn-auth">Kayıt Ol</Link>
      <Link href="/giris" className="btn-auth-alt">Giriş Yap</Link>
    </div>
  ) : (
    <button
      onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
      className="btn-auth-alt"
    >Çıkış</button>
  );

  return (
    <header
      className="relative z-30 bg-[var(--accent-color)] text-white shadow-md"
      style={{ ['--accent-color' as any]: accent }}
    >
      <style>{`
        .btn-auth { @apply bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold transition hover:bg-black/80 shadow-sm; }
        .btn-auth-alt { @apply bg-white text-black border-2 border-black/20 px-6 py-2.5 rounded-full text-sm font-bold transition hover:bg-black hover:text-white shadow-sm; }
        .nav-link { @apply text-sm font-bold text-white/95 hover:text-white transition-all px-3 py-2 rounded-lg hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50; }
      `}</style>
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={logoTarget} aria-label="Logo" className="flex items-center group">
            <Image src="/images/headerlogo.png" alt="Logo" width={160} height={50} className="object-contain transition-transform group-hover:scale-[1.02]" />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6" aria-label="Ana menü">
          {nav.map(item => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">{authButtons}</div>
        <button
          aria-label="Menü"
          onClick={() => setMenuOpen(o=>!o)}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/30 bg-white/15 text-white backdrop-blur"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen?"M6 18L18 6M6 6l12 12":"M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-[var(--accent-color)]/98 flex flex-col items-center pt-24 animate-fade" style={{ ['--accent-color' as any]: accent }}>
          <div className="flex flex-col gap-4 w-full max-w-sm px-8">
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={()=>setMenuOpen(false)}
                className="text-base font-bold py-3 text-white/95 hover:text-white hover:bg-white/10 px-4 rounded-lg transition"
              >{item.label}</Link>
            ))}
            <div className="pt-2 border-t border-black/10 flex justify-center">{authButtons}</div>
          </div>
        </div>
      )}
    </header>
  );
}
