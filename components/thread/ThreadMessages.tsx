"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks/useAuth";
import { Message } from "@/lib/models/Message";
import { Thread } from "@/lib/models/Thread";
import { UserProfile } from "@/lib/models/UserProfile";
import { messageService } from "@/lib/services/messageService";
import { threadService } from "@/lib/services/threadService";
import { userProfileService } from "@/lib/services/userProfileService";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const ThreadMessages = ({ threadId }: { threadId: string }) => {
  const { user } = useAuth();
  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<Record<string, UserProfile>>({});
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!loading && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, loading]);

  // Charger le thread et ses messages
  useEffect(() => {
    const fetchThreadAndMessages = async () => {
      setLoading(true);
      try {
        // Récupérer les détails du thread
        const threadData = await threadService.get(threadId);
        setThread(threadData);

        // Récupérer les messages du thread
        const messagesData = await messageService.getByThread(threadId);
        // Sort messages by createdAt (oldest first)
        const sortedMessages = messagesData.sort(
          (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()
        );
        setMessages(sortedMessages);

        // Récupérer les informations sur les auteurs
        const authorIds = [...new Set(messagesData.map((msg) => msg.authorId))];
        const authorProfiles: Record<string, UserProfile> = {};

        for (const authorId of authorIds) {
          const profile = await userProfileService.get(authorId);
          if (profile) {
            authorProfiles[authorId] = profile;
          }
        }

        setAuthors(authorProfiles);
      } catch (error) {
        console.error("Erreur lors du chargement du thread:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreadAndMessages();
  }, [threadId]);

  // Envoyer un nouveau message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    try {
      await messageService.create({
        content: newMessage.trim(),
        threadId,
        authorId: user.uid,
      });
      setNewMessage("");

      // Actualiser les messages après l'envoi
      const messagesData = await messageService.getByThread(threadId);
      // Sort messages by createdAt (oldest first)
      const sortedMessages = messagesData.sort(
        (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    } finally {
      setSending(false);
    }
  };

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

  // Obtenir les initiales d'un utilisateur
  const getUserInitials = (authorId: string) => {
    const profile = authors[authorId];
    if (!profile || !profile.username) return "?";

    return profile.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Si la page est en cours de chargement
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si le thread n'existe pas
  if (!thread) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discussion introuvable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette discussion n'existe pas ou a été supprimée.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{thread.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Liste des messages */}
        <div className="space-y-4 mb-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Cette discussion ne contient pas encore de messages.
            </p>
          ) : (
            <>
              {messages.map((message) => {
                const isCurrentUser = message.authorId === user?.uid;
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isCurrentUser && (
                      <Avatar>
                        <AvatarImage
                          src={authors[message.authorId]?.avatarUrl || ""}
                          alt={
                            authors[message.authorId]?.username || "Utilisateur"
                          }
                        />
                        <AvatarFallback>
                          {getUserInitials(message.authorId)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[75%] ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent border border-border shadow-sm"
                      } rounded-lg p-3`}
                    >
                      <div
                        className={`flex justify-between items-start gap-4 ${
                          isCurrentUser ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <span className="text-xs opacity-80">
                          {formatDate(message.createdAt)}
                        </span>
                        {!isCurrentUser && (
                          <h3 className="font-medium">
                            {authors[message.authorId]?.username ||
                              "Utilisateur inconnu"}
                          </h3>
                        )}
                      </div>
                      <p className="mt-1">{message.content}</p>
                    </div>
                    {isCurrentUser && (
                      <Avatar>
                        <AvatarImage
                          src={authors[message.authorId]?.avatarUrl || ""}
                          alt={
                            authors[message.authorId]?.username || "Utilisateur"
                          }
                        />
                        <AvatarFallback>
                          {getUserInitials(message.authorId)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Formulaire d'envoi de message */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 p-2 border border-border rounded-md bg-background"
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
