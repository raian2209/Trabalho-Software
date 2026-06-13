"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  PlusCircle,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";
import { useDashboardResumo } from "@/hooks/queries/useDashboard";
import { formatCurrency } from "@/lib/format";
import { getDisplayName } from "@/lib/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";

const QUICK_ACTIONS = [
  {
    href: "/fornecedor/produtos/novo",
    icon: PlusCircle,
    title: "Cadastrar Novo Produto",
    subtitle: "Adicione itens ao seu catálogo",
    iconBg:
      "bg-purple-100 dark:bg-purple-900/30 group-hover:bg-brand-purple",
    iconColor: "text-brand-purple dark:text-purple-300",
  },
  {
    href: "/fornecedor/produtos",
    icon: Package,
    title: "Gerenciar Catálogo",
    subtitle: "Edite ou remova seus produtos",
    iconBg: "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-600",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    href: "/fornecedor/pedidos",
    icon: ShoppingCart,
    title: "Ver Pedidos",
    subtitle: "Acompanhe suas vendas",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30 group-hover:bg-yellow-500",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
];

export default function FornecedorDashboard() {
  const { data: session } = useSession();
  const { data: stats } = useDashboardResumo();

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 font-sans transition-colors duration-200">
      <main className="container mx-auto px-4 py-8">
        <PageHeader
          icon={LayoutDashboard}
          title="Painel do Fornecedor"
          subtitle={
            <>
              Bem-vindo de volta,{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-200">
                {getDisplayName(session)}
              </span>
            </>
          }
        />

        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-l-4 border-brand-purple pl-3">
          Visão Geral
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Meus Produtos"
            value={stats?.totalProdutos ?? 0}
            icon={Package}
          />
          <StatCard
            label="Vendas Realizadas"
            value={stats?.totalVendas ?? 0}
            icon={ShoppingCart}
            accent="bg-yellow-400"
            iconWrapper="bg-yellow-50 dark:bg-yellow-900/20"
            iconClassName="text-yellow-500 dark:text-yellow-400"
          />
          <StatCard
            label="Faturamento Total"
            value={
              <span className="text-green-600 dark:text-green-400">
                {formatCurrency(stats?.faturamentoTotal)}
              </span>
            }
            icon={TrendingUp}
            accent="bg-green-500"
            iconWrapper="bg-green-50 dark:bg-green-900/20"
            iconClassName="text-green-500 dark:text-green-400"
          />
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-l-4 border-blue-500 pl-3">
          Gerenciamento Rápido
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map(
            ({ href, icon: Icon, title, subtitle, iconBg, iconColor }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center gap-3 text-center cursor-pointer"
              >
                <div
                  className={`p-4 rounded-full group-hover:text-white transition-colors duration-300 ${iconBg}`}
                >
                  <Icon className={`w-8 h-8 group-hover:text-white ${iconColor}`} />
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
                  {title}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {subtitle}
                </span>
              </Link>
            ),
          )}
        </div>
      </main>
    </div>
  );
}
