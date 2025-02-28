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
import { Message } from "../models/Message";

const messageCollection = collection(db, COLLECTIONS.MESSAGES);

export const messageService = {
  create: async (data: Omit<Message, "id" | "createdAt" | "updatedAt">) => {
    const now = Timestamp.now();
    const messageData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(messageCollection, messageData);
    return {
      id: docRef.id,
      ...messageData,
    } as Message;
  },

  get: async (messageId: string) => {
    const docRef = doc(messageCollection, messageId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists()
      ? ({ id: docSnap.id, ...docSnap.data() } as Message)
      : null;
  },

  getByThread: async (threadId: string, limit = 50) => {
    const q = query(
      messageCollection,
      where("threadId", "==", threadId),
      orderBy("createdAt", "desc"),
      limitQuery(limit)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Message)
    );
  },

  getByAuthor: async (authorId: string, limit = 20) => {
    const q = query(
      messageCollection,
      where("authorId", "==", authorId),
      orderBy("createdAt", "desc"),
      limitQuery(limit)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Message)
    );
  },

  update: async (
    messageId: string,
    data: Partial<Omit<Message, "id" | "createdAt" | "threadId" | "authorId">>
  ) => {
    const docRef = doc(messageCollection, messageId);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(docRef, updateData);
    return updateData;
  },

  delete: async (messageId: string) => {
    await deleteDoc(doc(messageCollection, messageId));
  },

  subscribeToMessage: (
    messageId: string,
    callback: (message: Message | null) => void
  ) => {
    const docRef = doc(messageCollection, messageId);
    return onSnapshot(docRef, (snapshot) => {
      callback(
        snapshot.exists()
          ? ({ id: snapshot.id, ...snapshot.data() } as Message)
          : null
      );
    });
  },

  subscribeToThreadMessages: (
    threadId: string,
    limit = 50,
    callback: (messages: Message[]) => void
  ) => {
    const q = query(
      messageCollection,
      where("threadId", "==", threadId),
      orderBy("createdAt", "desc"),
      limitQuery(limit)
    );
    return onSnapshot(q, (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message))
      );
    });
  },

  subscribeToAuthorMessages: (
    authorId: string,
    limit = 20,
    callback: (messages: Message[]) => void
  ) => {
    const q = query(
      messageCollection,
      where("authorId", "==", authorId),
      orderBy("createdAt", "desc"),
      limitQuery(limit)
    );
    return onSnapshot(q, (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message))
      );
    });
  },
};
