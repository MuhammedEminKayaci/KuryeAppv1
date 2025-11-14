"use client";
import React from "react";

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPage: (p: number) => void;
}

export function Pagination({ total, page, pageSize, onPage }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const go = (p: number) => { if (p >= 1 && p <= pageCount) onPage(p); };
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex items-center gap-4 px-6 py-2 rounded-full border border-black shadow bg-white/90 text-black text-sm font-semibold">
        <button onClick={()=>go(page-1)} disabled={page===1} className="disabled:opacity-40">←</button>
        {pages.map(p => (
          <button key={p} onClick={()=>go(p)} className={`px-1 ${p===page?"scale-110 underline" : ""}`}>{p}</button>
        ))}
        <button onClick={()=>go(page+1)} disabled={page===pageCount} className="disabled:opacity-40">→</button>
      </div>
    </div>
  );
}
