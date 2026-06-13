import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard role="ROLE_ADMIN">{children}</RoleGuard>;
}
