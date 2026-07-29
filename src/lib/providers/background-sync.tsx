// ============================================
// Background Sync
// Production-ready background synchronization
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface SyncTask {
  id: string;
  type: 'wallet' | 'profile' | 'notifications' | 'rewards' | 'analytics' | 'settings';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  data: Record<string, any>;
  retryCount: number;
  maxRetries: number;
  createdAt: number;
  lastAttemptAt?: number;
  error?: string;
}

interface BackgroundSyncContextType {
  tasks: SyncTask[];
  isSyncing: boolean;
  lastSyncAt?: number;
  addTask: (task: Omit<SyncTask, 'id' | 'createdAt' | 'retryCount' | 'status'>) => string;
  processTask: (taskId: string) => Promise<void>;
  processAllTasks: () => Promise<void>;
  clearCompletedTasks: () => void;
  clearFailedTasks: () => void;
  getPendingTasks: () => SyncTask[];
}

const BackgroundSyncContext = createContext<BackgroundSyncContextType | undefined>(undefined);

interface BackgroundSyncProps {
  children: ReactNode;
  storageKey?: string;
  maxTasks?: number;
  maxRetries?: number;
  syncInterval?: number;
  enableAutoSync?: boolean;
}

export const BackgroundSync: React.FC<BackgroundSyncProps> = ({
  children,
  storageKey = 'fee_sync_tasks',
  maxTasks = 50,
  maxRetries = 3,
  syncInterval = 60000, // 1 minute
  enableAutoSync = true,
}) => {
  const [tasks, setTasks] = useState<SyncTask[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<number | undefined>();

  const addTask = useCallback(
    (taskData: Omit<SyncTask, 'id' | 'createdAt' | 'retryCount' | 'status'>): string => {
      const id = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const task: SyncTask = {
        ...taskData,
        id,
        status: 'pending',
        retryCount: 0,
        createdAt: Date.now(),
      };

      setTasks((prev) => {
        const updated = [task, ...prev];
        if (updated.length > maxTasks) {
          return updated.slice(0, maxTasks);
        }
        return updated;
      });

      return id;
    },
    [maxTasks]
  );

  const processTask = useCallback(async (taskId: string): Promise<void> => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === 'syncing' || task.status === 'completed') {
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'syncing' as const, lastAttemptAt: Date.now() } : t))
    );

    try {
      // In production, send to API
      // await syncToAPI(task);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' as const } : t))
      );

      setLastSyncAt(Date.now());
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sync failed');
      
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          
          const retryCount = t.retryCount + 1;
          if (retryCount >= t.maxRetries) {
            return { ...t, status: 'failed' as const, retryCount, error: error.message };
          }
          
          return { ...t, status: 'pending' as const, retryCount, error: error.message };
        })
      );
    }
  }, [tasks]);

  const processAllTasks = useCallback(async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    const pendingTasks = tasks.filter((t) => t.status === 'pending');

    for (const task of pendingTasks) {
      await processTask(task.id);
    }

    setIsSyncing(false);
  }, [isSyncing, tasks, processTask]);

  const clearCompletedTasks = useCallback(() => {
    setTasks((prev) => prev.filter((t) => t.status !== 'completed'));
  }, []);

  const clearFailedTasks = useCallback(() => {
    setTasks((prev) => prev.filter((t) => t.status !== 'failed'));
  }, []);

  const getPendingTasks = useCallback((): SyncTask[] => {
    return tasks.filter((t) => t.status === 'pending');
  }, [tasks]);

  // Auto-sync
  useEffect(() => {
    if (!enableAutoSync) return;

    const interval = setInterval(() => {
      processAllTasks();
    }, syncInterval);

    return () => clearInterval(interval);
  }, [enableAutoSync, syncInterval, processAllTasks]);

  // Process tasks when online
  useEffect(() => {
    const handleOnline = () => {
      processAllTasks();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [processAllTasks]);

  const value: BackgroundSyncContextType = {
    tasks,
    isSyncing,
    lastSyncAt,
    addTask,
    processTask,
    processAllTasks,
    clearCompletedTasks,
    clearFailedTasks,
    getPendingTasks,
  };

  return <BackgroundSyncContext.Provider value={value}>{children}</BackgroundSyncContext.Provider>;
};

export const useBackgroundSync = (): BackgroundSyncContextType => {
  const context = useContext(BackgroundSyncContext);
  if (!context) {
    throw new Error('useBackgroundSync must be used within a BackgroundSync');
  }
  return context;
};

export const useSyncTasks = () => {
  const { tasks, addTask, processTask, processAllTasks } = useBackgroundSync();
  return { tasks, addTask, processTask, processAllTasks };
};