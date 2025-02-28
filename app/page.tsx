"use client";

import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { ProfileHeader } from "@/components/user/ProfileHeader";
import { ProfileStats } from "@/components/user/ProfileStats";

export default function HomePage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl mx-auto">
        <ProfileHeader />
        <ProfileStats />
      </div>
    </AuthenticatedLayout>
  );
}
