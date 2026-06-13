"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Trash2,
  Plus,
  Minus,
  Tag,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useVerificarCupom } from "@/hooks/mutations/useCupomMutations";
import { useCreatePedido } from "@/hooks/mutations/usePedidoMutations";
import { formatCurrency } from "@/lib/format";
import { Coupon } from "@/types/types";

export default function CarrinhoPage() {
  const { cartItems, removeFromCart, updateItemQuantity, clearCart, cartTotal } =
    useCart()!;
  const router = useRouter();
  const verificarCupom = useVerificarCupom();
  const criarPedido = useCreatePedido();

  const [codigoCupom, setCodigoCupom] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState<Coupon | null>(null);
  const [erroCupom, setErroCupom] = useState("");

  const aplicarCupom = async () => {
    if (!codigoCupom.trim()) return;
    setErroCupom("");
    setCupomAplicado(null);
    try {
      const data = await verificarCupom.mutateAsync(codigoCupom);
      if (data.valorDesconto < 0) {
        setErroCupom("Cupom inválido (valor negativo).");
      } else {
        setCupomAplicado(data);
      }
    } catch {
      setErroCupom("Cupom inválido ou não encontrado.");
    }
  };

  const removerCupom = () => {
    setCupomAplicado(null);
    setCodigoCupom("");
    setErroCupom("");
  };

  const calcularDesconto = () => {
    if (!cupomAplicado) return 0;
    const total = Number(cartTotal);
    const valor = Number(cupomAplicado.valorDesconto);
    const desconto =
      cupomAplicado.tipoDesconto === "PERCENTAGEM"
        ? (total * valor) / 100
        : valor;
    return Math.min(desconto, total);
  };

  const valorDesconto = calcularDesconto();
  const totalFinal = Math.max(0, cartTotal - valorDesconto);

  const finalizarCompra = async () => {
    if (cartItems.length === 0) return;
    try {
      await criarPedido.mutateAsync({
        itens: cartItems.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantity,
        })),
        codigoCupom: cupomAplicado ? cupomAplicado.codigo : null,
        totalPago: totalFinal,
      });
      toast.success("Pedido realizado com sucesso!");
      clearCart();
      router.push("/usuario/pedidos");
    } catch {
      toast.error("Erro ao finalizar pedido.");
    }
  };

  if (cartItems.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 dark:text-gray-400">
        <p className="text-xl font-medium">Seu carrinho está vazio.</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4 h-full bg-page-bg dark:bg-slate-900 transition-colors duration-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Seu Carrinho
      </h1>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-100 dark:border-slate-700 transition-colors duration-200">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 dark:border-slate-700 py-4 gap-4"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                {item.nome}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Unitário: {formatCurrency(item.preco)}
              </p>
            </div>

            <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-md">
              <button
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1) updateItemQuantity(item.id, val);
                }}
                className="w-12 text-center border-x border-gray-300 dark:border-slate-600 py-1 focus:outline-none text-gray-700 dark:text-gray-200 font-medium bg-transparent"
              />
              <button
                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex items-center gap-6 min-w-37.5 justify-end">
              <span className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(item.preco * item.quantity)}
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                title="Remover item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        <div className="mt-8 flex flex-col md:flex-row gap-8 justify-between items-start">
          <div className="w-full md:w-1/3 space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cupom de Desconto
            </label>
            <div className="flex gap-2">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="text-gray-400 dark:text-gray-500" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Código do cupom"
                  value={codigoCupom}
                  onChange={(e) => setCodigoCupom(e.target.value)}
                  disabled={!!cupomAplicado}
                  className={`pl-10 w-full border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 transition text-gray-700 dark:text-gray-100 dark:bg-slate-900 dark:placeholder-gray-500 ${
                    erroCupom
                      ? "border-red-300 focus:ring-red-200 dark:border-red-500/50"
                      : "border-gray-300 focus:ring-green-500 dark:border-slate-600"
                  } ${cupomAplicado ? "bg-gray-100 dark:bg-slate-700 opacity-70" : ""}`}
                />
              </div>

              {!cupomAplicado ? (
                <button
                  onClick={aplicarCupom}
                  disabled={verificarCupom.isPending || !codigoCupom}
                  className="bg-gray-800 dark:bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-slate-600 disabled:opacity-50 transition flex items-center gap-2"
                >
                  {verificarCupom.isPending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Aplicar"
                  )}
                </button>
              ) : (
                <button
                  onClick={removerCupom}
                  className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition font-medium"
                >
                  Remover
                </button>
              )}
            </div>

            {erroCupom && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1 mt-1">
                <XCircle size={14} /> {erroCupom}
              </p>
            )}
            {cupomAplicado && (
              <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1 mt-1">
                <CheckCircle size={14} /> Cupom &#34;{cupomAplicado.codigo}&#34;
                aplicado!
              </p>
            )}
          </div>

          <div className="w-full md:w-1/3 bg-gray-50 dark:bg-slate-700/30 p-6 rounded-lg border border-gray-100 dark:border-slate-700">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>

              {cupomAplicado && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                  <span>
                    Desconto (
                    {cupomAplicado.tipoDesconto === "PERCENTAGEM"
                      ? `${cupomAplicado.valorDesconto}%`
                      : "Valor Fixo"}
                    )
                  </span>
                  <span>- {formatCurrency(valorDesconto)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-slate-600 pt-3 mt-3">
                <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white">
                  <span>Total</span>
                  <span>{formatCurrency(totalFinal)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={finalizarCompra}
              disabled={cartItems.length === 0 || criarPedido.isPending}
              className="w-full mt-6 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-lg shadow-green-200 dark:shadow-green-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {criarPedido.isPending && (
                <Loader2 className="animate-spin" size={18} />
              )}
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
