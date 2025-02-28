"use client";

import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userProfileService } from "../services/userProfileService";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (user) => {
        if (user) {
          // Recharger l'utilisateur pour obtenir le statut le plus récent
          await user.reload();
          // Utiliser l'utilisateur mis à jour depuis auth.currentUser
          setUser(auth.currentUser);

          // Définir le cookie de session pour que le middleware puisse le détecter
          // Utiliser le token ID comme valeur du cookie
          const token = await user.getIdToken();
          Cookies.set("__session", token, {
            expires: 14, // 14 jours d'expiration
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
          });
        } else {
          setUser(null);
          // Supprimer le cookie de session lors de la déconnexion
          Cookies.remove("__session");
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error instanceof Error ? error : new Error("Échec de la connexion");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        await userProfileService.create(result.user.uid, {
          username:
            result.user.displayName ||
            result.user.email?.split("@")[0] ||
            "Anonymous",
          avatarUrl: result.user.photoURL || "",
        });
      }
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Échec de la connexion avec Google");
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        await userProfileService.create(userCredential.user.uid, {
          username,
          avatarUrl: "",
        });
        await sendEmailVerification(userCredential.user);
      }
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Échec de l'inscription");
    }
  };

  const sendVerificationEmail = async () => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error("Échec de l'envoi de l'email de vérification");
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Le cookie sera supprimé par le event listener onAuthStateChanged
      router.push("/login");
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Échec de la déconnexion");
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signInWithGoogle,
    signUp,
    sendVerificationEmail,
    logout,
  };
};
