"use client";

import toast from "react-hot-toast";
import { useProdutos } from "@/hooks/queries/useProdutos";
import { useCart } from "@/context/CartContext";
import { ProductList } from "@/components/products/ProductList";
import { PageLoader } from "@/components/ui/Spinner";
import { Product } from "@/types/types";

export default function ProdutosPageUsuario() {
  const { data: produtos = [], isLoading } = useProdutos();
  const { addToCart } = useCart()!;

  const handleAddToCart = (produto: Product) => {
    addToCart(produto);
    toast.success(`${produto.nome} adicionado ao carrinho!`);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 transition-colors duration-200 py-8 px-4 container mx-auto">
      <ProductList
        produtos={produtos}
        loading={isLoading}
        isFornecedor={false}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
