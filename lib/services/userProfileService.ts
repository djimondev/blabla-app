import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../constants/collections";
import { db } from "../firebase";
import { UserProfile } from "../models/UserProfile";

const userCollection = collection(db, COLLECTIONS.USERS);

export const userProfileService = {
  create: async (
    userId: string,
    data: Omit<UserProfile, "id" | "createdAt" | "updatedAt">
  ) => {
    const now = Timestamp.now();
    const userProfile: UserProfile = {
      id: userId,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(userCollection, userId), userProfile);
    return userProfile;
  },

  get: async (userId: string) => {
    const docRef = doc(userCollection, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  },

  update: async (
    userId: string,
    data: Partial<Omit<UserProfile, "id" | "createdAt">>
  ) => {
    const docRef = doc(userCollection, userId);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(docRef, updateData);
    return updateData;
  },

  delete: async (userId: string) => {
    await deleteDoc(doc(userCollection, userId));
  },

  getByUsername: async (username: string) => {
    const q = query(userCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as UserProfile);
  },

  subscribeToUser: (
    userId: string,
    callback: (user: UserProfile | null) => void
  ) => {
    const docRef = doc(userCollection, userId);
    return onSnapshot(docRef, (snapshot) => {
      callback(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
    });
  },

  subscribeToUsersByUsername: (
    username: string,
    callback: (users: UserProfile[]) => void
  ) => {
    const q = query(userCollection, where("username", "==", username));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map((doc) => doc.data() as UserProfile));
    });
  },
};
