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

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    // Log l'erreur sur un service d'analytics
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
          <Card className="w-full max-w-md overflow-hidden">
            <CardHeader className="pb-4 text-center">
              <CardTitle className="text-4xl font-bold">
                {t.errors.critical.title}
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
                    scale: [1, 1.05, 1, 0.95, 1],
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
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                </motion.div>
              </motion.div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                  {t.errors.critical.heading}
                </h2>
                <p className="text-muted-foreground">
                  {t.errors.critical.description}
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
      </body>
    </html>
  );
}
