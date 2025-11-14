"use client";
import React, { useEffect, useState } from "react";
import { RoleHeader } from "../_components/RoleHeader";
import { supabase } from "../../lib/supabase";

export default function ProfilPage() {
  const [role, setRole] = useState<"kurye"|"isletme"|null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string|null>(null);
  const fileInputId = "avatar-upload-input";

  useEffect(() => {
    const run = async () => {
      const { data: auth } = await supabase.auth.getSession();
      const uid = auth.session?.user?.id;
      if (!uid) { setLoading(false); return; }
      const { data: c } = await supabase.from("couriers").select("*").eq("user_id", uid).limit(1);
      if (c && c.length) { setRole("kurye"); setProfile(c[0]); setLoading(false); return; }
      const { data: b } = await supabase.from("businesses").select("*").eq("user_id", uid).limit(1);
      if (b && b.length) { setRole("isletme"); setProfile(b[0]); }
      setLoading(false);
    };
    run();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setMsg(null);
      const { data: auth } = await supabase.auth.getSession();
      const uid = auth.session?.user?.id;
      if (!uid) throw new Error("Oturum bulunamadı");
      const ext = file.name.split('.').pop();
      const path = `${uid}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
      const url = pub?.publicUrl;
      if (!url) throw new Error('Görsel URL üretilemedi');
      // Update table
      if (role === 'kurye') {
        await supabase.from('couriers').update({ avatar_url: url }).eq('id', profile.id);
      } else if (role === 'isletme') {
        await supabase.from('businesses').update({ avatar_url: url }).eq('id', profile.id);
      }
      setProfile((p:any)=>({...p, avatar_url: url }));
      setMsg('✓ Profil görseli güncellendi.');
    } catch (err:any) {
      setMsg('✗ ' + (err?.message ?? 'Yükleme başarısız'));
    }
  };

  if (loading) {
    return (
      <main className="min-h-dvh w-full bg-neutral-50">
        <RoleHeader />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="spinner" />
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-dvh w-full bg-neutral-50">
        <RoleHeader />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-black/70 text-lg">Profil bulunamadı. Kayıt sayfasına yönlendiriliyorsunuz...</p>
          <script dangerouslySetInnerHTML={{__html:`setTimeout(()=>{ window.location.href='/kayit-ol'; },1200);`}} />
        </div>
      </main>
    );
  }

  const avatarUrl = profile?.avatar_url && profile.avatar_url.startsWith('http') ? profile.avatar_url : '/images/icon-profile.png';
  const displayName = role === 'kurye' 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Kurye'
    : profile.business_name || 'İşletme';

  return (
    <main className="min-h-dvh w-full bg-neutral-50">
      <RoleHeader />
      {/* Cover Photo + Avatar - Facebook style */}
      <div className="relative w-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 h-64 md:h-80">
        <div className="absolute inset-0 bg-black/10" />
        {/* Avatar positioned at bottom */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            </div>
            {/* Edit overlay */}
            <button
              onClick={() => document.getElementById(fileInputId)?.click()}
              className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-sm font-semibold"
            >
              <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Düzenle
            </button>
            <input id={fileInputId} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 md:pt-8 pb-12">
        {/* Name & Role */}
        <div className="text-center md:text-left md:ml-48 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-1">{displayName}</h1>
          <p className="text-neutral-600 text-sm md:text-base">
            {role === 'kurye' ? '🚴 Kurye' : '🏢 İşletme'} 
            {profile.province && ` • ${profile.province}`}
          </p>
        </div>

        {msg && (
          <div className={`max-w-2xl mx-auto mb-6 p-3 rounded-lg text-center text-sm font-medium ${msg.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {msg}
          </div>
        )}

        {/* Tabs / Sections */}
        <div className="border-b border-neutral-200 mb-8">
          <div className="flex gap-6 text-sm font-semibold">
            <button className="pb-3 border-b-2 border-orange-500 text-orange-600">Hakkında</button>
          </div>
        </div>

        {/* Info Grid */}
        {role === "kurye" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ["Ad", profile.first_name, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>],
              ["Soyad", profile.last_name, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>],
              ["Cinsiyet", profile.gender, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>],
              ["Doğum Yılı", profile.birth_year, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>],
              ["Uyruk", profile.nationality, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>],
              ["Ehliyet", profile.license_type, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>],
              ["Telefon", profile.phone, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>],
              ["Konum", `${profile.province || '-'} / ${profile.district || '-'}`, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>],
              ["Çalışma Saatleri", profile.working_hours, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>],
              ["Çalışma Tipi", profile.working_type, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>],
              ["Çalışma Günleri", (profile.working_days || []).join(", ") || '-', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>],
              ["Motosiklet", `${profile.moto_model || '-'} • ${profile.moto_cc || '-'}cc`, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>],
            ].map(([k, v, icon]) => (
              <div key={String(k)} className="rounded-2xl bg-white p-5 shadow-sm border border-neutral-200 hover:shadow-md hover:border-orange-200 transition">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-orange-500">{icon}</div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase">{k}</div>
                </div>
                <div className="text-base text-black font-medium pl-7">{String(v ?? "-")}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ["İşletme Adı", profile.business_name, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>],
              ["Yetkili", `${profile.manager_first_name || ''} ${profile.manager_last_name || ''}`, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>],
              ["Telefon", profile.phone, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>],
              ["Adres", profile.address, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>],
              ["Çalışma Tipi", profile.working_type, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>],
              ["Çalışma Saatleri", profile.working_hours, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>],
            ].map(([k, v, icon]) => (
              <div key={String(k)} className="rounded-2xl bg-white p-5 shadow-sm border border-neutral-200 hover:shadow-md hover:border-orange-200 transition">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-orange-500">{icon}</div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase">{k}</div>
                </div>
                <div className="text-base text-black font-medium pl-7">{String(v ?? "-")}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
