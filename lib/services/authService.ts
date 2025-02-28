import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../firebase";
import { userProfileService } from "./userProfileService";

export const authService = {
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Create or update user profile
    if (result.user) {
      await userProfileService.create(result.user.uid, {
        username:
          result.user.displayName ??
          result.user.email?.split("@")[0] ??
          "Anonymous",
        avatarUrl: result.user.photoURL ?? "",
      });
    }

    return result.user;
  },

  loginWithEmail: async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  register: async (email: string, password: string, username: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Create user profile
    if (result.user) {
      await userProfileService.create(result.user.uid, {
        username,
        avatarUrl: "",
      });
      await sendEmailVerification(result.user);
    }

    return result.user;
  },

  sendVerificationEmail: async (user: User) => {
    await sendEmailVerification(user);
  },

  logout: async () => {
    await signOut(auth);
  },

  getCurrentUser: () => auth.currentUser,

  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};
