"use client";
import React from "react";
import Image from "next/image";

interface ListingCardProps {
  title: string;
  subtitle?: string;
  meta?: string; // backward compatibility
  metaParts?: string[]; // preferred: individual meta chips
  time?: string;
  imageUrl?: string | null;
  phone?: string | null; // for WhatsApp & call actions
  showActions?: boolean; // show action buttons
}

// Modern listing card with avatar + chips + action buttons
export function ListingCard({ title, subtitle, meta, metaParts, time, imageUrl, phone, showActions }: ListingCardProps) {
  const chips = (metaParts && metaParts.length ? metaParts : (meta ? meta.split(" • ") : [])).filter(Boolean);
  const showImage = !!imageUrl;

  const handleWhatsApp = () => {
    if (!phone) return;
    const cleaned = phone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Merhaba ${title}, kurye ilanınız hakkında bilgi almak istiyorum.`);
    window.open(`https://wa.me/${cleaned}?text=${msg}`, '_blank');
  };

  const handleCall = () => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 overflow-hidden">
      {/* Top visual */}
      <div className="relative w-full h-44 flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
        {showImage ? (
          <Image
            src={imageUrl!}
            alt={title}
            width={280}
            height={176}
            className="h-full w-full object-cover"
            onError={(e: any) => { e.currentTarget.src = '/images/icon-profile.png'; }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-60">
            <Image src="/images/icon-profile.png" alt="Görsel" width={80} height={80} className="opacity-80" />
            <span className="text-xs text-neutral-500 font-medium">Fotoğraf yok</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5" />
        {time && (
          <div className="absolute top-3 right-3 text-[11px] font-semibold text-neutral-800 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full shadow-md border border-neutral-200">
            {time}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h4 className="text-lg font-bold text-black tracking-tight line-clamp-1 group-hover:text-orange-600 transition">{title}</h4>
        {subtitle && <p className="text-sm text-neutral-700 leading-relaxed line-clamp-2">{subtitle}</p>}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {chips.map((c, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-800 border border-neutral-200 group-hover:from-orange-50 group-hover:to-orange-100 group-hover:border-orange-300 group-hover:text-orange-700 transition-all"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && phone && (
        <div className="border-t border-neutral-200 bg-neutral-50/50 p-3 flex gap-2">
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Mesaj
          </button>
          <button
            onClick={handleCall}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Ara
          </button>
        </div>
      )}

      {/* Accent bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
