"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const EmailVerificationForm = () => {
  const { user, sendVerificationEmail } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Vérifier périodiquement si l'email a été vérifié
  useEffect(() => {
    if (!user) return;

    const checkEmailVerification = async () => {
      // Recharger l'utilisateur pour obtenir le statut à jour
      await user.reload();
      if (user.emailVerified) {
        router.push("/");
      }
    };

    const interval = setInterval(checkEmailVerification, 3000);
    return () => clearInterval(interval);
  }, [user, router]);

  const handleResendEmail = async () => {
    if (!user || cooldown > 0) return;

    setIsLoading(true);
    try {
      await sendVerificationEmail();
      toast.success(t.auth.verifyEmail.success);
      setCooldown(30);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(t.auth.errors.verificationEmailError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-muted-foreground">
        {t.auth.verifyEmail.description} <strong>{user?.email}</strong>
      </p>
      <Button
        onClick={handleResendEmail}
        disabled={isLoading || cooldown > 0}
        className="w-full"
      >
        {cooldown > 0
          ? `${t.auth.verifyEmail.resendIn} ${cooldown} ${t.auth.verifyEmail.seconds}`
          : t.auth.verifyEmail.resend}
      </Button>
    </div>
  );
};
