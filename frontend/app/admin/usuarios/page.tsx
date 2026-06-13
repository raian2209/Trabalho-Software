"use client";

import { Users, User, Mail, AlertCircle } from "lucide-react";
import { useUsuarios } from "@/hooks/queries/useUsuarios";
import { PageLoader } from "@/components/ui/Spinner";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { RoleBadge } from "@/components/ui/RoleBadge";

export default function UsuariosPage() {
  const { data: usuarios = [], isLoading } = useUsuarios();

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 font-sans p-8 transition-colors duration-200">
      <div className="container mx-auto max-w-6xl">
        <PageHeader icon={Users} title="Gerenciar Usuários" />

        <Card className="overflow-hidden">
          {usuarios.length === 0 ? (
            <EmptyState icon={AlertCircle} title="Nenhum usuário encontrado." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-600 dark:text-gray-300 font-semibold text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Usuário</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Perfil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {usuarios.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 dark:bg-slate-700 p-2 rounded-full text-gray-500 dark:text-gray-400">
                            <User size={18} />
                          </div>
                          <span className="font-medium text-gray-700 dark:text-white">
                            {usuario.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="opacity-50" />
                          {usuario.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={usuario.role} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
