"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductList from "@/components/ProductList";
import { Product } from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProdutosPageFornecedor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user.token}` },
      });
      if (res.ok) setProdutos((prev) => prev.filter((p) => p.id !== id));
      else alert("Erro ao excluir.");
    } catch (error) {
      console.error(error);
    }
  };

  // --- PROTEÇÃO DE ROTA ---
  useEffect(() => {
    if (status === "loading") return;
    if (
      status === "unauthenticated" ||
      session?.user?.role !== "ROLE_FORNECEDOR"
    ) {
      router.push("/"); // Manda para home se não for fornecedor
    }
    const fetchProdutos = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/produtos/produtos-vendedor`,
          {
            headers: { Authorization: `Bearer ${session?.user?.token}` },
          },
        );
        if (res.ok) {
          setProdutos(await res.json());
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, [status, session, router]);

  if (loading)
    return (
      <div className="h-full flex items-center justify-center bg-page-bg dark:bg-slate-900 transition-colors duration-200">
        <Loader2 className="animate-spin text-brand-purple dark:text-purple-400 w-10 h-10" />
      </div>
    );

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 transition-colors duration-200 py-8 px-4 container mx-auto">
      <ProductList
        produtos={produtos}
        loading={loading}
        isFornecedor={true}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}
