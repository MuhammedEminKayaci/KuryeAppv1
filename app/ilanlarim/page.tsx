"use client";
import React, { useEffect, useState } from "react";
import { RoleHeader } from "../_components/RoleHeader";
import { supabase } from "../../lib/supabase";

export default function IlanlarimPage() {
  const [role, setRole] = useState<"kurye"|"isletme"|null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const { data: auth } = await supabase.auth.getSession();
      const uid = auth.session?.user?.id;
      if (!uid) { setLoading(false); return; }
      const { data: c } = await supabase.from("couriers").select("id").eq("user_id", uid).limit(1);
      if (c && c.length) {
        setRole("kurye");
        const { data } = await supabase.from("courier_ads").select("*").eq("user_id", uid).order("created_at", { ascending: false });
        setItems(data || []);
      } else {
        setRole("isletme");
        const { data } = await supabase.from("business_ads").select("*").eq("user_id", uid).order("created_at", { ascending: false });
        setItems(data || []);
      }
      setLoading(false);
    };
    run();
  }, []);

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", province:"", district:"", working_type:"", working_hours:"" });
  const submit = async () => {
    setErrorMsg(null as any);
    if (role !== "isletme") return; // sadece işletme ilan
    setCreating(true);
    const { data: auth } = await supabase.auth.getSession();
    const uid = auth.session?.user?.id;
    if (!form.title.trim()) { setErrorMsg("Başlık zorunludur."); setCreating(false); return; }
    const payload = { ...form, user_id: uid };
    const { data, error } = await supabase.from("business_ads").insert(payload).select().single();
    if (error) {
      setErrorMsg(error.message.includes("relation \"business_ads\" does not exist")
        ? "İlan tablosu eksik. Paneldeki supabase_ads_schema.sql dosyasını çalıştırın."
        : `İlan oluşturulamadı: ${error.message}`);
    }
    if (!error && data) setItems(prev => [data, ...prev]);
    setCreating(false);
    setForm({ title:"", description:"", province:"", district:"", working_type:"", working_hours:"" });
  };

  return (
    <main className="min-h-dvh w-full bg-gradient-to-b from-white to-neutral-100">
      <RoleHeader />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-extrabold text-black tracking-tight">İlanlarım</h1>
          {role === "isletme" && (
            <div className="flex items-center gap-2">
              <button
                disabled={creating}
                onClick={submit}
                className="px-5 py-2 rounded-full bg-black text-white text-sm font-semibold disabled:opacity-40"
              >{creating?"Kaydediliyor...":"İlan Oluştur"}</button>
            </div>
          )}
        </div>
        {errorMsg && <div className="mb-4 text-sm text-red-600">{errorMsg}</div>}
        {role === "isletme" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <LabeledInput label="Başlık" value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="Örn: Akşam Vardiyası Kuryesi" />
            <LabeledInput label="İl" value={form.province} onChange={v=>setForm(f=>({...f,province:v}))} placeholder="İstanbul" />
            <LabeledInput label="İlçe" value={form.district} onChange={v=>setForm(f=>({...f,district:v}))} placeholder="Kadıköy" />
            <LabeledTextArea className="md:col-span-3" label="Açıklama" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))} placeholder="İşin detaylarını yazın" />
            <LabeledInput label="Çalışma Tipi" value={form.working_type} onChange={v=>setForm(f=>({...f,working_type:v}))} placeholder="tam / yari / serbest" />
            <LabeledInput label="Çalışma Saatleri" value={form.working_hours} onChange={v=>setForm(f=>({...f,working_hours:v}))} placeholder="gunduz / gece / 24" />
          </div>
        )}
        {loading ? (
          <div className="spinner mt-4" />
        ) : items.length === 0 ? (
          <p className="text-black/70 mt-2">Henüz ilanınız yok.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it) => (
              <li key={it.id} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm hover:shadow-md transition">
                <div className="font-semibold text-black text-lg mb-1">{it.title}</div>
                <div className="text-sm text-black/70 line-clamp-3">{it.description}</div>
                <div className="text-xs text-black/50 mt-2 flex gap-2 flex-wrap">
                  {[it.province, it.district, it.working_type, it.working_hours].filter(Boolean).map((m:string,idx:number)=>(
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-black/70">{m}</span>
                  ))}
                </div>
                <div className="text-[11px] text-neutral-500 mt-2">{new Date(it.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function LabeledInput({ label, value, onChange, placeholder, className }:{ label:string; value:string; onChange:(v:string)=>void; placeholder?:string; className?:string }){
  return (
    <label className={`block ${className||""}`}>
      <span className="block text-[11px] font-semibold text-neutral-600 mb-1 uppercase tracking-wide">{label}</span>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/20" />
    </label>
  );
}
function LabeledTextArea({ label, value, onChange, placeholder, className }:{ label:string; value:string; onChange:(v:string)=>void; placeholder?:string; className?:string }){
  return (
    <label className={`block ${className||""}`}>
      <span className="block text-[11px] font-semibold text-neutral-600 mb-1 uppercase tracking-wide">{label}</span>
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/20 h-24" />
    </label>
  );
}
