"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { categoryService } from "@/lib/services/categoryService";
import { FolderPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CategoryForm = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Le nom de la catégorie est requis");
      return;
    }

    if (!user) {
      setError("Vous devez être connecté pour créer une catégorie");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Créer la nouvelle catégorie
      const newCategory = await categoryService.create({
        name: name.trim(),
      });

      // Rediriger vers la page de la nouvelle catégorie
      router.push(`/category/${newCategory.id}`);
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie:", error);
      setError("Une erreur est survenue lors de la création de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <FolderPlus className="h-6 w-6 text-primary mr-2" />
          <CardTitle>Créer une nouvelle catégorie</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="category-name"
              className="block text-sm font-medium mb-1"
            >
              Nom de la catégorie
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background"
              placeholder="Ex: Sports, Technologie, Cuisine..."
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
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin mr-2" />
              ) : (
                <FolderPlus className="h-4 w-4 mr-2" />
              )}
              Créer la catégorie
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
