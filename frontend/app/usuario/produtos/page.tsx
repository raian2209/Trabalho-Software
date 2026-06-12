"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductList from "@/components/ProductList";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProdutosPageUsuario() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart()!;

  const handleAddToCart = (produto: Product) => {
    addToCart(produto);
    alert(`${produto.nome} adicionado ao carrinho!`);
  };

  // --- PROTEÇÃO DE ROTA ---
  useEffect(() => {
    if (status === "loading") return;
    if (
      status === "unauthenticated" ||
      session?.user?.role !== "ROLE_USUARIO"
    ) {
      router.push("/"); // Manda para home se não for usuario
    }
    const fetchProdutos = async () => {
      try {
        const headers: { "Content-Type": string; Authorization?: string } = {
          "Content-Type": "application/json",
        };
        if (session?.user?.token)
          headers["Authorization"] = `Bearer ${session.user.token}`;

        const res = await fetch(`${API_BASE_URL}/api/produtos`, { headers });
        if (res.ok) {
          setProdutos(await res.json());
        } else {
          setProdutos([]);
        }
      } catch (error) {
        console.error("Erro conexão", error);
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
        isFornecedor={false}
        onAddToCart={handleAddToCart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}
