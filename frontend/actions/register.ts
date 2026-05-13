"use server";

import { Role } from "@/types/types";

const API_BASE_URL = process.env.API_BASE_URL;

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export async function registerAction(data: RegisterData) {
  // Define o endpoint baseado na escolha do usuário
  // Se for fornecedor -> /fornecedor, caso contrário -> /usuario
  const endpoint = data.role === "ROLE_FORNECEDOR" ? "/fornecedor" : "/usuario";

  const apiUrl = `${API_BASE_URL}/api/users${endpoint}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: data.name,
        email: data.email,
        senha: data.password,
        // A API Java provavelmente define a Role internamente baseada no endpoint,
        // mas enviamos aqui caso o DTO precise.
      }),
    });

    if (response.status === 409) {
      return { error: "Este e-mail já está em uso." };
    }

    if (!response.ok) {
      return { error: "Erro ao processar o cadastro." };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Falha na conexão com o servidor." };
  }
}
