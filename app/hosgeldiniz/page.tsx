"use client";
import React, { useEffect } from "react";

// Bu rota artık ana dashboard değil. Kullanıcıları /ilanlar sayfasına yönlendiriyoruz.
export default function HosgeldinizRedirect() {
  useEffect(() => { window.location.replace("/ilanlar"); }, []);
  return (
    <main className="min-h-dvh flex items-center justify-center bg-white">
      <p className="text-sm text-neutral-500">Yönlendiriliyor...</p>
    </main>
  );
}
