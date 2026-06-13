"use client";

import toast from "react-hot-toast";
import { useProdutosVendedor } from "@/hooks/queries/useProdutos";
import { useDeleteProduto } from "@/hooks/mutations/useProdutoMutations";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { ProductList } from "@/components/products/ProductList";
import { PageLoader } from "@/components/ui/Spinner";

export default function ProdutosPageFornecedor() {
  const { data: produtos = [], isLoading } = useProdutosVendedor();
  const deleteProduto = useDeleteProduto();
  const confirm = useConfirm();

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Excluir produto",
      message: "Tem certeza que deseja excluir este produto?",
      danger: true,
      confirmText: "Excluir",
    });
    if (!ok) return;

    try {
      await deleteProduto.mutateAsync(id);
      toast.success("Produto excluído.");
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 transition-colors duration-200 py-8 px-4 container mx-auto">
      <ProductList
        produtos={produtos}
        loading={isLoading}
        isFornecedor
        onDelete={handleDelete}
      />
    </div>
  );
}
