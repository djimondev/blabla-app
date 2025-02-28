"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { Category } from "@/lib/models/Category";
import { categoryService } from "@/lib/services/categoryService";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  FolderIcon,
  LogOut,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
  readonly className?: string;
}

export const Sidebar = ({ className }: SidebarProps = {}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Items fixes du menu avec traductions
  const navItems = [
    {
      href: "/",
      label: t.common.home,
      icon: <Icons.home className="h-5 w-5" />,
    },
  ];

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Détection de la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth < 1024;
      const mobileScreen = window.innerWidth < 768;

      setIsMobile(mobileScreen);
      setCollapsed(smallScreen && !mobileScreen);
      setIsHidden(mobileScreen);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Écouter l'événement venant de la TopBar
  useEffect(() => {
    const handleToggle = () => {
      if (isMobile) {
        setIsHidden(!isHidden);
      } else {
        setCollapsed(!collapsed);
      }
    };

    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, [collapsed, isMobile, isHidden]);

  // Fermer la sidebar sur mobile lors d'un changement de route
  useEffect(() => {
    if (isMobile) {
      setIsHidden(true);
    }
  }, [pathname, isMobile]);

  // Si complètement caché sur mobile
  if (isMobile && isHidden) {
    return null;
  }

  return (
    <>
      {/* Overlay pour mobile (fond semi-transparent pour fermer la sidebar) */}
      {isMobile && !isHidden && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsHidden(true)}
        />
      )}

      <div
        className={cn(
          "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
          isMobile ? "fixed left-0 top-0 z-40" : "",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        <div
          className={cn(
            "flex items-center p-4",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed && (
            <div>
              <h2 className="text-2xl font-bold text-primary">
                {t.common.appName}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {t.common.appDescription}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              isMobile ? setIsHidden(true) : setCollapsed(!collapsed)
            }
            className="text-muted-foreground"
            title={
              isMobile
                ? t.sidebar.closeMenu
                : collapsed
                ? t.sidebar.expandMenu
                : t.sidebar.collapseMenu
            }
          >
            {isMobile ? (
              <X className="h-5 w-5" />
            ) : collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav
          className={cn(
            "flex-1 overflow-y-auto",
            collapsed ? "px-2 py-4" : "px-4 py-4 space-y-1"
          )}
        >
          {/* Items fixes du menu */}
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "transition-all mb-1 text-sm font-medium",
                  collapsed
                    ? "w-full justify-center p-2 h-10"
                    : "w-full justify-start gap-3 px-3 py-2",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                title={item.label}
              >
                {item.icon}
                {!collapsed && item.label}
              </Button>
            </Link>
          ))}

          {/* Séparateur */}
          <div className="my-4 border-t border-border" />

          {/* Titre des catégories */}
          {!collapsed && (
            <div className="text-xs uppercase font-semibold text-muted-foreground py-2 px-2">
              {t.categories.title}
            </div>
          )}

          {/* Liste des catégories */}
          {loading ? (
            // Affichage pendant le chargement
            <>
              {[1, 2, 3].map((n) => (
                <div key={n} className="mb-1">
                  <Skeleton
                    className={cn("h-10 w-full", collapsed ? "w-10" : "w-full")}
                  />
                </div>
              ))}
            </>
          ) : (
            // Liste des catégories une fois chargées
            categories.map((category) => (
              <Link href={`/category/${category.id}`} key={category.id}>
                <Button
                  variant={
                    pathname === `/category/${category.id}`
                      ? "default"
                      : "ghost"
                  }
                  className={cn(
                    "transition-all mb-1 text-sm font-medium",
                    collapsed
                      ? "w-full justify-center p-2 h-10"
                      : "w-full justify-start gap-3 px-3 py-2",
                    pathname === `/category/${category.id}`
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  title={category.name}
                >
                  <FolderIcon className="h-5 w-5" />
                  {!collapsed && category.name}
                </Button>
              </Link>
            ))
          )}

          {/* Bouton pour créer une nouvelle catégorie */}
          <Link href="/category/new" className="block mt-3">
            <Button
              variant={pathname === "/category/new" ? "default" : "outline"}
              className={cn(
                "transition-all text-sm font-medium w-full",
                collapsed
                  ? "justify-center p-2 h-10"
                  : "justify-start gap-2 px-3 py-2",
                pathname === "/category/new"
                  ? "bg-primary text-primary-foreground"
                  : "border-dashed border-primary text-primary hover:bg-primary/10"
              )}
              title={t.categories.create}
            >
              <Plus className="h-5 w-5" />
              {!collapsed && t.categories.create}
            </Button>
          </Link>
        </nav>

        {/* Bouton de déconnexion au bas de la sidebar */}
        <div className="mt-auto pt-4 border-t border-border p-4">
          <Link href="/logout">
            <Button
              variant="ghost"
              className={cn(
                "transition-all text-sm font-medium w-full",
                collapsed
                  ? "justify-center p-2 h-10"
                  : "justify-start gap-3 px-3 py-2",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              title={t.common.logout}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && t.common.logout}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
