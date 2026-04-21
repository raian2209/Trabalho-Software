"use client";

import { ThemeProvider } from "next-themes";

type ProviderProps = {
  children: React.ReactNode;
};

export function Provider({ children }: ProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
