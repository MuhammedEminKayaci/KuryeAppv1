"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CourierRegistration } from "../../../types/registration";

const courierSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter"),
  lastName: z.string().min(2, "Soyad en az 2 karakter"),
  gender: z.enum(["erkek", "kadin", "diger"]),
  birthYear: z.number().int().gte(new Date().getFullYear() - 80).lte(new Date().getFullYear() - 18, "18 yaşından büyük olmalısınız"),
  nationality: z.string().min(1, "Uyruk seçin"),
  licenseType: z.enum(["A1", "A2", "A"]),
  phone: z.string().regex(/^\+90\d{10}$/g, "Telefon +90 ve 10 hane olmalı"),
  province: z.string().min(1, "İl seçin"),
  district: z.string().min(1, "İlçe seçin"),
  workingHours: z.enum(["gunduz", "gece", "24"]),
  workingDays: z.array(z.string()).min(1, "En az bir gün seçin"),
  workingType: z.enum(["tam", "yari", "serbest"]),
  motoModel: z.string().min(2, "Model gerekli"),
  motoCc: z.number().int().positive("CC pozitif olmalı"),
  avatarFile: z.any().optional(),
});

export interface CourierFormProps {
  onSubmit: (data: CourierRegistration) => void;
  disabled?: boolean;
}

const provinces: Record<string, string[]> = {
  İstanbul: ["Kadıköy", "Beşiktaş", "Üsküdar"],
  Ankara: ["Çankaya", "Keçiören", "Yenimahalle"],
  İzmir: ["Konak", "Bornova", "Karşıyaka"],
};

const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export function CourierForm({ onSubmit, disabled }: CourierFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CourierRegistration>({
    resolver: zodResolver(courierSchema),
    defaultValues: {
      nationality: "Türkiye",
      workingHours: "gunduz",
      workingType: "tam",
      workingDays: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"],
      phone: "+90",
    } as any,
  });

  const selectedProvince = watch("province");
  const districts = selectedProvince ? provinces[selectedProvince] || [] : [];
  const avatarWatch = watch("avatarFile");
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (avatarWatch && avatarWatch.length > 0) {
      const url = URL.createObjectURL(avatarWatch[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [avatarWatch]);

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
          <label className="block text-xs font-medium text-white mb-1">Profil Fotoğrafı</label>
          <input type="file" accept="image/*" className="input-field" {...register("avatarFile")}/>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Ad</label>
          <input className="input-field" {...register("firstName")} placeholder="Ad" />
          {errors.firstName && <p className="text-xs text-white mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Soyad</label>
          <input className="input-field" {...register("lastName")} placeholder="Soyad" />
          {errors.lastName && <p className="text-xs text-white mt-1">{errors.lastName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Cinsiyet</label>
          <select className="input-field" {...register("gender")}> <option value="">Seçin</option><option value="erkek">Erkek</option><option value="kadin">Kadın</option><option value="diger">Diğer</option></select>
          {errors.gender && <p className="text-xs text-white mt-1">{errors.gender.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Doğum Yılı</label>
          <input type="number" className="input-field" {...register("birthYear", { valueAsNumber: true })} placeholder="1995" />
          {errors.birthYear && <p className="text-xs text-white mt-1">{errors.birthYear.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Uyruk</label>
          <select className="input-field" {...register("nationality")}> <option value="Türkiye">Türkiye</option><option value="Azerbaycan">Azerbaycan</option><option value="Gürcistan">Gürcistan</option><option value="Diğer">Diğer</option></select>
          {errors.nationality && <p className="text-xs text-white mt-1">{errors.nationality.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Ehliyet</label>
          <select className="input-field" {...register("licenseType")}> <option value="">Seçin</option><option value="A1">A1</option><option value="A2">A2</option><option value="A">A</option></select>
          {errors.licenseType && <p className="text-xs text-white mt-1">{errors.licenseType.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-white mb-1">Telefon (+90 otomatik)</label>
          <input className="input-field" {...register("phone")} placeholder="+90XXXXXXXXXX" />
          {errors.phone && <p className="text-xs text-white mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">İl</label>
          <select className="input-field" {...register("province")}> <option value="">Seçin</option>{Object.keys(provinces).map(p => <option key={p} value={p}>{p}</option>)}</select>
          {errors.province && <p className="text-xs text-white mt-1">{errors.province.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">İlçe</label>
          <select className="input-field" {...register("district")}> <option value="">Seçin</option>{districts.map(d => <option key={d} value={d}>{d}</option>)}</select>
          {errors.district && <p className="text-xs text-white mt-1">{errors.district.message}</p>}
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

      <div>
        <label className="block text-sm font-medium text-white mb-2">Çalışma Günleri</label>
        <div className="grid grid-cols-3 gap-2">
          {days.map(day => (
            <label key={day} className="flex items-center gap-2 text-xs text-white">
              <input type="checkbox" value={day} {...register("workingDays")} className="accent-[#ff7a00]" /> {day}
            </label>
          ))}
        </div>
        {errors.workingDays && <p className="text-xs text-white mt-1">{errors.workingDays.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Motosiklet Modeli</label>
          <input className="input-field" {...register("motoModel")} placeholder="Örn. Yamaha" />
          {errors.motoModel && <p className="text-xs text-white mt-1">{errors.motoModel.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Motosiklet CC</label>
          <input type="number" className="input-field" {...register("motoCc", { valueAsNumber: true })} placeholder="125" />
          {errors.motoCc && <p className="text-xs text-white mt-1">{errors.motoCc.message}</p>}
        </div>
      </div>

      <button type="submit" disabled={disabled} className="primary-btn">{disabled ? "Kaydediliyor..." : "Kurye Kaydını Tamamla"}</button>
    </form>
  );
}
