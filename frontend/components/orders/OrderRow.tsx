"use client";

import { Calendar, DollarSign, Package, User, XCircle, Ban } from "lucide-react";
import { OrderStatus } from "@/types/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { isPedidoCancelavel } from "@/lib/constants";
import { StatusBadge } from "@/components/ui/StatusBadge";

export type NormalizedOrder = {
  id: string;
  mainInfo: string;
  subInfo: string;
  data?: string;
  status: OrderStatus;
  total: number;
};

type OrderRowProps = {
  item: NormalizedOrder;
  isFornecedor: boolean;
  onCancel?: (id: string) => void;
};

export function OrderRow({ item, isFornecedor, onCancel }: OrderRowProps) {
  const cancelavel = isPedidoCancelavel(item.status);

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
      {/* ID */}
      <div className="w-full md:w-auto md:col-span-1 flex justify-between md:block">
        <span className="md:hidden text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">
          Pedido
        </span>
        <span className="font-mono font-bold text-gray-900 dark:text-slate-100">
          #{item.id}
        </span>
      </div>

      {/* Info Principal */}
      <div className="w-full md:w-auto md:col-span-3 flex items-center gap-3">
        <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-full hidden sm:block">
          {isFornecedor ? (
            <Package className="w-4 h-4 text-brand-purple dark:text-purple-400" />
          ) : (
            <User className="w-4 h-4 text-brand-purple dark:text-purple-400" />
          )}
        </div>
        <div className="overflow-hidden">
          <p
            className="font-medium text-gray-900 dark:text-slate-100 truncate"
            title={item.mainInfo}
          >
            {item.mainInfo}
          </p>
          <p
            className="text-xs text-gray-500 dark:text-slate-400 truncate"
            title={item.subInfo}
          >
            {item.subInfo}
          </p>
        </div>
      </div>

      {/* Data */}
      <div className="w-full md:w-auto md:col-span-2 flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
        <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500 md:hidden" />
        {formatDate(item.data)}
      </div>

      {/* Status */}
      <div className="w-full md:w-auto md:col-span-2 flex justify-between md:block">
        <span className="md:hidden text-sm text-gray-500 dark:text-slate-400">
          Status:
        </span>
        <StatusBadge status={item.status} />
      </div>

      {/* Total */}
      <div className="w-full md:w-auto md:col-span-2 flex justify-between md:block md:text-right">
        <span className="md:hidden text-sm text-gray-500 dark:text-slate-400">
          Valor:
        </span>
        <div className="font-bold text-gray-900 dark:text-white flex items-center justify-end gap-1">
          <span className="md:hidden">
            <DollarSign className="w-4 h-4 text-slate-400" />
          </span>
          {formatCurrency(item.total)}
        </div>
      </div>

      {/* Ações */}
      <div className="w-full md:w-auto md:col-span-2 flex justify-center mt-2 md:mt-0">
        {onCancel && cancelavel ? (
          <button
            onClick={() => onCancel(item.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-all w-full md:w-auto justify-center dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/50"
          >
            <XCircle className="w-4 h-4" />
            Cancelar
          </button>
        ) : (
          <span className="text-xs text-gray-400 dark:text-slate-500 italic flex items-center gap-1">
            {item.status === "CANCELADO" && (
              <>
                <Ban className="w-3 h-3 text-red-400/50" />
                Cancelado
              </>
            )}
            {item.status !== "CANCELADO" && "-"}
          </span>
        )}
      </div>
    </div>
  );
}
