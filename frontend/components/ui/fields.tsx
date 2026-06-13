"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

const base =
  "w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple transition-colors bg-white dark:bg-slate-900 text-gray-900 dark:text-white dark:placeholder-gray-500";
const borderNormal = "border-gray-200 dark:border-slate-600";
const borderError =
  "border-red-500 ring-1 ring-red-500 bg-red-50 dark:bg-red-900/10";

type FieldState = { error?: boolean };

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & FieldState
>(function Input({ error, className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(base, error ? borderError : borderNormal, className)}
      {...props}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & FieldState
>(function Select({ error, className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(base, error ? borderError : borderNormal, className)}
      {...props}
    >
      {children}
    </select>
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldState
>(function Textarea({ error, className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(base, error ? borderError : borderNormal, className)}
      {...props}
    />
  );
});

/** Wrapper de campo: rótulo + controle + mensagem de erro/dica. */
export function FormField({
  label,
  required,
  error,
  hint,
  children,
}: {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}
