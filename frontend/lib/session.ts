import { Session } from "next-auth";

/**
 * Nome de exibição do usuário. Usa `nome` quando disponível; senão, o prefixo
 * do email; por fim "Visitante". Centraliza o fallback usado em vários lugares.
 */
export function getDisplayName(session?: Session | null): string {
  if (!session?.user) return "Visitante";
  return session.user.nome || session.user.email?.split("@")[0] || "Usuário";
}
