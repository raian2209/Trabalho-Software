const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** Erro de requisição com status HTTP e corpo da resposta preservados. */
export class ApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, message: string, body = "") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
};

/**
 * Wrapper único de fetch para a API: prefixa a base URL, injeta o header de
 * autenticação, serializa o corpo em JSON e normaliza o tratamento de erro.
 * Lança `ApiError` quando a resposta não é ok.
 */
export async function apiFetch<T>(
  path: string,
  { method = "GET", body, token, headers = {} }: ApiFetchOptions = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text || `Erro ${res.status}`, text);
  }

  // Endpoints como DELETE/cancelar podem responder sem corpo (204) ou com corpo
  // vazio mesmo declarando JSON. Lemos como texto e só parseamos se houver conteúdo,
  // evitando erro de "Unexpected end of JSON input".
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return JSON.parse(text) as T;
  }
  return undefined as T;
}
