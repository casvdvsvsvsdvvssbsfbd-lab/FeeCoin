// ============================================
// Mission Store
// ============================================

import { create } from 'zustand';

export interface MissionState {
  // Missions data
  missions: any[];
  activeMissions: any[];
  completedMissions: any[];
  claimedMissions: any[];
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  setMissions: (missions: any[]) => void;
  addMission: (mission: any) => void;
  updateMission: (missionId: string, updates: any) => void;
  completeMission: (missionId: string) => void;
  claimMission: (missionId: string) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  // Initial state
  missions: [],
  activeMissions: [],
  completedMissions: [],
  claimedMissions: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,

  // Actions
  setMissions: (missions) => set({
    missions,
    activeMissions: missions.filter((m: any) => m.status === 'active'),
    completedMissions: missions.filter((m: any) => m.status === 'completed' || m.status === 'claimed'),
    claimedMissions: missions.filter((m: any) => m.status === 'claimed'),
    lastUpdated: new Date()
  }),

  addMission: (mission) => set((state) => ({
    missions: [...state.missions, mission],
    activeMissions: mission.status === 'active' ? [...state.activeMissions, mission] : state.activeMissions
  })),

  updateMission: (missionId, updates) => set((state) => ({
    missions: state.missions.map((m: any) => m.id === missionId ? { ...m, ...updates } : m),
    lastUpdated: new Date()
  })),

  completeMission: (missionId) => set((state) => ({
    missions: state.missions.map((m: any) => 
      m.id === missionId ? { ...m, status: 'completed', completedAt: new Date() } : m
    ),
    activeMissions: state.activeMissions.filter((m: any) => m.id !== missionId),
    completedMissions: [
      ...state.completedMissions,
      state.missions.find((m: any) => m.id === missionId)
    ].filter(Boolean),
    lastUpdated: new Date()
  })),

  claimMission: (missionId) => set((state) => ({
    missions: state.missions.map((m: any) => 
      m.id === missionId ? { ...m, status: 'claimed', claimedAt: new Date() } : m
    ),
    completedMissions: state.completedMissions.filter((m: any) => m.id !== missionId),
    claimedMissions: [
      ...state.claimedMissions,
      state.missions.find((m: any) => m.id === missionId)
    ].filter(Boolean),
    lastUpdated: new Date()
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setError: (error) => set({ error }),

  reset: () => set({
    missions: [],
    activeMissions: [],
    completedMissions: [],
    claimedMissions: [],
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
  }),
}));