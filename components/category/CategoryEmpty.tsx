import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderX } from "lucide-react";
import Link from "next/link";

export const CategoryEmpty = () => {
  return (
    <Card className="mx-auto max-w-lg mt-8">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <FolderX className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle>Catégorie introuvable</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground mb-4">
          Cette catégorie n'existe pas ou a été supprimée.
        </p>
        <Link href="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
