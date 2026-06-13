"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  UserCircle2,
  Package,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Store,
  Menu,
  X,
  Ticket,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/cn";
import { ROLE_LABELS } from "@/lib/constants";
import { getDisplayName } from "@/lib/session";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const userRole = session?.user?.role;
  const userName = getDisplayName(session);

  const handleLogout = () => signOut({ callbackUrl: "/login" });

  // Estado ativo por prefixo de rota (corrige a comparação que nunca acendia).
  const isActive = (path: string) => pathname.startsWith(path);

  const navItems = (() => {
    if (!isAuthenticated) return [];
    if (userRole === "ROLE_ADMIN")
      return [
        { href: "/admin/cupons", label: "Gerenciar Cupons", icon: Ticket },
        { href: "/admin/usuarios", label: "Usuários", icon: UserCircle2 },
      ];
    if (userRole === "ROLE_FORNECEDOR")
      return [
        { href: "/fornecedor", label: "Painel", icon: LayoutDashboard },
        { href: "/fornecedor/produtos", label: "Meus Produtos", icon: Store },
        {
          href: "/fornecedor/produtos/novo",
          label: "Novo Produto",
          icon: PlusCircle,
        },
      ];
    if (userRole === "ROLE_USUARIO")
      return [
        { href: "/usuario/produtos", label: "Loja", icon: Store },
        { href: "/usuario/pedidos", label: "Meus Pedidos", icon: Package },
        { href: "/usuario/carrinho", label: "Carrinho", icon: ShoppingCart },
      ];
    return [];
  })();

  const renderNavLinks = (mobile = false) =>
    navItems.map(({ href, label, icon: Icon }) => (
      <Link
        key={href}
        href={href}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
        className={cn(
          mobile
            ? "flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors dark:text-gray-200 text-gray-800"
            : "flex items-center space-x-1.5 hover:text-brand-purple transition-colors text-sm font-medium dark:text-gray-300 text-gray-700 dark:hover:text-white hover:text-black",
          isActive(href) &&
            (mobile
              ? "bg-brand-purple/20 text-brand-purple font-semibold"
              : "dark:text-white text-black font-semibold"),
        )}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    ));

  return (
    <header className="bg-header-bg border-b border-white/5 shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-10 w-14 shadow-lg shadow-amber-400/10 group-hover:scale-105 transition-transform duration-300 rounded-lg overflow-hidden border-2 border-amber-400/50">
              <Image
                src="/AngolaFlag.webp"
                alt="Bandeira de Angola"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight tracking-tight">
                WartMart
              </span>
              <span className="text-[10px] dark:text-gray-400 text-gray-800 font-medium tracking-widest uppercase">
                Angola
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {!isLoading && renderNavLinks(false)}
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />

            {isLoading ? (
              <div className="h-8 w-8 bg-white/10 animate-pulse rounded-full"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <div className="flex flex-col items-end mr-1">
                  <span className="text-xs text-brand-purple font-bold uppercase tracking-wider">
                    {userRole ? ROLE_LABELS[userRole] : ""}
                  </span>
                  <span className="text-sm font-medium">Olá, {userName}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-sm font-bold text-black dark:text-white bg-brand-purple rounded-lg hover:bg-purple-300 dark:hover:bg-purple-700 transition-all shadow-lg shadow-purple-100/20 dark:shadow-purple-900/20"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-header-bg border-t border-white/10 px-4 pt-2 pb-6 shadow-2xl absolute w-full left-0">
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-4 mb-4 bg-white/5 rounded-lg border border-white/5">
              <div className="bg-brand-purple/20 p-2 rounded-full">
                <UserCircle2 className="w-6 h-6 text-brand-purple" />
              </div>
              <div>
                <p className="text-white font-semibold">{userName}</p>
                <p className="text-xs text-gray-400">{session?.user?.email}</p>
              </div>
            </div>
          )}
          <nav className="flex flex-col space-y-2">{renderNavLinks(true)}</nav>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between px-4 mb-4">
              <span className="text-gray-400 text-sm font-medium">
                Tema do App
              </span>
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" /> <span>Sair da Conta</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3 text-gray-200 bg-white/5 hover:bg-white/10 rounded-lg font-medium"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3 text-white bg-brand-purple hover:bg-purple-700 rounded-lg font-medium"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
