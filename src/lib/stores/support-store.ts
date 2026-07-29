// ============================================
// Support Store
// ============================================

import { create } from 'zustand';

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  responses: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportState {
  // Support data
  tickets: SupportTicket[];
  activeTicket: SupportTicket | null;
  faqs: any[];
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  setTickets: (tickets: SupportTicket[]) => void;
  addTicket: (ticket: SupportTicket) => void;
  updateTicket: (ticketId: string, updates: any) => void;
  setActiveTicket: (ticket: SupportTicket | null) => void;
  setFaqs: (faqs: any[]) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useSupportStore = create<SupportState>((set) => ({
  // Initial state
  tickets: [],
  activeTicket: null,
  faqs: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,

  // Actions
  setTickets: (tickets) => set({
    tickets,
    lastUpdated: new Date()
  }),

  addTicket: (ticket) => set((state) => ({
    tickets: [ticket, ...state.tickets],
    lastUpdated: new Date()
  })),

  updateTicket: (ticketId, updates) => set((state) => ({
    tickets: state.tickets.map((t) =>
      t.id === ticketId ? { ...t, ...updates, updatedAt: new Date() } : t
    ),
    lastUpdated: new Date()
  })),

  setActiveTicket: (activeTicket) => set({ activeTicket }),

  setFaqs: (faqs) => set({
    faqs,
    lastUpdated: new Date()
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setError: (error) => set({ error }),

  reset: () => set({
    tickets: [],
    activeTicket: null,
    faqs: [],
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
  }),
}));