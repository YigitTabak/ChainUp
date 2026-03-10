import type { Task } from '../types';

export type RingType = 'bright' | 'empty';

export interface RingSlot {
  day: number;
  type: RingType;
}

/**
 * Total display length = longest active task duration.
 */
export const getChainDisplayLength = (activeTasks: Task[]): number => {
  if (!activeTasks.length) return 0;
  return Math.max(...activeTasks.map((t) => t.duration));
};

/**
 * Minimum completed rings across all active tasks (the "global" chain progress).
 */
export const getMinCompletedRings = (activeTasks: Task[]): number => {
  if (!activeTasks.length) return 0;
  return Math.min(...activeTasks.map((t) => t.completedRings));
};

/**
 * Build the full ring array for display, purely from completedRings counts.
 * Ring at index i is 'bright' if ALL active tasks have completedRings > i.
 */
export const buildDisplayRings = (
  activeTasks: Task[],
  totalLength: number
): RingSlot[] => {
  if (!totalLength) return [];
  return Array.from({ length: totalLength }, (_, i) => ({
    day: i + 1,
    type: (activeTasks.length > 0 && activeTasks.every((t) => t.completedRings > i)
      ? 'bright'
      : 'empty') as RingType,
  }));
};


