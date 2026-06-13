"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { Ticket, Plus, Trash2, Edit, CalendarOff } from "lucide-react";
import { useCupons } from "@/hooks/queries/useCupons";
import { useDeleteCupom } from "@/hooks/mutations/useCupomMutations";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { PageLoader } from "@/components/ui/Spinner";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function CuponsPage() {
  const { data: cupons = [], isLoading } = useCupons();
  const deleteCupom = useDeleteCupom();
  const confirm = useConfirm();

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Excluir cupom",
      message: "Tem certeza que deseja excluir este cupom?",
      danger: true,
      confirmText: "Excluir",
    });
    if (!ok) return;

    try {
      await deleteCupom.mutateAsync(id);
      toast.success("Cupom excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir cupom.");
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 font-sans p-8 transition-colors duration-200">
      <div className="container mx-auto max-w-5xl">
        <PageHeader
          icon={Ticket}
          title="Gerenciar Cupons"
          actions={
            <Link href="/admin/cupons/novo">
              <Button>
                <Plus className="w-5 h-5" />
                Novo Cupom
              </Button>
            </Link>
          }
        />

        <Card className="overflow-hidden">
          {cupons.length === 0 ? (
            <EmptyState icon={CalendarOff} title="Nenhum cupom cadastrado." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-600 dark:text-gray-300 font-semibold text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Código</th>
                    <th className="px-6 py-4">Desconto</th>
                    <th className="px-6 py-4">Validade</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {cupons.map((cupom) => (
                    <tr
                      key={cupom.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-brand-purple dark:text-purple-400">
                        {cupom.codigo}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {cupom.tipoDesconto === "PERCENTAGEM"
                          ? `${cupom.valorDesconto}%`
                          : `Kz ${cupom.valorDesconto}`}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {cupom.dataValidade || "Sem validade"}
                      </td>
                      <td className="px-6 py-4 flex justify-center gap-3">
                        <Link
                          href={`/admin/cupons/${cupom.id}/editar`}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(cupom.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
