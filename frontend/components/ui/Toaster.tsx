"use client";

import { Toaster as HotToaster } from "react-hot-toast";

/** Toaster com configuração única (posição + estilo dark mode). */
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        className: "dark:bg-slate-800 dark:text-white",
        style: { background: "#333", color: "#fff" },
      }}
    />
  );
}
