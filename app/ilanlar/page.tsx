"use client";
import React from "react";
import { RoleHeader } from "../_components/RoleHeader";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FilterPanel, Role } from "../hosgeldiniz/_components/FilterPanel";
import { ListingCard } from "../hosgeldiniz/_components/ListingCard";
import { Pagination } from "../hosgeldiniz/_components/Pagination";

export default function IlanlarPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 6;

  // Role detection
  useEffect(() => {
    const init = async () => {
      const { data: auth } = await supabase.auth.getSession();
      const uid = auth.session?.user?.id;
      if (!uid) { setLoading(false); return; }
      const { data: c } = await supabase.from("couriers").select("id").eq("user_id", uid).limit(1);
      if (c?.length) { setRole("kurye"); setLoading(false); return; }
      const { data: b } = await supabase.from("businesses").select("id").eq("user_id", uid).limit(1);
      if (b?.length) setRole("isletme");
      setLoading(false);
    };
    init();
  }, []);

  // Fetch content
  useEffect(() => {
    const run = async () => {
      if (!role) return;
      setLoading(true); setMessage(null);
      try {
        if (role === "kurye") {
          // Courier sees business ads
          let query = supabase.from("business_ads").select("id,title,description,province,district,working_type,working_hours,created_at").order("created_at", { ascending: false }).limit(60);
          if (filters.province) query = query.eq("province", filters.province);
          if (filters.district) query = query.eq("district", filters.district);
          if (filters.working_type) query = query.eq("working_type", filters.working_type);
          if (filters.working_hours) query = query.eq("working_hours", filters.working_hours);
          const { data, error } = await query;
          if (error) throw error;
          setItems(data || []); setPage(1);
        } else {
          // Business sees couriers (profiles) via public view if available
          let base = supabase.from("couriers_public");
          // try view first
          let query = base.select("id,first_name,last_name,avatar_url,phone,province,district,license_type,working_type,working_hours,created_at").order("created_at", { ascending: false }).limit(60);
          if (filters.province) query = query.eq("province", filters.province);
          if (filters.district) query = query.eq("district", filters.district);
          if (filters.license_type) query = query.eq("license_type", filters.license_type);
          if (filters.working_type) query = query.eq("working_type", filters.working_type);
          if (filters.working_hours) query = query.eq("working_hours", filters.working_hours);
          let { data, error } = await query;
          if (error) {
            // fallback to table (requires RLS select for all)
            let q2 = supabase.from("couriers").select("id,first_name,last_name,avatar_url,phone,province,district,license_type,working_type,working_hours,created_at").order("created_at", { ascending: false }).limit(60);
            if (filters.province) q2 = q2.eq("province", filters.province);
            if (filters.district) q2 = q2.eq("district", filters.district);
            if (filters.license_type) q2 = q2.eq("license_type", filters.license_type);
            if (filters.working_type) q2 = q2.eq("working_type", filters.working_type);
            if (filters.working_hours) q2 = q2.eq("working_hours", filters.working_hours);
            const r2 = await q2;
            data = r2.data;
            error = r2.error as any;
            if (error) throw error;
          }
          setItems(data || []); setPage(1);
        }
      } catch (e: any) {
        setItems([]); setMessage("Kuryeler şu anda listelenemiyor. Yönetici tarafında 'couriers_public' görüntüsü veya RLS ayarı gerekebilir.");
      } finally { setLoading(false); }
    };
    run();
  }, [role, filters]);

  const title = useMemo(() => role === "kurye" ? "İŞLETME İLANLARI" : role === "isletme" ? "KURYELER" : "İLANLAR", [role]);
  const paged = useMemo(() => items.slice((page-1)*pageSize, (page-1)*pageSize + pageSize), [items, page]);

  return (
    <main className="min-h-dvh w-full bg-gradient-to-b from-white to-neutral-100">
      <RoleHeader />
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 w-full md:block"><FilterPanel role={(role ?? "kurye") as Role} onChange={setFilters} /></div>
        <div className="flex-1 bg-white min-h-[calc(100vh-64px)] px-6 pt-8 pb-12 border-l border-neutral-200">
          <h1 className="text-3xl font-extrabold tracking-tight mb-8 text-black">{title}</h1>
          {loading ? (
            <div className="spinner" />
          ) : paged.length === 0 ? (
            <p className="text-black/70">{message ?? "Henüz kayıt yok."}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map(it => (
                <ListingCard
                  key={it.id}
                  title={role === 'isletme' ? `${it.first_name ?? ''} ${it.last_name ?? ''}`.trim() || 'Kurye' : (it.title ?? 'Başlık')}
                  subtitle={role === 'kurye' ? (it.description ?? '') : ''}
                  metaParts={[
                    it.province,
                    it.district,
                    role === 'isletme' ? it.license_type : it.working_type,
                    it.working_hours
                  ].filter(Boolean)}
                  imageUrl={role === 'isletme' ? (it.avatar_url ?? null) : null}
                  phone={role === 'isletme' ? (it.phone ?? null) : null}
                  showActions={role === 'isletme'}
                  time={it.created_at ? new Date(it.created_at).toLocaleDateString() : undefined}
                />
              ))}
            </div>
          )}
          <Pagination total={items.length} page={page} pageSize={pageSize} onPage={setPage} />
        </div>
      </div>
    </main>
  );
}
