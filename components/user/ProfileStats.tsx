"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserStats } from "@/lib/hooks/useUserStats";
import { Message } from "@/lib/models/Message";
import { Thread } from "@/lib/models/Thread";
import {
  ExternalLink,
  FolderTree,
  Loader2,
  MessageCircle,
  MessagesSquare,
  Quote,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

// Composant pour un indicateur individuel amélioré
const StatItem = ({
  icon,
  title,
  value,
  isLoading,
}: {
  icon: ReactNode;
  title: string;
  value: string | number;
  isLoading: boolean;
}) => (
  <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/30 transition-colors">
    <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
      {icon}
    </div>
    <h4 className="text-sm font-medium text-muted-foreground mb-1">{title}</h4>
    {isLoading ? (
      <Loader2 className="h-6 w-6 animate-spin text-muted" />
    ) : (
      <p className="text-3xl font-bold">{value}</p>
    )}
  </div>
);

// Composant pour le dernier message
const LastMessageCard = ({
  message,
  thread,
  isLoading,
}: {
  message: Message | null;
  thread: Thread | null;
  isLoading: boolean;
}) => {
  // Formatage de la date du dernier message
  const formattedTime = message?.createdAt
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(message.createdAt.toDate())
    : "";

  return (
    <div className="p-4 rounded-lg bg-accent/10 mt-6">
      <div className="flex items-center mb-3">
        <Quote className="h-5 w-5 text-primary mr-2" />
        <h4 className="text-sm font-medium">Dernier message</h4>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      ) : message?.content ? (
        <>
          <p className="text-lg font-medium mb-2">"{message.content}"</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">{formattedTime}</p>
            {thread && (
              <Link
                href={`/category/${thread.categoryId}?threadId=${message.threadId}`}
                passHref
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary gap-1 p-0 h-auto"
                >
                  <span className="text-xs">Voir la discussion</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
        </>
      ) : (
        <p className="text-muted-foreground italic text-center">
          Aucun message envoyé
        </p>
      )}
    </div>
  );
};

export const ProfileStats = () => {
  const { stats } = useUserStats();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Activité de l'utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatItem
            icon={<FolderTree className="h-5 w-5" />}
            title="Catégories"
            value={stats.categories.count}
            isLoading={stats.categories.loading}
          />

          <StatItem
            icon={<MessageCircle className="h-5 w-5" />}
            title="Messages écrits"
            value={stats.messages.count}
            isLoading={stats.messages.loading}
          />

          <StatItem
            icon={<MessagesSquare className="h-5 w-5" />}
            title="Discussions actives"
            value={stats.threads.activeCount}
            isLoading={stats.threads.loading}
          />
        </div>

        <Separator className="my-4" />

        <LastMessageCard
          message={stats.messages.lastMessage}
          thread={stats.messages.lastMessageThread}
          isLoading={stats.messages.loading}
        />
      </CardContent>
    </Card>
  );
};
