import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { Role } from "@/types/types";

const API_BASE_URL = process.env.API_BASE_URL;

interface TokenPayload {
  email: string;
  role: Role;
  sub: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              senha: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data = await res.json();

          if (!data.token) return null;

          // Decode JWT
          const decoded = jwtDecode<TokenPayload>(data.token);

          console.log("Decoded JWT:", decoded);

          return {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            token: data.token,
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * Salva os dados do usuário dentro do token JWT do NextAuth
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token; // nome correto
      }
      return token;
    },

    /**
     * Envia o token do NextAuth para o client
     */
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;

      // CORREÇÃO PRINCIPAL: salvar token dentro de session.user
      session.user.token = token.token;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
