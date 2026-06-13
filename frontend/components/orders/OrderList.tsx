"use client";

import { ReactNode, useState } from "react";
import { ShoppingBag, Filter, Search, Package } from "lucide-react";
import { Order, OrderStatus } from "@/types/types";
import { FILTRO_STATUS_PEDIDO } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { NormalizedOrder, OrderRow } from "./OrderRow";

type OrderListProps = {
  pedidos: Order[];
  loading: boolean;
  title?: string;
  isFornecedor?: boolean;
  emptyStateAction?: ReactNode;
  onCancel?: (id: string) => void;
  onStatusChange?: (id: string, status: OrderStatus) => void;
};

function normalize(p: Order, isFornecedor: boolean): NormalizedOrder {
  if (isFornecedor) {
    return {
      id: p.pedidoId || p.id,
      mainInfo: p.nomeProduto || "Vários Itens",
      subInfo: `Qtd: ${p.quantidade || "-"} | Cliente: ${p.clienteNome || "N/A"}`,
      data: p.dataVenda || p.dataPedido,
      status: p.status,
      total: p.subtotal || p.total,
    };
  }
  return {
    id: p.id,
    mainInfo: p.clienteNome || p.cliente || "WartMart Shop",
    subInfo: p.itens ? `${p.itens.length} itens` : "Ver detalhes",
    data: p.dataPedido || p.data,
    status: p.status,
    total: p.total,
  };
}

export function OrderList({
  pedidos,
  loading,
  title = "Meus Pedidos",
  isFornecedor = false,
  emptyStateAction = null,
  onCancel,
  onStatusChange,
}: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const filtered = pedidos
    .map((p) => normalize(p, isFornecedor))
    .filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        item.id?.toString().includes(term) ||
        item.mainInfo.toLowerCase().includes(term) ||
        (isFornecedor && item.subInfo.toLowerCase().includes(term));
      const matchStatus =
        filtroStatus === "todos" ||
        item.status?.toString().toLowerCase() === filtroStatus;
      return matchSearch && matchStatus;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple mb-4"></div>
        <p>Carregando registros...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          {isFornecedor ? (
            <Package className="w-8 h-8 text-brand-purple dark:text-purple-400" />
          ) : (
            <ShoppingBag className="w-8 h-8 text-brand-purple dark:text-purple-400" />
          )}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
            {title}
          </h1>
        </div>

        {pedidos.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400 dark:text-slate-500" />
              </div>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-purple appearance-none bg-white cursor-pointer dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100 dark:focus:ring-purple-500"
              >
                {FILTRO_STATUS_PEDIDO.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-purple dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100 dark:placeholder-slate-500 dark:focus:ring-purple-500"
                placeholder={
                  isFornecedor
                    ? "Buscar ID, Produto ou Cliente..."
                    : "Buscar ID..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <Card className="overflow-hidden">
        {pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-full mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Lista vazia
            </h3>
            <p className="text-gray-500 dark:text-slate-400 max-w-sm mb-6">
              Não há registros no momento.
            </p>
            {emptyStateAction}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-slate-400">
            <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-700 mb-3" />
            <p className="text-lg font-medium">Nenhum resultado encontrado.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFiltroStatus("todos");
              }}
              className="mt-4 text-brand-purple dark:text-purple-400 hover:underline text-sm font-medium"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-slate-900/40 border-b border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              <div className="col-span-1">ID</div>
              <div className="col-span-3">
                {isFornecedor ? "Produto / Cliente" : "Loja / Detalhes"}
              </div>
              <div className="col-span-2">Data</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">
                {isFornecedor ? "Faturamento" : "Total"}
              </div>
              <div className="col-span-2 text-center">Ações</div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {filtered.map((item, index) => (
                <OrderRow
                  key={`${item.id}-${index}`}
                  item={item}
                  isFornecedor={isFornecedor}
                  onCancel={onCancel}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
