"use client";
import React, { useState } from "react";

export type Role = "kurye" | "isletme";

export function FilterPanel({ role, onChange }: { role: Role; onChange: (filters: Record<string, string>) => void }) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<boolean>(false); // mobile collapse
  const [sections, setSections] = useState<{[k:string]:boolean}>({ temel:true, calisma:true, diger:false });
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
        <button onClick={()=>setOpen(o=>!o)} className="md:hidden text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20">{open?"Kapat":"Aç"}</button>
      </div>
  <div className={`space-y-4 mt-4 ${open?"block":"hidden md:block"}`}> 
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/60">Aradığını daha hızlı bul</span>
        <button onClick={reset} className="text-xs underline underline-offset-2 text-white/80 hover:text-white">Sıfırla</button>
      </div>
      {role === "kurye" ? (
        <div className="space-y-5">
          {/* Temel Bilgiler */}
          <SectionToggle label="Konum" open={sections.temel} onClick={()=>setSections(s=>({...s,temel:!s.temel}))} />
          {sections.temel && (
            <div className="space-y-3">
              <Field label="İl"><input className="w-full rounded-lg bg-white/10 px-3 py-2 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="İl" onChange={(e)=>set("province", e.target.value)} /></Field>
              <Field label="İlçe"><input className="w-full rounded-lg bg-white/10 px-3 py-2 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="İlçe" onChange={(e)=>set("district", e.target.value)} /></Field>
            </div>
          )}
          <SectionToggle label="Çalışma" open={sections.calisma} onClick={()=>setSections(s=>({...s,calisma:!s.calisma}))} />
          {sections.calisma && (
            <div className="space-y-3">
              <Field label="Çalışma Tipi">
                <Select name="working_type" value={filters["working_type"]||""} onSelect={(v)=>set("working_type", v)} options={["tam","yari","serbest"]} />
              </Field>
              <Field label="Çalışma Saatleri">
                <Select name="working_hours" value={filters["working_hours"]||""} onSelect={(v)=>set("working_hours", v)} options={["gunduz","gece","24"]} />
              </Field>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <SectionToggle label="Konum" open={sections.temel} onClick={()=>setSections(s=>({...s,temel:!s.temel}))} />
          {sections.temel && (
            <div className="space-y-3">
              <Field label="İl"><input className="w-full rounded-lg bg-white/10 px-3 py-2 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="İl" onChange={(e)=>set("province", e.target.value)} /></Field>
              <Field label="İlçe"><input className="w-full rounded-lg bg-white/10 px-3 py-2 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="İlçe" onChange={(e)=>set("district", e.target.value)} /></Field>
            </div>
          )}
          <SectionToggle label="Kurye Özellikleri" open={sections.calisma} onClick={()=>setSections(s=>({...s,calisma:!s.calisma}))} />
          {sections.calisma && (
            <div className="space-y-3">
              <Field label="Ehliyet"><Select name="license_type" value={filters["license_type"]||""} onSelect={(v)=>set("license_type", v)} options={["A1","A2","A"]} /></Field>
              <Field label="Çalışma Tipi"><Select name="working_type" value={filters["working_type"]||""} onSelect={(v)=>set("working_type", v)} options={["tam","yari","serbest"]} /></Field>
              <Field label="Çalışma Saatleri"><Select name="working_hours" value={filters["working_hours"]||""} onSelect={(v)=>set("working_hours", v)} options={["gunduz","gece","24"]} /></Field>
            </div>
          )}
        </div>
      )}
  </div>
  </aside>
  );
}

// Reusable tiny components
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] tracking-wide mb-1 text-white/70 uppercase">{label}</label>
      {children}
    </div>
  );
}
function SectionToggle({ label, open, onClick }: { label: string; open: boolean; onClick: ()=>void }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center justify-between text-sm font-semibold bg-white/10 px-3 py-2 rounded-lg hover:bg-white/15 transition">
      <span>{label}</span>
      <span className="text-xs">{open?"−":"+"}</span>
    </button>
  );
}
function Select({ name, options, value, onSelect }: { name: string; options: string[]; value: string; onSelect: (v:string)=>void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={()=>onSelect("")} className={`px-3 py-1 rounded-full border ${value===""?"bg-white text-black border-white text-black":"bg-white/10 border-white/25 text-white/90 hover:bg-white/15"}`}>Tümü</button>
      {options.map(opt => {
        const active = value === opt;
        return (
          <button
            type="button"
            key={opt}
            onClick={()=>onSelect(opt)}
            className={`px-3 py-1 rounded-full border ${active?"bg-white text-black border-white":"bg-white/10 border-white/25 text-white/90 hover:bg-white/15"}`}
            aria-pressed={active}
          >{opt}</button>
        );
      })}
    </div>
  );
}

