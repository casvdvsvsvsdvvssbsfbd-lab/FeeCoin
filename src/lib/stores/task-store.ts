// ============================================
// Task Store
// ============================================

import { create } from 'zustand';

export interface TaskState {
  // Tasks data
  tasks: any[];
  activeTasks: any[];
  completedTasks: any[];
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  setTasks: (tasks: any[]) => void;
  addTask: (task: any) => void;
  updateTask: (taskId: string, updates: any) => void;
  completeTask: (taskId: string) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  // Initial state
  tasks: [],
  activeTasks: [],
  completedTasks: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,

  // Actions
  setTasks: (tasks) => set({
    tasks,
    activeTasks: tasks.filter((t: any) => t.status === 'active'),
    completedTasks: tasks.filter((t: any) => t.status === 'completed'),
    lastUpdated: new Date()
  }),

  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task],
    activeTasks: task.status === 'active' ? [...state.activeTasks, task] : state.activeTasks
  })),

  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map((t: any) => t.id === taskId ? { ...t, ...updates } : t),
    activeTasks: state.tasks
      .filter((t: any) => t.id === taskId && t.status === 'active')
      .map((t: any) => ({ ...t, ...updates })),
    lastUpdated: new Date()
  })),

  completeTask: (taskId) => set((state) => ({
    tasks: state.tasks.map((t: any) => 
      t.id === taskId ? { ...t, status: 'completed', completedAt: new Date() } : t
    ),
    activeTasks: state.activeTasks.filter((t: any) => t.id !== taskId),
    completedTasks: [
      ...state.completedTasks,
      state.tasks.find((t: any) => t.id === taskId)
    ].filter(Boolean),
    lastUpdated: new Date()
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setError: (error) => set({ error }),

  reset: () => set({
    tasks: [],
    activeTasks: [],
    completedTasks: [],
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
  }),
}));