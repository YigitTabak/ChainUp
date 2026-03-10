import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, Task, DailyLog, Letter } from '../types';

// --- User ---

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const createUserProfile = async (profile: UserProfile): Promise<void> => {
  await setDoc(doc(db, 'users', profile.uid), profile);
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  await updateDoc(doc(db, 'users', uid), data as Record<string, unknown>);
};

// --- Tasks ---

export const getActiveTasks = async (userId: string): Promise<Task[]> => {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
    where('isCompleted', '==', false),
    orderBy('order', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
};

export const subscribeToTasks = (
  userId: string,
  callback: (tasks: Task[]) => void
) => {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
    orderBy('order', 'asc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task)));
  });
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<string> => {
  const ref = await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateTask = async (taskId: string, data: Partial<Task>): Promise<void> => {
  await updateDoc(doc(db, 'tasks', taskId), data as Record<string, unknown>);
};

export const incrementRing = async (taskId: string): Promise<void> => {
  await updateDoc(doc(db, 'tasks', taskId), {
    completedRings: increment(1),
  });
};

export const completeTask = async (taskId: string): Promise<void> => {
  await updateDoc(doc(db, 'tasks', taskId), {
    isCompleted: true,
    completedAt: serverTimestamp(),
  });
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await deleteDoc(doc(db, 'tasks', taskId));
};

// --- Daily Logs ---

export const getDailyLogId = (userId: string, dateStr: string) =>
  `${userId}_${dateStr}`;

export const subscribeToDailyLog = (
  userId: string,
  dateStr: string,
  callback: (log: DailyLog | null) => void
) => {
  const logId = getDailyLogId(userId, dateStr);
  return onSnapshot(doc(db, 'dailyLogs', logId), (snap) => {
    callback(snap.exists() ? (snap.data() as DailyLog) : null);
  });
};

export const subscribeToDailyLogsRange = (
  userId: string,
  startDate: string,
  endDate: string,
  callback: (logs: Record<string, DailyLog>) => void
) => {
  const q = query(
    collection(db, 'dailyLogs'),
    where('userId', '==', userId),
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  );
  return onSnapshot(q, (snap) => {
    const map: Record<string, DailyLog> = {};
    snap.docs.forEach((d) => {
      const log = d.data() as DailyLog;
      map[log.date] = log;
    });
    callback(map);
  });
};

export const toggleTaskCompletion = async (
  userId: string,
  dateStr: string,
  taskId: string,
  completed: boolean
): Promise<void> => {
  const logId = getDailyLogId(userId, dateStr);
  const logRef = doc(db, 'dailyLogs', logId);
  const snap = await getDoc(logRef);

  if (snap.exists()) {
    await updateDoc(logRef, {
      [`taskCompletions.${taskId}`]: completed,
    });
  } else {
    await setDoc(logRef, {
      id: logId,
      userId,
      date: dateStr,
      taskCompletions: { [taskId]: completed },
    });
  }
};

export const updateDailyNote = async (
  userId: string,
  dateStr: string,
  note: string
): Promise<void> => {
  const logId = getDailyLogId(userId, dateStr);
  const logRef = doc(db, 'dailyLogs', logId);
  const snap = await getDoc(logRef);

  if (snap.exists()) {
    await updateDoc(logRef, { note });
  } else {
    await setDoc(logRef, {
      id: logId,
      userId,
      date: dateStr,
      taskCompletions: {},
      note,
    });
  }
};

/**
 * Called each time the user presses "+ Halka" for a task.
 * Upserts the daily log so the History calendar shows activity for that day.
 */
export const recordRingPress = async (
  userId: string,
  dateStr: string,
  taskId: string
): Promise<void> => {
  const logId = getDailyLogId(userId, dateStr);
  const logRef = doc(db, 'dailyLogs', logId);
  const snap = await getDoc(logRef);

  if (snap.exists()) {
    await updateDoc(logRef, {
      [`taskCompletions.${taskId}`]: true,
      ringType: 'bright',
    });
  } else {
    await setDoc(logRef, {
      id: logId,
      userId,
      date: dateStr,
      taskCompletions: { [taskId]: true },
      ringType: 'bright',
    });
  }
};

export const getLogsForMonth = async (
  userId: string,
  year: number,
  month: number
): Promise<DailyLog[]> => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
  const q = query(
    collection(db, 'dailyLogs'),
    where('userId', '==', userId),
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as DailyLog);
};

// --- Letter ---

export const subscribeToTaskLetters = (
  userId: string,
  callback: (letters: Letter[]) => void
) => {
  const q = query(
    collection(db, 'letters'),
    where('userId', '==', userId),
    orderBy('writtenAt', 'asc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data() as Letter));
  });
};

export const saveTaskLetter = async (
  taskId: string,
  userId: string,
  taskTitle: string,
  content: string
): Promise<void> => {
  await setDoc(doc(db, 'letters', taskId), {
    taskId,
    taskTitle,
    userId,
    content,
    isUnlocked: false,
    writtenAt: serverTimestamp(),
  });
};

export const unlockTaskLetter = async (taskId: string): Promise<void> => {
  await updateDoc(doc(db, 'letters', taskId), {
    isUnlocked: true,
    unlockedAt: serverTimestamp(),
  });
};

export const deleteTaskLetter = async (taskId: string): Promise<void> => {
  await deleteDoc(doc(db, 'letters', taskId));
};
