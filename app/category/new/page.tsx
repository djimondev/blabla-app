"use client";

import { CategoryForm } from "@/components/category/CategoryForm";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";

export default function NewCategoryPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-3xl mx-auto">
        <CategoryForm />
      </div>
    </AuthenticatedLayout>
  );
}
