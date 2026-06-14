"use client";

import { useState, FormEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { UserCog, Save, Trash2, AlertTriangle } from "lucide-react";
import { useUpdatePerfil, useDeleteConta } from "@/hooks/mutations/usePerfilMutations";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/fields";

export default function PerfilPage() {
  const { data: session } = useSession();
  const confirm = useConfirm();
  const updatePerfil = useUpdatePerfil();
  const deleteConta = useDeleteConta();

  const [formData, setFormData] = useState({
    nome: session?.user?.nome || "",
    email: session?.user?.email || "",
    senha: "",
  });

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updatePerfil.mutateAsync({
        nome: formData.nome,
        email: formData.email,
        // Só envia a senha quando preenchida (em branco mantém a atual).
        ...(formData.senha ? { senha: formData.senha } : {}),
      });
      toast.success("Perfil atualizado! Faça login novamente.");
      setTimeout(() => signOut(), 2000);
    } catch {
      toast.error("Erro ao atualizar perfil.");
    }
  };

  const handleDeleteAccount = async () => {
    const ok = await confirm({
      title: "Excluir conta",
      message:
        "Isso excluirá sua conta permanentemente. Esta ação é irreversível.",
      danger: true,
      confirmText: "Excluir conta",
    });
    if (!ok) return;

    try {
      await deleteConta.mutateAsync();
      toast.success("Conta excluída.");
      signOut({ callbackUrl: "/register" });
    } catch {
      toast.error("Erro ao excluir conta.");
    }
  };

  return (
    <div className="h-full bg-page-bg dark:bg-slate-900 py-12 px-4 flex justify-center transition-colors duration-200">
      <Card className="w-full max-w-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-slate-700">
          <div className="bg-brand-purple/10 dark:bg-purple-900/20 p-3 rounded-full">
            <UserCog className="w-8 h-8 text-brand-purple dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Meu Perfil
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gerencie suas informações pessoais
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <FormField label="Nome Completo">
            <Input
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
            />
          </FormField>
          <FormField label="E-mail">
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </FormField>
          <FormField label="Nova Senha (opcional)">
            <Input
              type="password"
              placeholder="Deixe em branco para manter a atual"
              value={formData.senha}
              onChange={(e) =>
                setFormData({ ...formData, senha: e.target.value })
              }
            />
          </FormField>

          <Button
            type="submit"
            fullWidth
            className="py-3"
            loading={updatePerfil.isPending}
          >
            <Save className="w-5 h-5" />
            Atualizar Dados
          </Button>
        </form>

        <div className="mt-10 pt-6 border-t border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
          <h3 className="text-red-700 dark:text-red-400 font-bold flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" /> Zona de Perigo
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">
            A exclusão da conta é irreversível.
          </p>
          <Button
            type="button"
            variant="outlineDanger"
            fullWidth
            onClick={handleDeleteAccount}
            loading={deleteConta.isPending}
          >
            <Trash2 className="w-4 h-4" /> Excluir Minha Conta
          </Button>
        </div>
      </Card>
    </div>
  );
}
