import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { COLLECTIONS } from "../constants/collections";
import { db } from "../firebase";
import { Category } from "../models/Category";

const categoryCollection = collection(db, COLLECTIONS.CATEGORIES);

export const categoryService = {
  create: async (data: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    const now = Timestamp.now();
    const categoryData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(categoryCollection, categoryData);
    return {
      id: docRef.id,
      ...categoryData,
    } as Category;
  },

  get: async (categoryId: string) => {
    const docRef = doc(categoryCollection, categoryId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists()
      ? ({ id: docSnap.id, ...docSnap.data() } as Category)
      : null;
  },

  getAll: async () => {
    const q = query(categoryCollection, orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Category)
    );
  },

  update: async (
    categoryId: string,
    data: Partial<Omit<Category, "id" | "createdAt">>
  ) => {
    const docRef = doc(categoryCollection, categoryId);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(docRef, updateData);
    return updateData;
  },

  delete: async (categoryId: string) => {
    await deleteDoc(doc(categoryCollection, categoryId));
  },

  subscribeToCategory: (
    categoryId: string,
    callback: (category: Category | null) => void
  ) => {
    const docRef = doc(categoryCollection, categoryId);
    return onSnapshot(docRef, (snapshot) => {
      callback(
        snapshot.exists()
          ? ({ id: snapshot.id, ...snapshot.data() } as Category)
          : null
      );
    });
  },

  subscribeToAllCategories: (callback: (categories: Category[]) => void) => {
    const q = query(categoryCollection, orderBy("name"));
    return onSnapshot(q, (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category))
      );
    });
  },
};
