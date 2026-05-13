"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const role = session?.user.role;

    switch (role) {
      case "ROLE_ADMIN":
        router.push("/admin");
        return;
      case "ROLE_FORNECEDOR":
        router.push("/fornecedor");
        return;
      case "ROLE_USUARIO":
        router.push("/usuario");
        return;
      default:
        router.push("/login");
        return;
    }
  }, [status, router, session]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500 text-lg">Redirecionando...</p>
    </div>
  );
}
