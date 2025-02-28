import { Timestamp } from "firebase/firestore";

export interface Thread {
  id: string;
  name: string;
  categoryId: string;
  authorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessageAt: Timestamp;
}
