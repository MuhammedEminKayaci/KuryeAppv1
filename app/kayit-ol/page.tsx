"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { CourierForm } from "./_components/CourierForm";
import { BusinessForm } from "./_components/BusinessForm";
import type { RoleType, CourierRegistration, BusinessRegistration } from "../../types/registration";

export default function KayitOlPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://kurye-app-dusky.vercel.app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<RoleType>("kurye");
  const [stage, setStage] = useState<"auth" | "profile">("auth");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  // URL'den rol parametresini al (rol-sec sayfasından geliyorsa)
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'kurye' || roleParam === 'isletme') {
      setRole(roleParam);
    }
  }, [searchParams]);

  // On mount check if already authenticated (Google dönüşü vs.)
  useEffect(() => {
    supabase.auth.getSession().then((res: { data: { session: any } }) => {
      const { data } = res;
      if (data.session?.user) {
        setSessionUserId(data.session.user.id);
        setSessionEmail(data.session.user.email ?? null);
        setStage("profile");
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (session?.user) {
        setSessionUserId(session.user.id);
        setSessionEmail(session.user.email ?? null);
        setStage("profile");
      }
    });
    return () => {
      sub.subscription?.unsubscribe?.();
    };
  }, []);

  const toTrError = (err: any): string => {
    const msg = String(err?.message || "").toLowerCase();
    if (msg.includes("already registered") || msg.includes("already exists")) return "Bu e‑posta ile hesap zaten var.";
    if (msg.includes("password") && msg.includes("least")) return "Şifre en az 6 karakter olmalıdır.";
    if (msg.includes("invalid email")) return "Geçerli bir e‑posta girin.";
    if (msg.includes("rate limit")) return "Çok fazla deneme yapıldı, sonra tekrar.";
    return "Bir hata oluştu. Tekrar deneyin.";
  };

  const handleAuthSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirm) {
      setMessage("Şifreler eşleşmiyor.");
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${baseUrl}/hosgeldiniz` },
      });
      if (error) throw error;
      if (data.user) {
        setSessionUserId(data.user.id);
        setSessionEmail(data.user.email ?? null);
        setStage("profile");
        setMessage("Hesap oluşturuldu. Profil bilgilerinizi tamamlayın.");
      } else {
        setMessage("E-posta doğrulaması gerekiyor, lütfen gelen kutunuzu kontrol edin.");
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.warn("signup error", err);
      setMessage(toTrError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${baseUrl}/kayit-ol` }, // geri gelip profil adımı
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err: any) {
      setMessage("Google ile giriş başarısız. Sağlayıcı ayarlarını kontrol edin.");
    }
  };

  const handleAccountSwitch = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await supabase.auth.signOut();
    } catch {}
    setSessionUserId(null);
    setSessionEmail(null);
    setEmail("");
    setPassword("");
    setConfirm("");
    setStage("auth");
    setMessage("Hesap değiştirildi. Yeni e‑posta ile devam edin.");
    setLoading(false);
  };

  // Upload helper (avatar optional)
  const uploadAvatar = async (fileList?: FileList): Promise<string | null> => {
    try {
      if (!fileList || fileList.length === 0) return null;
      const file = fileList[0];
      const path = `${sessionUserId}_${Date.now()}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: false });
      if (error) return null;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      return data.publicUrl || null;
    } catch {
      return null;
    }
  };

  const handleCourierProfile = async (data: CourierRegistration) => {
    if (!sessionUserId) {
      setMessage("Önce kimlik doğrulama yapılmalı.");
      return;
    }
    setLoading(true); setMessage(null);
    try {
      const avatarUrl = await uploadAvatar(data.avatarFile);
      const insert = {
        user_id: sessionUserId,
        role: "kurye",
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender,
        birth_year: data.birthYear,
        nationality: data.nationality,
        license_type: data.licenseType,
        phone: data.phone,
        province: data.province,
        district: data.district,
        working_hours: data.workingHours,
        working_days: data.workingDays,
        working_type: data.workingType,
        moto_model: data.motoModel,
        moto_cc: data.motoCc,
        avatar_url: avatarUrl,
      };
      const { error } = await supabase.from("couriers").insert(insert);
      if (error) throw error;
      router.push("/hosgeldiniz");
    } catch (err: any) {
      setMessage("Kurye kaydı başarısız: " + (err.message || ""));
    } finally { setLoading(false); }
  };

  const handleBusinessProfile = async (data: BusinessRegistration) => {
    if (!sessionUserId) { setMessage("Önce kimlik doğrulama yapılmalı."); return; }
    setLoading(true); setMessage(null);
    try {
      const avatarUrl = await uploadAvatar(data.avatarFile);
      const insert = {
        user_id: sessionUserId,
        role: "isletme",
        business_name: data.businessName,
        manager_first_name: data.managerFirstName,
        manager_last_name: data.managerLastName,
        phone: data.phone,
        address: data.address,
        working_type: data.workingType,
        working_hours: data.workingHours,
        avatar_url: avatarUrl,
      };
      const { error } = await supabase.from("businesses").insert(insert);
      if (error) throw error;
      router.push("/hosgeldiniz");
    } catch (err: any) {
      setMessage("İşletme kaydı başarısız: " + (err.message || ""));
    } finally { setLoading(false); }
  };

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#ff7a00]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-white/15 blur-2xl animate-float-slow" />
        <div className="absolute bottom-12 -right-8 w-56 h-56 rounded-full bg-white/10 blur-xl animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/5 blur-3xl animate-float-slow" />
      </div>
      <div className="relative z-10 flex min-h-dvh items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 shadow-2xl fade-up">
          <div className="flex flex-col items-center gap-2 mb-6">
            <Image src="/images/headerlogo.png" alt="Logo" width={160} height={50} priority className="drop-shadow-lg" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Kayıt / Profil Tamamlama</h1>
            <p className="text-xs sm:text-sm text-white/85 text-center max-w-md">{stage === "auth" ? "Önce hesabını oluştur, ardından profil bilgilerini doldur." : "Rol seçip gerekli bilgileri doldurun."}</p>
          </div>

          {/* Role Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-2">
            {(["kurye", "isletme"] as RoleType[]).map(r => (
              <button key={r} onClick={() => setRole(r)} className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${role===r?"bg-white text-black shadow-lg":"bg-white/20 text-white/80"}`}>{r === "kurye" ? "Kurye Kayıt" : "İşletme Kayıt"}</button>
            ))}
          </div>

          {/* Stage: auth (email/password) */}
          {stage === "auth" && (
            <form onSubmit={handleAuthSignup} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-white mb-1">E-posta</label>
                <input type="email" required className="input-field" value={email} onChange={e=>setEmail(e.target.value)} placeholder="ornek@mail.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Şifre</label>
                <input type="password" required minLength={6} className="input-field" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Şifre (Tekrar)</label>
                <input type="password" required minLength={6} className="input-field" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="••••••" />
              </div>
              <button type="submit" disabled={loading} className="primary-btn">{loading?"Oluşturuluyor...":"Devam Et"}</button>
              <div className="text-center text-white/80 text-xs">veya</div>
              <button type="button" onClick={handleGoogleSignup} className="w-full rounded-full bg-white text-black font-semibold py-2 shadow-lg hover:translate-y-[1px] transition-transform inline-flex items-center justify-center gap-2">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.275c0-.85-.075-1.7-.225-2.525H12v4.775h6.5a5.56 5.56 0 0 1-2.4 3.65v3h3.9c2.275-2.1 3.6-5.2 3.6-8.9Z"/><path fill="#34A853" d="M12 24c3.25 0 5.975-1.075 7.967-2.925l-3.9-3c-1.075.75-2.45 1.2-4.067 1.2-3.125 0-5.775-2.1-6.717-4.925H1.2v3.075A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.283 14.35a7.21 7.21 0 0 1 0-4.7V6.575H1.2a12 12 0 0 0 0 10.85l4.083-3.075Z"/><path fill="#EA4335" d="M12 4.75c1.75 0 3.325.6 4.558 1.783l3.4-3.4C17.975 1.2 15.25 0 12 0A12 12 0 0 0 1.2 6.575l4.083 3.075C6.225 6.825 8.875 4.75 12 4.75Z"/></svg>
                Google ile Giriş Yap
              </button>
            </form>
          )}

          {/* Stage: profile forms */}
          {stage === "profile" && (
            <div className="mb-4">
              {sessionEmail && (
                <div className="flex items-center justify-center gap-2 mb-3">
                  <p className="text-xs sm:text-sm text-white/80">Hesap: <span className="font-semibold">{sessionEmail}</span></p>
                  <button type="button" onClick={handleAccountSwitch} className="rounded-full bg-white/90 text-black text-xs font-semibold px-3 py-1 shadow hover:translate-y-[1px] transition">Hesap değiştir</button>
                </div>
              )}
              {role === "kurye" ? (
                <CourierForm onSubmit={handleCourierProfile} disabled={loading} />
              ) : (
                <BusinessForm onSubmit={handleBusinessProfile} disabled={loading} />
              )}
            </div>
          )}

          {message && <p className="mt-2 text-xs sm:text-sm text-center text-white/95">{message}</p>}
          <p className="mt-6 text-xs sm:text-sm text-center text-white/90">Zaten hesabın var mı? <Link href="/giris" className="font-semibold underline-offset-4 hover:underline">Giriş Yap</Link></p>
          <p className="mt-4 text-[10px] leading-relaxed text-white/50 text-center">Bilgileriniz Supabase üzerinde güvenle saklanır. RLS politikaları ile sadece size ait veriler kullanıcı kimliğiniz (auth.uid()) ile ilişkilendirilerek erişilebilir olmalıdır. Tablo şemalarınızı ve politikalarınızı uygun şekilde yapılandırın.</p>
        </div>
      </div>
    </main>
  );
}
