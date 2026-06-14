// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import { Role } from "./types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nome: string;
      role: Role;
      email: string;
      token: string;
    };
  }

  interface User {
    id: string;
    nome: string;
    role: Role;
    email: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nome: string;
    role: Role;
    email: string;
    token: string;
  }
}
