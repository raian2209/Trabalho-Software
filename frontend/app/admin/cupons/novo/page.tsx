"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Ticket, Save, ArrowLeft } from "lucide-react";
import { useCreateCupom } from "@/hooks/mutations/useCupomMutations";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/fields";

export default function CadastroCupom() {
  const router = useRouter();
  const createCupom = useCreateCupom();
  const [formData, setFormData] = useState({
    codigo: "",
    tipoDesconto: "",
    valorDesconto: "",
    dataValidade: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.tipoDesconto) {
      toast.error("Selecione o tipo de desconto.");
      return;
    }
    try {
      await createCupom.mutateAsync(formData);
      toast.success("Cupom criado com sucesso!");
      setTimeout(() => router.push("/admin/cupons"), 1200);
    } catch {
      toast.error("Erro ao criar cupom. Verifique os dados.");
    }
  };

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 font-sans py-12 px-4 flex justify-center items-start transition-colors duration-200">
      <Card className="w-full max-w-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-brand-purple dark:text-purple-400" />
            Criar Novo Cupom
          </h2>
          <Link
            href="/admin/cupons"
            className="text-gray-500 dark:text-gray-400 hover:text-brand-purple dark:hover:text-purple-400 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Código do Cupom">
            <Input
              value={formData.codigo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  codigo: e.target.value.toUpperCase(),
                })
              }
              placeholder="Ex: NATAL15"
              className="uppercase"
              required
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Tipo de Desconto">
              <Select
                value={formData.tipoDesconto}
                onChange={(e) =>
                  setFormData({ ...formData, tipoDesconto: e.target.value })
                }
                required
              >
                <option value="">Selecione...</option>
                <option value="PERCENTAGEM">Porcentagem (%)</option>
                <option value="FIXO">Valor Fixo (Kz)</option>
              </Select>
            </FormField>

            <FormField label="Valor">
              <Input
                type="number"
                step="0.01"
                value={formData.valorDesconto}
                onChange={(e) =>
                  setFormData({ ...formData, valorDesconto: e.target.value })
                }
                required
                placeholder="Ex: 15"
              />
            </FormField>
          </div>

          <FormField label="Data de Validade">
            <Input
              type="date"
              value={formData.dataValidade}
              onChange={(e) =>
                setFormData({ ...formData, dataValidade: e.target.value })
              }
              className="scheme-light dark:scheme-dark"
            />
          </FormField>

          <Button
            type="submit"
            fullWidth
            className="mt-4 py-3"
            loading={createCupom.isPending}
          >
            <Save className="w-5 h-5" />
            Cadastrar Cupom
          </Button>
        </form>
      </Card>
    </div>
  );
}
