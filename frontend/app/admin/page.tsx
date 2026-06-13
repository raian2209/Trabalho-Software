"use client";

import Link from "next/link";
import Image from "next/image";
import { Ticket, LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AdminDashboard() {
  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 font-sans p-8 container mx-auto transition-colors duration-200">
      <PageHeader icon={LayoutDashboard} title="Painel Administrativo" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/cupons"
          className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">
              Promoções
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">
              Gerenciar Cupons
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full group-hover:bg-brand-purple group-hover:text-white dark:group-hover:bg-purple-600 transition-colors">
            <Ticket className="w-8 h-8 text-brand-purple dark:text-purple-400 group-hover:text-white" />
          </div>
        </Link>
        <Link
          href="/admin/usuarios"
          className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">
              Usuários
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">
              Contas
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors flex items-center justify-center">
            <Image
              src="/gadelha.png"
              alt="Gadelha"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
