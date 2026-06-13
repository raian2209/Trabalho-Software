import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  /** Cor da barra de destaque à direita (classe Tailwind, ex.: "bg-brand-purple"). */
  accent?: string;
  /** Classe do círculo do ícone. */
  iconWrapper?: string;
  iconClassName?: string;
  href?: string;
};

/** Card de estatística usado nos dashboards. Vira link se `href` for passado. */
export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "bg-brand-purple",
  iconWrapper = "bg-purple-50 dark:bg-purple-900/20",
  iconClassName = "text-brand-purple dark:text-purple-400",
  href,
}: StatCardProps) {
  const content = (
    <>
      <div
        className={cn(
          "absolute top-0 right-0 w-2 h-full transition-all",
          accent,
        )}
      />
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
          {label}
        </p>
        <div className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
          {value}
        </div>
      </div>
      <div className={cn("p-3 rounded-full transition-colors", iconWrapper)}>
        <Icon className={cn("w-8 h-8", iconClassName)} />
      </div>
    </>
  );

  const className =
    "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700 flex items-center justify-between relative overflow-hidden group";

  if (href) {
    return (
      <Link href={href} className={cn(className, "cursor-pointer")}>
        {content}
      </Link>
    );
  }
  return <div className={className}>{content}</div>;
}
