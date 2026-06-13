"use client";

import { useQuery } from "@tanstack/react-query";
import { cuponsApi } from "@/lib/api/cupons";
import { useAuthToken } from "../useAuthToken";

export const cupomKeys = {
  all: ["cupons"] as const,
  detail: (id: string) => ["cupons", id] as const,
};

/** Lista de cupons (admin). */
export function useCupons() {
  const token = useAuthToken();
  return useQuery({
    queryKey: cupomKeys.all,
    queryFn: () => cuponsApi.list(token!),
    enabled: !!token,
  });
}
