import { Shield } from "lucide-react";
import { Role } from "@/types/types";

export function RoleBadge({ role }: { role: Role }) {
  if (role === "ROLE_ADMIN") {
    return (
      <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 py-1 px-3 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
        <Shield size={12} /> ADMIN
      </span>
    );
  }
  if (role === "ROLE_FORNECEDOR") {
    return (
      <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 py-1 px-3 rounded-full text-xs font-bold w-fit">
        FORNECEDOR
      </span>
    );
  }
  return (
    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 py-1 px-3 rounded-full text-xs font-bold w-fit">
      CLIENTE
    </span>
  );
}
