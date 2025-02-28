"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { Category } from "@/lib/models/Category";
import { categoryService } from "@/lib/services/categoryService";
import { threadService } from "@/lib/services/threadService";
import { MessageCirclePlus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const ThreadForm = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loadingCategory, setLoadingCategory] = useState(true);

  // Charger les détails de la catégorie si un categoryId est fourni
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setLoadingCategory(false);
        return;
      }

      try {
        const categoryData = await categoryService.get(categoryId);
        setCategory(categoryData);
      } catch (error) {
        console.error("Erreur lors du chargement de la catégorie:", error);
        setError(t.threads.errors.categoryNotFound);
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t.threads.errors.nameRequired);
      return;
    }

    if (!categoryId) {
      setError(t.threads.errors.categoryRequired);
      return;
    }

    if (!user) {
      setError(t.threads.errors.loginRequired);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Créer la nouvelle discussion
      const newThread = await threadService.create({
        name: name.trim(),
        categoryId,
        authorId: user.uid,
      });

      // Rediriger vers la page de la catégorie avec la nouvelle discussion
      router.push(`/category/${categoryId}`);
    } catch (error) {
      console.error("Erreur lors de la création de la discussion:", error);
      setError(t.threads.errors.createError);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategory) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <MessageCirclePlus className="h-6 w-6 text-primary mr-2" />
            <CardTitle>{t.threads.createNew}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!category && categoryId) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>{t.errors.notFound.heading}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t.threads.errors.categoryNotFound}
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => router.push("/")}
          >
            {t.common.back}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <MessageCirclePlus className="h-6 w-6 text-primary mr-2" />
          <CardTitle>{t.threads.createNew}</CardTitle>
        </div>
        {category && (
          <p className="text-sm text-muted-foreground mt-1">
            {t.threads.creatingInCategory} {category.name}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="thread-name"
              className="block text-sm font-medium mb-1"
            >
              {t.threads.threadName}
            </label>
            <input
              id="thread-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background"
              placeholder={t.threads.threadNamePlaceholder}
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin mr-2" />
              ) : (
                <MessageCirclePlus className="h-4 w-4 mr-2" />
              )}
              {t.threads.create}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
