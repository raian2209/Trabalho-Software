"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Role } from "@/types/types";
import { PageLoader } from "@/components/ui/Spinner";

type RoleGuardProps = {
  role: Role;
  children: React.ReactNode;
};

/**
 * Protege uma área inteira por role. Usado nos layouts de segmento
 * (admin/fornecedor/usuario), removendo a checagem repetida de cada página.
 * Páginas filhas podem assumir sessão válida com a role correta.
 */
export function RoleGuard({ role, children }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== role) {
      router.replace("/");
    }
  }, [status, session, role, router]);

  if (status === "loading") return <PageLoader />;
  if (status !== "authenticated" || session?.user?.role !== role) return null;

  return <>{children}</>;
}
