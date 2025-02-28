"use client";

import { CategoryEmpty } from "@/components/category/CategoryEmpty";
import { ThreadMessages } from "@/components/thread/ThreadMessages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { Category } from "@/lib/models/Category";
import { Thread } from "@/lib/models/Thread";
import { categoryService } from "@/lib/services/categoryService";
import { threadService } from "@/lib/services/threadService";
import { cn } from "@/lib/utils";
import { MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const CategoryThreads = ({ categoryId }: { categoryId: string }) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const threadIdParam = searchParams.get("threadId");
  const [category, setCategory] = useState<Category | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger la catégorie et ses threads
  useEffect(() => {
    const fetchCategoryAndThreads = async () => {
      setLoading(true);
      try {
        // Récupérer les détails de la catégorie
        const categoryData = await categoryService.get(categoryId);
        setCategory(categoryData);

        // Récupérer les threads de la catégorie
        const threadsData = await threadService.getByCategory(categoryId);
        setThreads(threadsData);

        // Vérifier si un ID de thread est fourni dans l'URL
        if (threadIdParam) {
          // Vérifier que le thread appartient bien à cette catégorie
          const threadExists = threadsData.some(
            (thread) => thread.id === threadIdParam
          );
          if (threadExists) {
            setSelectedThread(threadIdParam);
          } else {
            // Sélectionner le premier thread par défaut s'il y en a
            if (threadsData.length > 0) {
              setSelectedThread(threadsData[0].id);
            } else {
              setSelectedThread(null);
            }
          }
        } else {
          // Comportement par défaut (premier thread)
          if (threadsData.length > 0 && !selectedThread) {
            setSelectedThread(threadsData[0].id);
          } else {
            setSelectedThread(null);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la catégorie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndThreads();
  }, [categoryId, threadIdParam]);

  // Formater la date et l'heure
  const formatDate = (timestamp: { toDate: () => Date } | Date) => {
    const date = "toDate" in timestamp ? timestamp.toDate() : timestamp;
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Si la page est en cours de chargement
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Si la catégorie n'existe pas
  if (!category) {
    return <CategoryEmpty />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Section principale - Thread sélectionné */}
      <div className="md:col-span-3">
        {selectedThread ? (
          <ThreadMessages threadId={selectedThread} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t.threads.select}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar droite - Liste des threads */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              {t.threads.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-0">
            {threads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t.threads.empty}
              </p>
            ) : (
              <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto px-2 pb-2">
                {threads.map((thread) => (
                  <Button
                    key={thread.id}
                    variant={selectedThread === thread.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start flex-col items-start h-auto py-3",
                      selectedThread === thread.id
                        ? "bg-primary text-primary-foreground"
                        : ""
                    )}
                    onClick={() => setSelectedThread(thread.id)}
                  >
                    <div className="font-medium text-left">{thread.name}</div>
                    <div className="text-xs w-full flex justify-between items-center mt-1">
                      <span>{t.threads.lastActivity}</span>
                      <span
                        className={
                          selectedThread === thread.id
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }
                      >
                        {formatDate(thread.lastMessageAt)}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Bouton pour créer une nouvelle discussion */}
            <div className="p-2 mt-2 border-t border-border">
              <Link href={`/thread/new?categoryId=${categoryId}`}>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-dashed border-primary text-primary hover:bg-primary/10"
                >
                  <Plus className="h-4 w-4" />
                  {t.threads.create}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
