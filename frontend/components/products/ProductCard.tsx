"use client";

import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, ShoppingCart } from "lucide-react";
import { Product } from "@/types/types";
import { formatCurrency } from "@/lib/format";

type ProductCardProps = {
  produto: Product;
  isFornecedor: boolean;
  onDelete?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
};

export function ProductCard({
  produto,
  isFornecedor,
  onDelete,
  onAddToCart,
}: ProductCardProps) {
  const semEstoque = !isFornecedor && (produto.estoque ?? 0) <= 0;
  // Clientes navegam para a página de detalhes ao clicar no produto.
  const detailHref = isFornecedor ? null : `/usuario/produtos/${produto.id}`;

  const imagem = (
    <Image
      src={
        produto.imagem ||
        "https://placehold.co/300x300/F0F0F0/CCC?text=Sem+Imagem"
      }
      alt={produto.nome}
      fill
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={(e) => {
        e.currentTarget.src = "https://placehold.co/300x300?text=Erro";
      }}
    />
  );

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-lg transition-all flex flex-col group overflow-hidden">
      <div className="relative h-48 bg-gray-100 dark:bg-slate-700">
        {detailHref ? (
          <Link href={detailHref} className="block w-full h-full">
            {imagem}
          </Link>
        ) : (
          imagem
        )}
        {isFornecedor && (
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 dark:text-white px-2 py-1 rounded text-xs font-semibold shadow-sm">
            ID: {produto.id}
          </div>
        )}
        {semEstoque && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold shadow-sm">
            Esgotado
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col grow">
        <span className="text-xs font-semibold text-brand-purple bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full w-fit mb-2">
          {produto.categoria || "Geral"}
        </span>
        {detailHref ? (
          <Link href={detailHref}>
            <h3
              className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2 mb-2 hover:text-brand-purple dark:hover:text-purple-400 transition-colors"
              title={produto.nome}
            >
              {produto.nome}
            </h3>
          </Link>
        ) : (
          <h3
            className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2 mb-2"
            title={produto.nome}
          >
            {produto.nome}
          </h3>
        )}
        <div className="mt-auto mb-4">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(produto.preco || produto.precoNovo)}
          </div>
          {/* Estoque visível tanto para o fornecedor quanto para o cliente. */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isFornecedor ? "Estoque: " : "Disponível: "}
            <span
              className={
                (produto.estoque ?? 0) > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }
            >
              {(produto.estoque ?? 0) > 0
                ? `${produto.estoque} un.`
                : "Esgotado"}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
          {isFornecedor ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/fornecedor/produtos/${produto.id}/editar`}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <Edit className="w-4 h-4" /> Editar
              </Link>
              <button
                onClick={() => onDelete?.(produto.id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Excluir
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart?.(produto)}
              disabled={semEstoque}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-brand-purple rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              {semEstoque ? "Esgotado" : "Adicionar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
