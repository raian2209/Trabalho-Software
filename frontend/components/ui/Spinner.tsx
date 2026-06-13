import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn(
        "animate-spin text-brand-purple dark:text-purple-400",
        className,
      )}
    />
  );
}

/** Tela cheia de carregamento, usada enquanto sessão/dados carregam. */
export function PageLoader() {
  return (
    <div className="h-full min-h-[50vh] flex items-center justify-center bg-page-bg dark:bg-slate-900 transition-colors duration-200">
      <Spinner className="w-10 h-10" />
    </div>
  );
}
