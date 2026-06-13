"use client";

import { FieldValues, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Save, PackagePlus } from "lucide-react";
import { useCreateProduto } from "@/hooks/mutations/useProdutoMutations";
import { CATEGORIAS_PRODUTO } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/fields";

type ProductData = {
  nome: string;
  categoria: string;
  descricao: string;
  preco: string;
  estoque: string;
  imagem: string;
};

export default function NovoProdutoPage() {
  const router = useRouter();
  const createProduto = useCreateProduto();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductData>();

  const onSubmit = async (data: FieldValues) => {
    try {
      await createProduto.mutateAsync({
        nome: data.nome,
        categoria: data.categoria,
        descricao: data.descricao,
        preco: parseFloat(data.preco),
        estoque: parseInt(data.estoque, 10),
        imagem: data.imagem || "https://placehold.co/300x300?text=Sem+Imagem",
      });
      toast.success("Produto cadastrado com sucesso!");
      setTimeout(() => router.push("/fornecedor/produtos"), 1200);
    } catch {
      toast.error("Erro ao cadastrar produto. Verifique os dados.");
    }
  };

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 font-sans pb-12 transition-colors duration-200">
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-purple dark:bg-purple-600 p-2 rounded-lg text-white shadow-lg shadow-purple-900/20">
              <PackagePlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Novo Produto
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adicione um novo item ao seu catálogo
              </p>
            </div>
          </div>

          <Link
            href="/fornecedor/produtos"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-purple-400 transition-colors text-sm font-medium bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Lista
          </Link>
        </div>

        <Card className="shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              label="Nome do Produto"
              required
              error={errors.nome?.message}
            >
              <Input
                placeholder="Ex: Smartphone Samsung Galaxy A54"
                error={!!errors.nome}
                {...register("nome", {
                  required: "Nome do produto é obrigatório.",
                  minLength: { value: 3, message: "Mínimo de 3 caracteres." },
                })}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Categoria"
                required
                error={errors.categoria?.message}
              >
                <Select
                  error={!!errors.categoria}
                  {...register("categoria", {
                    required: "Selecione uma categoria.",
                  })}
                >
                  <option value="">Selecione...</option>
                  {CATEGORIAS_PRODUTO.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Preço (Kz)"
                required
                error={errors.preco?.message}
              >
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  error={!!errors.preco}
                  {...register("preco", {
                    required: "Preço é obrigatório.",
                    min: {
                      value: 0.1,
                      message: "O preço deve ser maior que zero.",
                    },
                  })}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Estoque Inicial"
                required
                error={errors.estoque?.message}
              >
                <Input
                  type="number"
                  placeholder="0"
                  error={!!errors.estoque}
                  {...register("estoque", {
                    required: "Estoque é obrigatório.",
                    min: { value: 0, message: "Estoque não pode ser negativo." },
                    validate: (value) =>
                      Number.isInteger(parseFloat(value)) ||
                      "Deve ser um número inteiro.",
                  })}
                />
              </FormField>

              <FormField
                label="URL da Imagem"
                hint="Opcional. Uma imagem padrão será usada se vazio."
              >
                <Input placeholder="https://..." {...register("imagem")} />
              </FormField>
            </div>

            <FormField
              label="Descrição Detalhada"
              required
              error={errors.descricao?.message}
            >
              <Textarea
                rows={5}
                placeholder="Descreva as principais características do produto..."
                error={!!errors.descricao}
                {...register("descricao", {
                  required: "A descrição é obrigatória.",
                })}
              />
            </FormField>

            <div className="pt-4 flex items-center justify-end border-t border-gray-100 dark:border-slate-700 mt-6 gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" size="lg" loading={createProduto.isPending}>
                <Save className="w-5 h-5" />
                Cadastrar Produto
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
