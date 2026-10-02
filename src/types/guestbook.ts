import { Timestamp } from 'firebase/firestore';

export interface GuestbookMessage {
  id: string;
  nickname: string;
  content: string;
  avatarEmoji: string;
  avatarColor: string;
  createdAt: Timestamp | Date | null | number;
  likes: number;
  likedBy?: string[]; // local client tracking to prevent duplicate spam
  password?: string; // optional 4-digit code for self-deletion
  isPinned?: boolean;
}

export type ViewMode = 'kakao' | 'card';

export interface FirebaseConnectionStatus {
  state: 'connecting' | 'connected' | 'error' | 'permission_denied';
  errorMessage?: string;
  lastSyncTime?: Date;
  messageCount: number;
}
