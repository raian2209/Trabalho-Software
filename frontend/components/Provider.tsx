"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";

type ProviderProps = {
  children: React.ReactNode;
};

export function Provider({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
