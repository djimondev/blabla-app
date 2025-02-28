"use client";

import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { ThreadForm } from "@/components/thread/ThreadForm";

export default function NewThreadPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-3xl mx-auto">
        <ThreadForm />
      </div>
    </AuthenticatedLayout>
  );
}
