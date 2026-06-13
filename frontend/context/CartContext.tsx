"use client";

import { Product } from "@/types/types";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: React.ReactNode;
};

type CartItens = {
  id: string;
  nome: string;
  preco: number;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItens[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItens[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("womart_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("womart_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          nome: product.nome,
          preco: product.preco,
          quantity: 1,
          status: "PENDENTE",
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId),
    );
  };

  // --- NOVA FUNÇÃO: Atualizar quantidade direta ---
  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Não permite zero ou negativo

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.preco * item.quantity,
    0,
  );

  return (
    // Não esqueça de passar o updateItemQuantity aqui no value
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
