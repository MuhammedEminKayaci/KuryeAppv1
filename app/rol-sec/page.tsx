"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function RolSecPage() {
  const [selected, setSelected] = useState<"kurye" | "isletme" | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (!selected) return;
    // Rol seçildikten sonra kayıt formuna yönlendir
    router.push(`/kayit-ol?role=${selected}`);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-3">
            Hesap Türünüzü Seçin
          </h1>
          <p className="text-neutral-600 text-lg">
            MottoKurye'de nasıl yer almak istersiniz?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kurye Card */}
          <button
            onClick={() => setSelected("kurye")}
            className={`group relative rounded-3xl p-8 border-2 transition-all duration-300 ${
              selected === "kurye"
                ? "border-orange-500 bg-orange-50 shadow-2xl scale-[1.02]"
                : "border-neutral-200 bg-white hover:border-orange-300 hover:shadow-lg"
            }`}
          >
            <div className="flex flex-col items-center text-center gap-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center transition ${
                selected === "kurye" ? "bg-orange-500" : "bg-neutral-100 group-hover:bg-orange-100"
              }`}>
                <svg className={`w-12 h-12 transition ${selected === "kurye" ? "text-white" : "text-neutral-600 group-hover:text-orange-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">Kurye</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  İşletmelerle bağlantı kur, esnek çalışma saatleriyle gelir elde et
                </p>
              </div>
              {selected === "kurye" && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>

          {/* İşletme Card */}
          <button
            onClick={() => setSelected("isletme")}
            className={`group relative rounded-3xl p-8 border-2 transition-all duration-300 ${
              selected === "isletme"
                ? "border-orange-500 bg-orange-50 shadow-2xl scale-[1.02]"
                : "border-neutral-200 bg-white hover:border-orange-300 hover:shadow-lg"
            }`}
          >
            <div className="flex flex-col items-center text-center gap-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center transition ${
                selected === "isletme" ? "bg-orange-500" : "bg-neutral-100 group-hover:bg-orange-100"
              }`}>
                <svg className={`w-12 h-12 transition ${selected === "isletme" ? "text-white" : "text-neutral-600 group-hover:text-orange-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">İşletme</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Güvenilir kuryeler bul, teslimatlarını hızlıca gerçekleştir
                </p>
              </div>
              {selected === "isletme" && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 ${
              selected
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Devam Et
          </button>
        </div>
      </div>
    </main>
  );
}
