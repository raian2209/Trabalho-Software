"use client";

import { useVendas } from "@/hooks/queries/usePedidos";
import { OrderList } from "@/components/orders/OrderList";

export default function PedidosPageFornecedor() {
  const { data: pedidos = [], isLoading } = useVendas();

  return (
    <div className="flex flex-col h-full font-sans bg-page-bg dark:bg-slate-900 transition-colors duration-300">
      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-800 dark:text-gray-100">
        <OrderList
          pedidos={pedidos}
          loading={isLoading}
          title="Vendas / Pedidos Recebidos"
          isFornecedor
        />
      </main>
    </div>
  );
}
