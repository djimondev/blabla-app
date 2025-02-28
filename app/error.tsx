"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    // Optionnel: Log l'erreur sur un service d'analytics
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="pb-4 text-center">
          <CardTitle className="text-4xl font-bold">
            {t.errors.server.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 mb-4"
          >
            <motion.div
              className="w-full h-full flex items-center justify-center"
              animate={{
                y: [0, -5, 0, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-full h-full text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 14.25h13.5m-13.5 4.5h13.5M3.75 6.75h16.5m-16.5 4.5h16.5M4.5 19.5h15a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H4.5A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z"
                />
              </svg>
            </motion.div>
          </motion.div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{t.errors.server.heading}</h2>
            <p className="text-muted-foreground">
              {t.errors.server.description}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-0">
          <Button onClick={reset} variant="outline">
            {t.common.retry}
          </Button>
          <Button asChild>
            <Link href="/">{t.common.home}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
