"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export function Header() {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/giris");
  };
  return (
    <header className="w-full bg-white/95 backdrop-blur shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/headerlogo.png" alt="Logo" width={140} height={40} className="h-10 w-auto" />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/profil" className="px-3 py-2 rounded-full text-sm font-semibold bg-black text-white hover:opacity-90 transition">Profil</Link>
          <Link href="/ilanlar" className="px-3 py-2 rounded-full text-sm font-semibold bg-black text-white hover:opacity-90 transition">İlanlar</Link>
          <Link href="/ilanlarim" className="px-3 py-2 rounded-full text-sm font-semibold bg-black text-white hover:opacity-90 transition">İlanlarım</Link>
          <button onClick={handleLogout} className="px-3 py-2 rounded-full text-sm font-semibold bg-[#ff7a00] text-black hover:opacity-90 transition">Çıkış</button>
        </nav>
      </div>
    </header>
  );
}
