"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SifremiUnuttumPage() {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://kurye-app-dusky.vercel.app";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      setLoading(true);
  const redirectTo = `${baseUrl}/sifre-sifirla`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setMessage("Şifre sıfırlama bağlantısı e-postanıza gönderildi.");
    } catch (err: any) {
      setMessage(err?.message ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#ff7a00]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-white/15 blur-2xl animate-float-slow" />
        <div className="absolute bottom-12 -right-8 w-56 h-56 rounded-full bg-white/10 blur-xl animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/5 blur-3xl animate-float-slow" />
      </div>

      <div className="relative z-10 flex min-h-dvh items-center justify-center px-6 py-12">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl fade-up">
          <div className="flex flex-col items-center gap-2 mb-6">
            <Image src="/images/headerlogo.png" alt="Motto Kurye Logo" width={180} height={60} priority className="drop-shadow-lg" />
            <h1 className="text-2xl font-extrabold text-white">Şifremi Unuttum</h1>
            <p className="text-sm text-white/85 text-center">E‑posta adresinizi girin, sıfırlama bağlantısı gönderelim.</p>
          </div>

          <form className="space-y-4" onSubmit={handleReset}>
            <div>
              <label className="block text-sm font-medium text-white mb-1">E-posta</label>
              <input className="input-field" type="email" placeholder="ornek@mail.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="primary-btn" disabled={loading}>{loading ? "Gönderiliyor..." : "Bağlantıyı Gönder"}</button>
          </form>

          {message && <p className="mt-4 text-sm text-center text-white/95">{message}</p>}

          <p className="mt-6 text-sm text-center text-white/90">
            Giriş sayfasına dön {" "}
            <Link href="/giris" className="font-semibold underline-offset-4 hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
