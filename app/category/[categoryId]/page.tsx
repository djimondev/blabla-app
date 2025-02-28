"use client";

import { CategoryThreads } from "@/components/category/CategoryThreads";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const { categoryId } = useParams();

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <CategoryThreads categoryId={categoryId as string} />
      </div>
    </AuthenticatedLayout>
  );
}
