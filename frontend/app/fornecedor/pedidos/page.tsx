"use client";

import toast from "react-hot-toast";
import { useVendas } from "@/hooks/queries/usePedidos";
import { useUpdateStatusVenda } from "@/hooks/mutations/usePedidoMutations";
import { OrderList } from "@/components/orders/OrderList";
import { OrderStatus } from "@/types/types";

export default function PedidosPageFornecedor() {
  const { data: pedidos = [], isLoading } = useVendas();
  const updateStatus = useUpdateStatusVenda();

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Pedido #${id} atualizado para ${status}.`);
    } catch {
      toast.error("Não foi possível atualizar o status.");
    }
  };

  return (
    <div className="flex flex-col h-full font-sans bg-page-bg dark:bg-slate-900 transition-colors duration-300">
      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-800 dark:text-gray-100">
        <OrderList
          pedidos={pedidos}
          loading={isLoading}
          title="Vendas / Pedidos Recebidos"
          isFornecedor
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
}
