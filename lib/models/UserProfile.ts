import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  bio?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
