import { Timestamp } from "firebase/firestore";

export interface Message {
  id: string;
  content: string;
  threadId: string;
  authorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
