import { RoleGuard } from "@/components/auth/RoleGuard";

export default function UsuarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard role="ROLE_USUARIO">{children}</RoleGuard>;
}
