import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
  subscribeToTasks,
  subscribeToTaskLetters,
  incrementRing as fbIncrementRing,
  recordRingPress as fbRecordRingPress,
  completeTask as fbCompleteTask,
  unlockTaskLetter,
  deleteTask as fbDeleteTask,
  deleteTaskLetter,
} from '../firebase/services';
import type { Task, Letter } from '../types';
import { useAuth } from './AuthContext';
import { getChainDisplayLength } from '../utils/chainUtils';
import { getTodayStr } from '../utils/dateUtils';

interface AppContextValue {
  tasks: Task[];
  activeTasks: Task[];
  letters: Letter[];
  maxTaskDuration: number;
  loadingData: boolean;
  celebratingTaskId: string | null;
  pressRing: (taskId: string) => Promise<void>;
  markTaskComplete: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  deleteLetter: (taskId: string) => Promise<void>;
  clearCelebration: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [celebratingTaskId, setCelebratingTaskId] = useState<string | null>(null);

  const wasActiveRef = useRef<Set<string>>(new Set());

  // ── Core subscriptions ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLetters([]);
      setLoadingData(false);
      return;
    }

    setLoadingData(true);

    const unsubs: (() => void)[] = [
      subscribeToTasks(user.uid, (t) => {
        setTasks(t);
        setLoadingData(false);
      }),
      subscribeToTaskLetters(user.uid, setLetters),
    ];

    return () => unsubs.forEach((u) => u());
  }, [user]);

  const activeTasks = tasks.filter((t) => !t.isCompleted);
  const maxTaskDuration = getChainDisplayLength(activeTasks);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const pressRing = useCallback(
    async (taskId: string) => {
      if (!user) return;
      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.isCompleted) return;

      const today = getTodayStr();
      await Promise.all([
        fbIncrementRing(taskId),
        fbRecordRingPress(user.uid, today, taskId),
      ]);

      if (task.completedRings + 1 >= task.duration) {
        wasActiveRef.current.delete(taskId);
        await fbCompleteTask(taskId);
        setCelebratingTaskId(taskId);
        const taskLetter = letters.find((l) => l.taskId === taskId);
        if (taskLetter && !taskLetter.isUnlocked) {
          await unlockTaskLetter(taskId);
        }
      }
    },
    [user, tasks, letters]
  );

  const markTaskComplete = useCallback(
    async (taskId: string) => {
      if (!user) return;
      wasActiveRef.current.delete(taskId);
      await fbCompleteTask(taskId);
      setCelebratingTaskId(taskId);

      const taskLetter = letters.find((l) => l.taskId === taskId);
      if (taskLetter && !taskLetter.isUnlocked) {
        await unlockTaskLetter(taskId);
      }
    },
    [user, letters]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user) return;
      await Promise.all([fbDeleteTask(taskId), deleteTaskLetter(taskId)]);
    },
    [user]
  );

  const deleteLetter = useCallback(
    async (taskId: string) => {
      if (!user) return;
      await deleteTaskLetter(taskId);
    },
    [user]
  );

  const clearCelebration = useCallback(() => setCelebratingTaskId(null), []);

  return (
    <AppContext.Provider
      value={{
        tasks,
        activeTasks,
        letters,
        maxTaskDuration,
        loadingData,
        celebratingTaskId,
        pressRing,
        markTaskComplete,
        deleteTask,
        deleteLetter,
        clearCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be inside AppProvider');
  return ctx;
};
