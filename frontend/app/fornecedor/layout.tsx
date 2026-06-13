import { RoleGuard } from "@/components/auth/RoleGuard";

export default function FornecedorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard role="ROLE_FORNECEDOR">{children}</RoleGuard>;
}
