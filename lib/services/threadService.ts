import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as limitQuery,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../constants/collections";
import { db } from "../firebase";
import { Thread } from "../models/Thread";

const threadCollection = collection(db, COLLECTIONS.THREADS);

export const threadService = {
  create: async (
    data: Omit<Thread, "id" | "createdAt" | "updatedAt" | "lastMessageAt">
  ) => {
    const now = Timestamp.now();
    const threadData = {
      ...data,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    };

    const docRef = await addDoc(threadCollection, threadData);
    return {
      id: docRef.id,
      ...threadData,
    } as Thread;
  },

  get: async (threadId: string) => {
    const docRef = doc(threadCollection, threadId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists()
      ? ({ id: docSnap.id, ...docSnap.data() } as Thread)
      : null;
  },

  getByCategory: async (categoryId: string, limit = 20) => {
    const q = query(
      threadCollection,
      where("categoryId", "==", categoryId),
      orderBy("lastMessageAt", "desc"),
      limitQuery(limit)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Thread)
    );
  },

  getByAuthor: async (authorId: string) => {
    const q = query(
      threadCollection,
      where("authorId", "==", authorId),
      orderBy("lastMessageAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Thread)
    );
  },

  update: async (
    threadId: string,
    data: Partial<Omit<Thread, "id" | "createdAt">>
  ) => {
    const docRef = doc(threadCollection, threadId);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(docRef, updateData);
    return updateData;
  },

  updateLastMessageTime: async (threadId: string) => {
    const docRef = doc(threadCollection, threadId);
    const now = Timestamp.now();
    await updateDoc(docRef, {
      lastMessageAt: now,
      updatedAt: now,
    });
  },

  delete: async (threadId: string) => {
    await deleteDoc(doc(threadCollection, threadId));
  },

  subscribeToThread: (
    threadId: string,
    callback: (thread: Thread | null) => void
  ) => {
    const docRef = doc(threadCollection, threadId);
    return onSnapshot(docRef, (snapshot) => {
      callback(
        snapshot.exists()
          ? ({ id: snapshot.id, ...snapshot.data() } as Thread)
          : null
      );
    });
  },

  subscribeToCategoryThreads: (
    categoryId: string,
    limit = 20,
    callback: (threads: Thread[]) => void
  ) => {
    const q = query(
      threadCollection,
      where("categoryId", "==", categoryId),
      orderBy("lastMessageAt", "desc"),
      limitQuery(limit)
    );
    return onSnapshot(q, (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Thread))
      );
    });
  },

  subscribeToAuthorThreads: (
    authorId: string,
    callback: (threads: Thread[]) => void
  ) => {
    const q = query(
      threadCollection,
      where("authorId", "==", authorId),
      orderBy("lastMessageAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Thread))
      );
    });
  },
};
