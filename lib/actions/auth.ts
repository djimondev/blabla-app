"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function checkAuthStatus() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;

    if (!sessionCookie) {
      return { isAuthenticated: false };
    }

    // @ts-ignore - Nous savons que ces variables existent dans l'environnement
    const auth = getAuth(adminApp);
    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    const user = await auth.getUser(decodedClaims.uid);

    return {
      isAuthenticated: true,
      emailVerified: user.emailVerified,
    };
  } catch {
    return { isAuthenticated: false };
  }
}

export async function requireAuth() {
  const { isAuthenticated, emailVerified } = await checkAuthStatus();

  if (!isAuthenticated) {
    redirect("/login");
  }

  if (!emailVerified) {
    redirect("/verify-email");
  }
}

export async function requireUnauth() {
  const { isAuthenticated, emailVerified } = await checkAuthStatus();

  if (isAuthenticated && emailVerified) {
    redirect("/");
  }
}

export async function requireEmailVerification() {
  const { isAuthenticated, emailVerified } = await checkAuthStatus();

  if (!isAuthenticated) {
    redirect("/login");
  }

  if (emailVerified) {
    redirect("/");
  }
}
