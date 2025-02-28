"use client";

import { useEffect, useState } from "react";
import { Message } from "../models/Message";
import { Thread } from "../models/Thread";
import { categoryService } from "../services/categoryService";
import { messageService } from "../services/messageService";
import { threadService } from "../services/threadService";
import { useAuth } from "./useAuth";

interface UserStats {
  categories: {
    count: number;
    loading: boolean;
  };
  messages: {
    count: number;
    lastMessage: Message | null;
    lastMessageThread: Thread | null;
    loading: boolean;
  };
  threads: {
    activeCount: number;
    loading: boolean;
  };
}

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    categories: {
      count: 0,
      loading: true,
    },
    messages: {
      count: 0,
      lastMessage: null,
      lastMessageThread: null,
      loading: true,
    },
    threads: {
      activeCount: 0,
      loading: true,
    },
  });

  // Récupérer le nombre de catégories
  useEffect(() => {
    if (!user) return;

    const fetchCategories = async () => {
      try {
        const categories = await categoryService.getAll();
        setStats((prev) => ({
          ...prev,
          categories: {
            count: categories.length,
            loading: false,
          },
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        setStats((prev) => ({
          ...prev,
          categories: {
            ...prev.categories,
            loading: false,
          },
        }));
      }
    };

    fetchCategories();
  }, [user]);

  // Récupérer les messages de l'utilisateur
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        // Récupérer tous les messages de l'utilisateur
        const q = await messageService.getByAuthor(user.uid);

        // Trier les messages par date de création (du plus récent au plus ancien)
        const sortedMessages = q.sort(
          (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
        );

        // Définir le dernier message (le plus récent)
        const lastMessage =
          sortedMessages.length > 0 ? sortedMessages[0] : null;

        // Récupérer les informations du thread associé au dernier message
        let lastMessageThread = null;
        if (lastMessage) {
          lastMessageThread = await threadService.get(lastMessage.threadId);
        }

        setStats((prev) => ({
          ...prev,
          messages: {
            count: sortedMessages.length,
            lastMessage: lastMessage,
            lastMessageThread: lastMessageThread,
            loading: false,
          },
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
        setStats((prev) => ({
          ...prev,
          messages: {
            ...prev.messages,
            loading: false,
          },
        }));
      }
    };

    fetchMessages();
  }, [user]);

  // Récupérer les discussions actives
  useEffect(() => {
    if (!user) return;

    const fetchThreads = async () => {
      try {
        // Récupérer toutes les discussions de l'utilisateur
        const threadsData = await threadService.getByAuthor(user.uid);

        // Déterminer combien sont actives (discussions ayant des messages dans les 30 derniers jours)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeThreads = threadsData.filter(
          (thread) => thread.lastMessageAt.toDate() >= thirtyDaysAgo
        );

        setStats((prev) => ({
          ...prev,
          threads: {
            activeCount: activeThreads.length,
            loading: false,
          },
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des discussions:", error);
        setStats((prev) => ({
          ...prev,
          threads: {
            ...prev.threads,
            loading: false,
          },
        }));
      }
    };

    fetchThreads();
  }, [user]);

  return { stats };
};
