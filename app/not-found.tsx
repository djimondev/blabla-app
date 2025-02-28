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
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="pb-4 text-center">
          <CardTitle className="text-4xl font-bold">
            {t.errors.notFound.title}
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
                rotate: [0, 5, 0, -5, 0],
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
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </motion.div>
          </motion.div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{t.errors.notFound.heading}</h2>
            <p className="text-muted-foreground">
              {t.errors.notFound.description}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-0">
          <Button onClick={() => router.back()} variant="outline">
            {t.common.back}
          </Button>
          <Button asChild>
            <Link href="/">{t.common.home}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
