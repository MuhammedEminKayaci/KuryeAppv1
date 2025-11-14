"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { RoleType } from "../../../types/registration";

export function RoleParamHandler({ setRole }: { setRole: (role: RoleType) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'kurye' || roleParam === 'isletme') {
      setRole(roleParam);
    }
  }, [searchParams, setRole]);

  return null;
}
