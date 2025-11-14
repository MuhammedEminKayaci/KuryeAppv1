"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BusinessRegistration } from "../../../types/registration";

const businessSchema = z.object({
  businessName: z.string().min(2, "İşletme adı gerekli"),
  managerFirstName: z.string().min(2, "Yetkili adı gerekli"),
  managerLastName: z.string().min(2, "Yetkili soyadı gerekli"),
  phone: z.string().regex(/^\+90\d{10}$/g, "Telefon +90 ve 10 hane olmalı"),
  address: z.string().min(10, "Adres daha detaylı olmalı"),
  workingType: z.enum(["tam", "yari", "serbest"]),
  workingHours: z.enum(["gunduz", "gece", "24"]),
  avatarFile: z.any().optional(),
});

export interface BusinessFormProps {
  onSubmit: (data: BusinessRegistration) => void;
  disabled?: boolean;
}

export function BusinessForm({ onSubmit, disabled }: BusinessFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BusinessRegistration>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      workingHours: "gunduz",
      workingType: "tam",
      phone: "+90",
    } as any,
  });
  const avatarDynamic = watch("avatarFile");
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    const list: FileList | undefined = avatarDynamic as any;
    if (list && list.length > 0) {
      const url = URL.createObjectURL(list[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [avatarDynamic]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-white/40 flex items-center justify-center border">
          {preview ? (
            <img src={preview} alt="Önizleme" className="object-cover w-full h-full" />
          ) : (
            <img src="/images/icon-profile.png" alt="Placeholder" className="object-contain w-12 h-12 opacity-70" />
          )}
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-white mb-1">İşletme Profil Fotoğrafı</label>
          <input type="file" accept="image/*" className="input-field" {...register("avatarFile")}/>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-white mb-1">İşletme Adı</label>
          <input className="input-field" {...register("businessName")} placeholder="Örn. Hızlı Paket" />
          {errors.businessName && <p className="text-xs text-white mt-1">{errors.businessName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Yetkili Adı</label>
          <input className="input-field" {...register("managerFirstName")} placeholder="Ad" />
          {errors.managerFirstName && <p className="text-xs text-white mt-1">{errors.managerFirstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Yetkili Soyadı</label>
          <input className="input-field" {...register("managerLastName")} placeholder="Soyad" />
          {errors.managerLastName && <p className="text-xs text-white mt-1">{errors.managerLastName.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-white mb-1">Şirket Telefonu (+90)</label>
          <input className="input-field" {...register("phone")} placeholder="+90XXXXXXXXXX" />
          {errors.phone && <p className="text-xs text-white mt-1">{errors.phone.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-white mb-1">Şirket Adresi</label>
          <textarea rows={3} className="input-field" {...register("address")} placeholder="Cadde, Mahalle, No ..." />
          {errors.address && <p className="text-xs text-white mt-1">{errors.address.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Çalışma Saatleri</label>
          <select className="input-field" {...register("workingHours")}> <option value="gunduz">Gündüz</option><option value="gece">Gece</option><option value="24">24 Saat</option></select>
          {errors.workingHours && <p className="text-xs text-white mt-1">{errors.workingHours.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Çalışma Tipi</label>
          <select className="input-field" {...register("workingType")}> <option value="tam">Tam Zamanlı</option><option value="yari">Yarı Zamanlı</option><option value="serbest">Serbest</option></select>
          {errors.workingType && <p className="text-xs text-white mt-1">{errors.workingType.message}</p>}
        </div>
      </div>

      <button type="submit" disabled={disabled} className="primary-btn">{disabled ? "Kaydediliyor..." : "İşletme Kaydını Tamamla"}</button>
    </form>
  );
}
