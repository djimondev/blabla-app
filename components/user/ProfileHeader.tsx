"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserProfile } from "@/lib/models/UserProfile";
import { userProfileService } from "@/lib/services/userProfileService";
import { useEffect, useState } from "react";

export const ProfileHeader = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        const profile = await userProfileService.get(user.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading || !user) {
    return (
      <Card className="w-full mb-6">
        <CardContent className="p-6 flex items-center">
          <Icons.spinner className="h-6 w-6 animate-spin" />
          <span className="ml-2">Chargement du profil...</span>
        </CardContent>
      </Card>
    );
  }

  const userInitials = userProfile?.username
    ? userProfile.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <Card className="w-full mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage
                src={userProfile?.avatarUrl || ""}
                alt={userProfile?.username || user.email?.split("@")[0] || ""}
              />
              <AvatarFallback className="text-xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">
                {userProfile?.username || user.email?.split("@")[0] || ""}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <Icons.mail className="h-4 w-4 mr-1" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>

            {userProfile?.bio ? (
              <div className="pt-2">
                <div className="flex items-start">
                  <Icons.bio className="h-4 w-4 mr-1 mt-1 text-muted-foreground" />
                  <p className="text-sm">{userProfile.bio}</p>
                </div>
              </div>
            ) : (
              <div className="pt-2 text-muted-foreground text-sm italic">
                Aucune bio renseignée
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
