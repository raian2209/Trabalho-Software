import { OrderStatus } from "@/types/types";
import { statusPedidoColor } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function StatusBadge({ status }: { status: OrderStatus | string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm",
        statusPedidoColor(status),
      )}
    >
      {status || "Pendente"}
    </span>
  );
}
