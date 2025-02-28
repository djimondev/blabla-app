"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";

interface TopBarProps {
  readonly className?: string;
}

export const TopBar = ({ className }: TopBarProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fonction pour basculer l'état de la sidebar
  const toggleSidebar = () => {
    // Ici, nous créons un événement personnalisé pour communiquer avec le composant Sidebar
    const event = new CustomEvent("toggle-sidebar");
    window.dispatchEvent(event);
    setSidebarOpen(!sidebarOpen);
  };

  // Obtenez les initiales de l'utilisateur à partir de son email
  const getUserInitials = (email: string | null | undefined) => {
    if (!email) return "??";
    const parts = email.split("@");
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={cn(
        "h-14 px-4 flex items-center justify-between bg-background",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <span className="text-xl font-bold text-primary">
          {t.common.appName}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3">
            <span className="text-sm hidden md:inline-block text-muted-foreground">
              {user.email}
            </span>
            <Avatar className="h-8 w-8 bg-primary/10">
              <AvatarFallback className="text-primary">
                {getUserInitials(user.email)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};
