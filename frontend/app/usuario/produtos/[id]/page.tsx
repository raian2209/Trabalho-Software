"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Minus,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useProduto } from "@/hooks/queries/useProdutos";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/format";
import { PageLoader } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DetalheProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: produto, isLoading, isError } = useProduto(id);
  const { addToCart } = useCart()!;
  const [quantidade, setQuantidade] = useState(1);

  if (isLoading) return <PageLoader />;

  if (isError || !produto) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 bg-page-bg dark:bg-slate-900 text-gray-500 dark:text-gray-400">
        <Package className="w-12 h-12 opacity-40" />
        <p className="text-lg font-medium">Produto não encontrado.</p>
        <Link
          href="/usuario/produtos"
          className="text-brand-purple dark:text-purple-400 hover:underline"
        >
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const estoque = produto.estoque ?? 0;
  const semEstoque = estoque <= 0;
  const preco = produto.preco || produto.precoNovo;

  const alterarQuantidade = (delta: number) => {
    setQuantidade((q) => Math.min(Math.max(1, q + delta), estoque));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantidade; i++) addToCart(produto);
    toast.success(
      `${quantidade}x ${produto.nome} adicionado(s) ao carrinho!`,
    );
    router.push("/usuario/carrinho");
  };

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 transition-colors duration-200 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <Link
          href="/usuario/produtos"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-purple-400 transition-colors text-sm font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para a loja
        </Link>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Imagem */}
            <div className="relative h-72 md:h-full min-h-[20rem] bg-gray-100 dark:bg-slate-700">
              <Image
                src={
                  produto.imagem ||
                  "https://placehold.co/600x600/F0F0F0/CCC?text=Sem+Imagem"
                }
                alt={produto.nome}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x600?text=Erro";
                }}
              />
            </div>

            {/* Detalhes */}
            <div className="p-6 md:p-8 flex flex-col">
              <span className="text-xs font-semibold text-brand-purple bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full w-fit mb-3">
                {produto.categoria || "Geral"}
              </span>

              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {produto.nome}
              </h1>

              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {formatCurrency(preco)}
              </div>

              {/* Disponibilidade / quantidade em estoque */}
              <div className="flex items-center gap-2 mb-6 text-sm font-medium">
                {semEstoque ? (
                  <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <XCircle className="w-4 h-4" /> Produto esgotado
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    {estoque} unidade{estoque > 1 ? "s" : ""} em estoque
                  </span>
                )}
              </div>

              {produto.descricao && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                    {produto.descricao}
                  </p>
                </div>
              )}

              {/* Seletor de quantidade + adicionar */}
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
                {!semEstoque && (
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quantidade
                    </span>
                    <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-md">
                      <button
                        onClick={() => alterarQuantidade(-1)}
                        disabled={quantidade <= 1}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-medium text-gray-700 dark:text-gray-200">
                        {quantidade}
                      </span>
                      <button
                        onClick={() => alterarQuantidade(1)}
                        disabled={quantidade >= estoque}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                )}

                <Button
                  fullWidth
                  size="lg"
                  disabled={semEstoque}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {semEstoque ? "Esgotado" : "Adicionar ao Carrinho"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
