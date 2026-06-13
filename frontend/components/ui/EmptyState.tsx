import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="p-10 text-center text-gray-500 dark:text-gray-400">
      {Icon && (
        <Icon className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-600 mb-3" />
      )}
      <p className="text-lg font-medium">{title}</p>
      {description && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
