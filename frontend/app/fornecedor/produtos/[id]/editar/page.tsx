"use client";

import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Package } from "lucide-react";
import { useProduto } from "@/hooks/queries/useProdutos";
import { useUpdateProduto } from "@/hooks/mutations/useProdutoMutations";
import { CATEGORIAS_PRODUTO } from "@/lib/constants";
import { PageLoader } from "@/components/ui/Spinner";
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

export default function EditarProdutoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: produto, isLoading, isError } = useProduto(id);
  const updateProduto = useUpdateProduto(id);
  const { register, handleSubmit, reset } = useForm<ProductData>();

  useEffect(() => {
    if (produto) {
      reset({
        nome: produto.nome,
        categoria: produto.categoria ?? "",
        descricao: produto.descricao,
        preco: String(produto.preco ?? ""),
        estoque: String(produto.estoque ?? 0),
        imagem: produto.imagem ?? "",
      });
    }
  }, [produto, reset]);

  useEffect(() => {
    if (isError) {
      toast.error("Erro ao carregar produto.");
      router.push("/fornecedor/produtos");
    }
  }, [isError, router]);

  const onSubmit = async (data: FieldValues) => {
    try {
      await updateProduto.mutateAsync({
        nome: data.nome,
        categoria: data.categoria,
        descricao: data.descricao,
        preco: parseFloat(data.preco),
        estoque: parseInt(data.estoque, 10),
        imagem: data.imagem,
      });
      toast.success("Produto atualizado!");
      setTimeout(() => router.push("/fornecedor/produtos"), 1200);
    } catch {
      toast.error("Erro ao atualizar produto.");
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 font-sans pb-12 transition-colors duration-200">
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-purple dark:bg-purple-600 p-2 rounded-lg text-white shadow-lg shadow-purple-900/20">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Editar Produto
            </h1>
          </div>
          <Link
            href="/fornecedor/produtos"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-purple-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar
          </Link>
        </div>

        <Card className="shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="Nome">
              <Input {...register("nome", { required: true })} />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Categoria">
                <Select {...register("categoria", { required: true })}>
                  {CATEGORIAS_PRODUTO.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Preço (Kz)">
                <Input
                  type="number"
                  step="0.01"
                  {...register("preco", { required: true })}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Estoque">
                <Input
                  type="number"
                  {...register("estoque", { required: true })}
                />
              </FormField>
              <FormField label="Imagem URL">
                <Input placeholder="https://..." {...register("imagem")} />
              </FormField>
            </div>

            <FormField label="Descrição">
              <Textarea rows={4} {...register("descricao", { required: true })} />
            </FormField>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" loading={updateProduto.isPending}>
                <Save className="w-5 h-5" />
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
