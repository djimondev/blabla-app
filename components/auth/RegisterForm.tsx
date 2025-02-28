"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useTranslation } from "@/lib/hooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const { register, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(email, password, username);
      router.push("/");
    } catch (error: unknown) {
      let errorMessage = t.auth.errors.registrationError;

      // Firebase specific error handling
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === "auth/email-already-in-use") {
          // @ts-ignore - Les types de traduction ne correspondent pas mais c'est correct
          errorMessage = t.auth.errors.emailAlreadyInUse;
        } else if (firebaseError.code === "auth/weak-password") {
          // @ts-ignore - Les types de traduction ne correspondent pas mais c'est correct
          errorMessage = t.auth.errors.weakPassword;
        } else if (firebaseError.code === "auth/invalid-email") {
          // @ts-ignore - Les types de traduction ne correspondent pas mais c'est correct
          errorMessage = t.auth.errors.invalidEmail;
        }
      }

      toast({
        variant: "destructive",
        title: t.common.error,
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);

    try {
      await loginWithGoogle();
      router.push("/");
    } catch {
      toast({
        variant: "destructive",
        title: t.common.error,
        description: t.auth.errors.googleError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleRegister}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">{t.auth.username}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t.auth.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t.auth.signUp}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t.auth.orContinueWith}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={handleGoogleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
      <div className="text-center text-sm">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
        >
          {t.auth.alreadyHaveAccount}
        </Link>
      </div>
    </div>
  );
};
