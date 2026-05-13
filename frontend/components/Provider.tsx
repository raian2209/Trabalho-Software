"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

type ProviderProps = {
  children: React.ReactNode;
};

export function Provider({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
