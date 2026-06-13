"use client";

import { useSession } from "next-auth/react";

/** Token JWT do usuário autenticado (ou null). Usado pelas queries/mutations. */
export function useAuthToken(): string | null {
  const { data: session } = useSession();
  return session?.user?.token ?? null;
}
