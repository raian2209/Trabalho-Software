"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"; // Importando Toast
import OrderList from "@/components/OrderList";
import { Order } from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PedidosPageFornecedor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "ROLE_FORNECEDOR") {
      router.push("/");
      return;
    }

    if (session?.user?.token) {
      const fetchPedidos = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/pedidos/vendas`, {
            headers: { Authorization: `Bearer ${session.user.token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setPedidos(Array.isArray(data) ? data : []);
          } else {
            setPedidos([]);
            toast.error("Não foi possível carregar as vendas.");
          }
        } catch (err) {
          console.error(err);
          toast.error("Erro de conexão ao buscar vendas.");
        } finally {
          setLoading(false);
        }
      };
      fetchPedidos();
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-page-bg dark:bg-slate-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full font-sans bg-page-bg dark:bg-slate-900 transition-colors duration-300">
      {/* Configuração do Toast para modo escuro */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "dark:bg-slate-800 dark:text-white",
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-800 dark:text-gray-100">
        <OrderList
          pedidos={pedidos}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          title="Vendas / Pedidos Recebidos"
          isFornecedor={true}
        />
      </main>
    </div>
  );
}
