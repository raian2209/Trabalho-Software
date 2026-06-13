"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Lock, Save, Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import { resetPasswordAction } from "@/actions/password";
import { PageLoader } from "@/components/ui/Spinner";

type FormData = { novaSenha: string; confirmarSenha: string };

function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    setLoading(true);
    const result = await resetPasswordAction(token, data.novaSenha);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Senha redefinida com sucesso! Faça login.");
    router.push("/login");
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Link inválido
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          O link de recuperação está incompleto ou expirou. Solicite um novo.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center text-brand-purple dark:text-purple-400 font-medium hover:underline"
        >
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Redefinir senha
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Crie uma nova senha para sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
            Nova senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
              disabled={loading}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all
                bg-white dark:bg-slate-900 dark:text-white dark:placeholder-gray-500 dark:border-slate-600
                ${errors.novaSenha ? "border-red-500 ring-1 ring-red-500 dark:border-red-500" : "border-gray-300"}`}
              {...register("novaSenha", {
                required: "Digite a nova senha",
                minLength: {
                  value: 8,
                  message: "A senha deve ter no mínimo 8 caracteres",
                },
              })}
            />
          </div>
          {errors.novaSenha && (
            <p className="text-red-500 text-xs ml-1">
              {errors.novaSenha.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
            Confirmar senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="password"
              placeholder="Repita a nova senha"
              disabled={loading}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all
                bg-white dark:bg-slate-900 dark:text-white dark:placeholder-gray-500 dark:border-slate-600
                ${errors.confirmarSenha ? "border-red-500 ring-1 ring-red-500 dark:border-red-500" : "border-gray-300"}`}
              {...register("confirmarSenha", {
                required: "Confirme a senha",
                validate: (value, formValues) =>
                  value === formValues.novaSenha || "As senhas não coincidem",
              })}
            />
          </div>
          {errors.confirmarSenha && (
            <p className="text-red-500 text-xs ml-1">
              {errors.confirmarSenha.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-purple hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all disabled:opacity-70 dark:ring-offset-slate-800"
        >
          {loading ? (
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
          ) : (
            <Save className="-ml-1 mr-2 h-5 w-5" />
          )}
          {loading ? "Salvando..." : "Redefinir senha"}
        </button>

        <div className="text-center text-sm">
          <Link
            href="/login"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-brand-purple dark:hover:text-purple-400"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para o login
          </Link>
        </div>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center items-center h-full bg-page-bg dark:bg-slate-900 font-sans py-12 px-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-xl p-8 transition-colors duration-200">
        <Suspense fallback={<PageLoader />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
