"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  User,
  ShoppingCart,
  LayoutDashboard,
  Clock,
  ArrowRight,
} from "lucide-react";
import { usePedidos } from "@/hooks/queries/usePedidos";
import { formatCurrency, formatDate } from "@/lib/format";
import { getDisplayName } from "@/lib/session";
import { PageLoader } from "@/components/ui/Spinner";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function UserDashboard() {
  const { data: session } = useSession();
  const { data: pedidos = [], isLoading } = usePedidos();

  if (isLoading) return <PageLoader />;

  const ultimosPedidos = pedidos.slice(0, 3);
  const nome = getDisplayName(session);

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 font-sans transition-colors duration-200">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-brand-purple dark:text-purple-400" />
            Minha Conta
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Olá,{" "}
            <span className="font-semibold text-brand-purple dark:text-purple-400">
              {nome}
            </span>
            ! Bem-vindo de volta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            label="Fazer Compras"
            value={<span className="text-xl">Ir para a Loja</span>}
            icon={ShoppingBag}
            href="/usuario/produtos"
          />
          <StatCard
            label="Histórico"
            value={
              <>
                {pedidos.length}{" "}
                <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
                  pedidos
                </span>
              </>
            }
            icon={Package}
            accent="bg-blue-500"
            iconWrapper="bg-blue-50 dark:bg-blue-900/20"
            iconClassName="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            label="Meu Carrinho"
            value={<span className="text-xl">Ver Itens</span>}
            icon={ShoppingCart}
            href="/usuario/carrinho"
            accent="bg-yellow-400"
            iconWrapper="bg-yellow-50 dark:bg-yellow-900/20"
            iconClassName="text-yellow-600 dark:text-yellow-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                Pedidos Recentes
              </h2>
              <Link
                href="/usuario/pedidos"
                className="text-brand-purple dark:text-purple-400 text-sm font-semibold hover:underline flex items-center group"
              >
                Ver todos{" "}
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
              {ultimosPedidos.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                  {ultimosPedidos.map((pedido) => (
                    <div
                      key={pedido.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 dark:bg-slate-700 p-2 rounded-full hidden sm:block">
                          <Package className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 dark:text-white">
                            Pedido #{pedido.id}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(pedido.dataPedido || pedido.data)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <StatusBadge status={pedido.status} />
                        <p className="font-bold text-gray-800 dark:text-white min-w-22.5 text-right">
                          {formatCurrency(pedido.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-600 mb-3" />
                  <p className="text-lg font-medium">
                    Você ainda não fez nenhum pedido.
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                    Explore nossa loja e encontre os melhores produtos.
                  </p>
                  <Link
                    href="/usuario/produtos"
                    className="inline-flex items-center px-6 py-3 bg-brand-purple text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition shadow-md hover:shadow-lg dark:shadow-purple-900/20"
                  >
                    Começar a Comprar <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              Meus Dados
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-colors duration-200">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="h-20 w-20 bg-linear-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-full flex items-center justify-center text-brand-purple dark:text-purple-300 font-bold text-3xl border-4 border-white dark:border-slate-700 shadow-sm mb-3">
                  {nome[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white text-lg">
                    {nome}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm break-all">
                    {session?.user?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/usuario/perfil"
                  className="flex items-center justify-center w-full py-2.5 px-4 bg-gray-50 hover:bg-white hover:border-brand-purple text-gray-700 hover:text-brand-purple rounded-lg text-sm font-medium transition border border-gray-200 group dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200 dark:border-slate-600 dark:hover:border-purple-400 dark:hover:text-purple-300"
                >
                  <User className="w-4 h-4 mr-2 text-gray-400 group-hover:text-brand-purple dark:text-gray-400 dark:group-hover:text-purple-300" />
                  Gerenciar Perfil
                </Link>
                <Link
                  href="/usuario/pedidos"
                  className="flex items-center justify-center w-full py-2.5 px-4 bg-gray-50 hover:bg-white hover:border-blue-500 text-gray-700 hover:text-blue-600 rounded-lg text-sm font-medium transition border border-gray-200 group dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200 dark:border-slate-600 dark:hover:border-blue-400 dark:hover:text-blue-300"
                >
                  <Package className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-300" />
                  Meus Pedidos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
