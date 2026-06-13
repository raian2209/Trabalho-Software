"use client";

import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Save, ArrowLeft } from "lucide-react";
import { useCupons } from "@/hooks/queries/useCupons";
import { useUpdateCupom } from "@/hooks/mutations/useCupomMutations";
import { PageLoader } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/fields";

type CupomForm = {
  codigo: string;
  tipoDesconto: string;
  valorDesconto: string;
  dataValidade: string;
};

export default function EditarCupom() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  // A API não tem GET por id; reaproveitamos a lista (já em cache) e filtramos.
  const { data: cupons = [], isLoading } = useCupons();
  const updateCupom = useUpdateCupom(id);
  const { register, handleSubmit, reset } = useForm<CupomForm>();

  const cupom = cupons.find((c) => c.id.toString() === id);

  useEffect(() => {
    if (cupom) {
      reset({
        codigo: cupom.codigo,
        tipoDesconto: cupom.tipoDesconto,
        valorDesconto: String(cupom.valorDesconto),
        dataValidade: cupom.dataValidade || "",
      });
    } else if (!isLoading) {
      toast.error("Cupom não encontrado.");
      router.push("/admin/cupons");
    }
  }, [cupom, isLoading, reset, router]);

  const onSubmit = async (data: FieldValues) => {
    try {
      await updateCupom.mutateAsync(data as CupomForm);
      toast.success("Cupom atualizado!");
      setTimeout(() => router.push("/admin/cupons"), 1200);
    } catch {
      toast.error("Erro ao atualizar.");
    }
  };

  if (isLoading || !cupom) return <PageLoader />;

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
      <Card className="p-8 w-full max-w-md shadow-lg">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Código">
            <Input {...register("codigo", { required: true })} />
          </FormField>
          <FormField label="Tipo Desconto">
            <Select {...register("tipoDesconto")}>
              <option value="PERCENTAGEM">Porcentagem</option>
              <option value="FIXO">Valor Fixo</option>
            </Select>
          </FormField>
          <FormField label="Valor">
            <Input type="number" {...register("valorDesconto", { required: true })} />
          </FormField>
          <FormField label="Validade">
            <Input
              type="date"
              className="scheme-light dark:scheme-dark"
              {...register("dataValidade")}
            />
          </FormField>
          <Button
            type="submit"
            fullWidth
            className="mt-6 py-3"
            loading={updateCupom.isPending}
          >
            <Save className="w-5 h-5" /> Salvar Alterações
          </Button>
        </form>
      </Card>
    </div>
  );
}
