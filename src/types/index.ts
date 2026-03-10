import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  onboardingComplete: boolean;
  motivation: string;
  createdAt: Timestamp;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  dailyGoal: string;
  duration: number; // total rings, max 31
  completedRings: number; // how many ring presses have been recorded
  isCompleted: boolean;
  completedAt?: Timestamp;
  order: number;
  createdAt: Timestamp;
}

export interface DailyLog {
  id: string; // format: userId_YYYY-MM-DD
  userId: string;
  date: string; // YYYY-MM-DD
  taskCompletions: Record<string, boolean>;
  ringType?: string;
  note?: string;
}

export interface Letter {
  taskId: string;
  taskTitle: string;
  userId: string;
  content: string;
  isUnlocked: boolean;
  writtenAt: Timestamp;
  unlockedAt?: Timestamp;
}

export interface OnboardingState {
  step: number;
  motivation: string;
  taskTitle: string;
  taskDailyGoal: string;
  taskDuration: number;
  letterContent: string;
}
