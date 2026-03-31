"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut();
      router.push("/");
      router.refresh();
    };

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--beige)] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--bordeaux)] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[var(--gris-tech)]">Deconnexion en cours...</p>
      </div>
    </div>
  );
}
