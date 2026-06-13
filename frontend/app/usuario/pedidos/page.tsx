"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { usePedidos } from "@/hooks/queries/usePedidos";
import { useCancelPedido } from "@/hooks/mutations/usePedidoMutations";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { OrderList } from "@/components/orders/OrderList";

export default function PedidosPageUsuario() {
  const { data: pedidos = [], isLoading } = usePedidos();
  const cancelPedido = useCancelPedido();
  const confirm = useConfirm();

  const handleCancel = async (id: string) => {
    const ok = await confirm({
      title: "Cancelar pedido",
      message: `Tem certeza que deseja cancelar o pedido #${id}?`,
      danger: true,
      confirmText: "Cancelar pedido",
      cancelText: "Voltar",
    });
    if (!ok) return;

    try {
      await cancelPedido.mutateAsync(id);
      toast.success("Pedido cancelado com sucesso!");
    } catch {
      toast.error("Não foi possível cancelar o pedido.");
    }
  };

  const emptyAction = (
    <Link
      href="/usuario/produtos"
      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-brand-purple hover:bg-opacity-90 dark:hover:bg-purple-600 transition-all"
    >
      Ir para a Loja
      <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
    </Link>
  );

  return (
    <div className="flex flex-col h-full font-sans bg-page-bg dark:bg-slate-900 transition-colors duration-300">
      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-800 dark:text-gray-100">
        <OrderList
          pedidos={pedidos}
          loading={isLoading}
          title="Minhas Compras"
          emptyStateAction={emptyAction}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}
