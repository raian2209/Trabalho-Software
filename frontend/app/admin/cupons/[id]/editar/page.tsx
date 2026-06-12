"use client";

import { useState, useEffect, SubmitEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Coupon } from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EditarCupom() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    codigo: "",
    tipoDesconto: "",
    valorDesconto: "",
    dataValidade: "",
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/cupons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Cupom atualizado!");
        setTimeout(() => router.push("/admin/cupons"), 1500);
      } else {
        toast.error("Erro ao atualizar.");
      }
    } catch {
      toast.error("Erro de conexão.");
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "ROLE_ADMIN") {
      router.push("/");
    }
    const fetchCupom = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/cupons`, {
          headers: { Authorization: `Bearer ${session?.user.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const cupom = data.find((c: Coupon) => c.id.toString() === id);
          if (cupom) {
            setFormData({
              codigo: cupom.codigo,
              tipoDesconto: cupom.tipoDesconto,
              valorDesconto: cupom.valorDesconto,
              dataValidade: cupom.dataValidade || "",
            });
          } else {
            // Se não encontrar na lista (ou endpoint retornar erro específico)
            toast.error("Cupom não encontrado.");
            router.push("/admin/cupons");
          }
        } else {
          toast.error("Erro ao carregar lista de cupons.");
        }
      } catch {
        toast.error("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchCupom();
  }, [status, session, router, id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg dark:bg-slate-900 transition-colors duration-200">
        <Loader2 className="animate-spin text-brand-purple dark:text-purple-400 w-10 h-10" />
      </div>
    );

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
      <Toaster position="top-right" />

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100 dark:border-slate-700 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Editar Cupom
          </h2>
          <Link
            href="/admin/cupons"
            className="text-gray-500 dark:text-gray-400 hover:text-brand-purple dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Código
            </label>
            <input
              type="text"
              value={formData.codigo}
              onChange={(e) =>
                setFormData({ ...formData, codigo: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-purple outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo Desconto
            </label>
            <select
              value={formData.tipoDesconto}
              onChange={(e) =>
                setFormData({ ...formData, tipoDesconto: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-purple transition-colors"
            >
              <option value="PERCENTAGEM">Porcentagem</option>
              <option value="FIXO">Valor Fixo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Valor
            </label>
            <input
              type="number"
              value={formData.valorDesconto}
              onChange={(e) =>
                setFormData({ ...formData, valorDesconto: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-purple transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Validade
            </label>
            <input
              type="date"
              value={formData.dataValidade}
              onChange={(e) =>
                setFormData({ ...formData, dataValidade: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-purple transition-colors scheme-light dark:scheme-dark"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-purple dark:text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-opacity-90 dark:hover:bg-purple-700 transition-colors mt-6 shadow-md dark:shadow-purple-900/20"
          >
            <Save className="w-5 h-5" /> Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
