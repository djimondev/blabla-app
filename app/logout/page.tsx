"use client";

import { Icons } from "@/components/ui/icons";
import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect } from "react";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
      }
    };

    performLogout();
  }, [logout]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Icons.spinner className="h-8 w-8 animate-spin mb-4" />
      <p className="text-muted-foreground">Déconnexion en cours...</p>
    </div>
  );
}
