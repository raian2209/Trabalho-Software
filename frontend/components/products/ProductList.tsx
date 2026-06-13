"use client";

import { useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { Product } from "@/types/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { ProductCard } from "./ProductCard";

type ProductListProps = {
  produtos: Product[];
  loading: boolean;
  isFornecedor: boolean;
  onDelete?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
};

export function ProductList({
  produtos,
  loading,
  isFornecedor,
  onDelete,
  onAddToCart,
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = produtos.filter(
    (p) =>
      !p.deleted && p.nome?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        Carregando produtos...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {isFornecedor ? "Gerenciar Catálogo" : "Produtos Disponíveis"}
        </h1>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por nome..."
          className="w-full md:w-96"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filtered.length > 0 ? (
          filtered.map((produto) => (
            <ProductCard
              key={produto.id}
              produto={produto}
              isFornecedor={isFornecedor}
              onDelete={onDelete}
              onAddToCart={onAddToCart}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center border border-dashed border-gray-300 dark:border-slate-700 rounded-lg">
            <Package className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400">
              Nenhum produto encontrado.
            </p>
            {isFornecedor && (
              <Link
                href="/fornecedor/produtos/novo"
                className="mt-4 inline-block px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Cadastrar Produto
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
