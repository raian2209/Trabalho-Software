"use server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function forgotPasswordAction(email: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      return { error: "Não foi possível processar a solicitação." };
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Falha na conexão com o servidor." };
  }
}

export async function resetPasswordAction(token: string, novaSenha: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, novaSenha }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { error: data?.erro || "Link inválido ou expirado." };
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Falha na conexão com o servidor." };
  }
}
