"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Provê um diálogo de confirmação acessível via `useConfirm()`, substituindo o
 * `window.confirm` nativo por um modal estilizado.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
          onClick={() => close(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-5">
              {options.danger && (
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              )}
              <div>
                {options.title && (
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    {options.title}
                  </h3>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {options.message}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => close(false)}>
                {options.cancelText ?? "Cancelar"}
              </Button>
              <Button
                variant={options.danger ? "danger" : "primary"}
                onClick={() => close(true)}
              >
                {options.confirmText ?? "Confirmar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm precisa estar dentro de <ConfirmProvider>.");
  }
  return ctx;
}
