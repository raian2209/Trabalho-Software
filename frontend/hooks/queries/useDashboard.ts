"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { useAuthToken } from "../useAuthToken";

/** Resumo do painel do fornecedor (produtos, vendas, faturamento). */
export function useDashboardResumo() {
  const token = useAuthToken();
  return useQuery({
    queryKey: ["dashboard", "resumo"],
    queryFn: () => dashboardApi.resumo(token!),
    enabled: !!token,
  });
}
