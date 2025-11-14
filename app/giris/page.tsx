"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function GirisPage() {
  const router = useRouter();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://kurye-app-dusky.vercel.app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Profile check for redirect logic
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData.session?.user?.id;
      let target = "/kayit-ol";
      if (uid) {
        const { data: c } = await supabase.from("couriers").select("id").eq("user_id", uid).limit(1);
        const { data: b } = !c?.length ? await supabase.from("businesses").select("id").eq("user_id", uid).limit(1) : { data: [] };
        if (c?.length || b?.length) target = "/profil";
      }
      setMessage("Giriş başarılı! Yönlendiriliyorsunuz...");
      setTimeout(() => { router.push(target); }, 400);
    } catch (err: any) {
      setMessage(err?.message ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage(null);
    try {
      const redirectTo = `${baseUrl}/rol-sec`; // Google OAuth sonrası rol seçimi sayfasına yönlendir
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setMessage(
        err?.message?.includes("provider is not enabled")
          ? "Google sağlayıcısı Supabase üzerinde etkin değil. Lütfen Dashboard > Authentication > Providers > Google kısmından etkinleştirin."
          : err?.message ?? "Bir hata oluştu."
      );
    }
  };
  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#ff7a00]">
      {/* Animated decorative shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-white/15 blur-2xl animate-float-slow" />
        <div className="absolute bottom-12 -right-8 w-56 h-56 rounded-full bg-white/10 blur-xl animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/5 blur-3xl animate-float-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-6 py-12">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl fade-up">
          <div className="flex flex-col items-center gap-2 mb-6">
            <Image
              src="/images/headerlogo.png"
              alt="Motto Kurye Logo"
              width={200}
              height={60}
              priority
              className="drop-shadow-lg"
            />
            <h1 className="text-2xl font-extrabold text-white">Giriş Yap</h1>
            <p className="text-sm text-white/85 text-center">Hesabınla devam et.</p>
          </div>

          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div>
              <label className="block text-sm font-medium text-white mb-1">E-posta</label>
              <input className="input-field" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="ornek@mail.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Şifre</label>
              <input className="input-field" value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" required minLength={6} />
            </div>
            <button type="submit" className="primary-btn" disabled={loading}>{loading ? "Giriş yapılıyor..." : "Giriş Yap"}</button>
          </form>

          <div className="mt-3 text-center">
            <Link href="/sifremi-unuttum" className="text-white/90 underline-offset-4 hover:underline text-sm">Şifremi unuttum?</Link>
          </div>

          <div className="mt-4 text-center text-white/80">veya</div>
          <button onClick={handleGoogleLogin} className="mt-3 w-full rounded-full bg-white text-black font-semibold py-2 shadow-lg hover:translate-y-[1px] transition-transform inline-flex items-center justify-center gap-2">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.275c0-.85-.075-1.7-.225-2.525H12v4.775h6.5a5.56 5.56 0 0 1-2.4 3.65v3h3.9c2.275-2.1 3.6-5.2 3.6-8.9Z"/><path fill="#34A853" d="M12 24c3.25 0 5.975-1.075 7.967-2.925l-3.9-3c-1.075.75-2.45 1.2-4.067 1.2-3.125 0-5.775-2.1-6.717-4.925H1.2v3.075A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.283 14.35a7.21 7.21 0 0 1 0-4.7V6.575H1.2a12 12 0 0 0 0 10.85l4.083-3.075Z"/><path fill="#EA4335" d="M12 4.75c1.75 0 3.325.6 4.558 1.783l3.4-3.4C17.975 1.2 15.25 0 12 0A12 12 0 0 0 1.2 6.575l4.083 3.075C6.225 6.825 8.875 4.75 12 4.75Z"/></svg>
            Google ile Giriş Yap
          </button>

          {message && (
            <p className="mt-4 text-sm text-center text-white/95">{message}</p>
          )}

          <p className="mt-6 text-sm text-center text-white/90">
            Henüz hesabın yok mu?{" "}
            <Link href="/kayit-ol" className="font-semibold underline-offset-4 hover:underline">Kayıt Ol</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
