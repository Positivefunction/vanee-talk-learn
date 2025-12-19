import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  User, 
  ChildProfile, 
  AppSettings, 
  FeatureFlags,
  SupportedLanguage 
} from '@/types';
import { defaultSettings } from '@/lib/db';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'aurora-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Assessment Attempt interface for tracking
export interface AssessmentAttempt {
  id: string;
  word: string;
  phoneme: string;
  accuracy: number;
  isCorrect: boolean;
  transcript: string;
  timestamp: number;
}

// Session Results interface
export interface SessionResults {
  sessionId: string;
  language: string;
  startTime: number;
  endTime: number;
  attempts: AssessmentAttempt[];
  totalQuestions: number;
  correctCount: number;
  overallAccuracy: number;
  weakPhonemes: string[];
  strongPhonemes: string[];
  xpEarned: number;
}

// Child Game Store
interface GameState {
  currentProfile: ChildProfile | null;
  currentLanguage: SupportedLanguage;
  currentPackId: string | null;
  currentCardIndex: number;
  sessionId: string | null;
  isRecording: boolean;
  isProcessing: boolean;
  hearts: number;
  streak: number;
  xp: number;
  // Session tracking
  sessionAttempts: AssessmentAttempt[];
  sessionStartTime: number | null;
  lastSessionResults: SessionResults | null;
  // Actions
  setProfile: (profile: ChildProfile | null) => void;
  setLanguage: (language: SupportedLanguage) => void;
  startSession: (packId: string) => void;
  nextCard: () => void;
  setRecording: (recording: boolean) => void;
  setProcessing: (processing: boolean) => void;
  updateHearts: (hearts: number) => void;
  updateStreak: (streak: number) => void;
  addXP: (xp: number) => void;
  addAttempt: (attempt: AssessmentAttempt) => void;
  completeSession: () => SessionResults | null;
  resetSession: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentProfile: null,
      currentLanguage: 'english',
      currentPackId: null,
      currentCardIndex: 0,
      sessionId: null,
      isRecording: false,
      isProcessing: false,
      hearts: 5,
      streak: 0,
      xp: 0,
      sessionAttempts: [],
      sessionStartTime: null,
      lastSessionResults: null,
      
      setProfile: (profile) => set({ 
        currentProfile: profile,
        hearts: profile?.hearts ?? 5,
        streak: profile?.streak ?? 0,
        xp: profile?.xp ?? 0,
        currentLanguage: profile?.primaryLanguage ?? 'english',
      }),
      setLanguage: (language) => set({ currentLanguage: language }),
      startSession: (packId) => set({ 
        currentPackId: packId, 
        currentCardIndex: 0,
        sessionId: crypto.randomUUID(),
        sessionAttempts: [],
        sessionStartTime: Date.now(),
      }),
      nextCard: () => set((state) => ({ currentCardIndex: state.currentCardIndex + 1 })),
      setRecording: (recording) => set({ isRecording: recording }),
      setProcessing: (processing) => set({ isProcessing: processing }),
      updateHearts: (hearts) => set({ hearts: Math.max(0, Math.min(5, hearts)) }),
      updateStreak: (streak) => set({ streak }),
      addXP: (xpToAdd) => set((state) => ({ xp: state.xp + xpToAdd })),
      
      addAttempt: (attempt) => set((state) => ({
        sessionAttempts: [...state.sessionAttempts, attempt],
      })),
      
      completeSession: () => {
        const state = get();
        if (!state.sessionId || state.sessionAttempts.length === 0) return null;
        
        const attempts = state.sessionAttempts;
        const correctCount = attempts.filter(a => a.isCorrect).length;
        const overallAccuracy = Math.round(
          attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length
        );
        
        // Calculate phoneme stats
        const phonemeStats: Record<string, { total: number; correct: number }> = {};
        attempts.forEach(a => {
          if (!phonemeStats[a.phoneme]) {
            phonemeStats[a.phoneme] = { total: 0, correct: 0 };
          }
          phonemeStats[a.phoneme].total++;
          if (a.isCorrect) phonemeStats[a.phoneme].correct++;
        });
        
        const weakPhonemes: string[] = [];
        const strongPhonemes: string[] = [];
        
        Object.entries(phonemeStats).forEach(([phoneme, stats]) => {
          const accuracy = (stats.correct / stats.total) * 100;
          if (accuracy < 70) {
            weakPhonemes.push(phoneme);
          } else {
            strongPhonemes.push(phoneme);
          }
        });
        
        const totalXP = attempts.reduce((sum, a) => sum + (a.isCorrect ? Math.floor(a.accuracy / 10) : 0), 0);
        
        const results: SessionResults = {
          sessionId: state.sessionId,
          language: state.currentLanguage,
          startTime: state.sessionStartTime || Date.now(),
          endTime: Date.now(),
          attempts,
          totalQuestions: attempts.length,
          correctCount,
          overallAccuracy,
          weakPhonemes,
          strongPhonemes,
          xpEarned: totalXP,
        };
        
        set({ lastSessionResults: results });
        return results;
      },
      
      resetSession: () => set({ 
        currentPackId: null, 
        currentCardIndex: 0,
        sessionId: null,
        sessionAttempts: [],
        sessionStartTime: null,
      }),
    }),
    {
      name: 'aurora-game',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lastSessionResults: state.lastSessionResults,
        currentLanguage: state.currentLanguage,
        xp: state.xp,
        streak: state.streak,
      }),
    }
  )
);

// Therapist Store
interface TherapistState {
  selectedPatientId: string | null;
  selectedPackId: string | null;
  isAuthoringMode: boolean;
  currentSessionId: string | null;
  patientResults: SessionResults[];
  // Actions
  selectPatient: (id: string | null) => void;
  selectPack: (id: string | null) => void;
  setAuthoringMode: (mode: boolean) => void;
  startClinicSession: (sessionId: string) => void;
  endClinicSession: () => void;
  addPatientResult: (result: SessionResults) => void;
}

export const useTherapistStore = create<TherapistState>()(
  persist(
    (set) => ({
      selectedPatientId: null,
      selectedPackId: null,
      isAuthoringMode: false,
      currentSessionId: null,
      patientResults: [],
      selectPatient: (id) => set({ selectedPatientId: id }),
      selectPack: (id) => set({ selectedPackId: id }),
      setAuthoringMode: (mode) => set({ isAuthoringMode: mode }),
      startClinicSession: (sessionId) => set({ currentSessionId: sessionId }),
      endClinicSession: () => set({ currentSessionId: null }),
      addPatientResult: (result) => set((state) => ({
        patientResults: [...state.patientResults, result],
      })),
    }),
    {
      name: 'aurora-therapist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Settings Store
interface SettingsState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) => 
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
    }),
    {
      name: 'aurora-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Feature Flags Store
interface FeatureFlagsState {
  flags: FeatureFlags;
  setFlags: (flags: Partial<FeatureFlags>) => void;
}

export const useFeatureFlagsStore = create<FeatureFlagsState>()((set) => ({
  flags: {
    cloudSync: false,
    asrProduction: false,
    llmSoap: true, // Now enabled with Lovable AI
    llmTherapyPlan: true, // Now enabled with Lovable AI
    teletherapy: true,
    parentCommunity: true,
  },
  setFlags: (newFlags) => 
    set((state) => ({ flags: { ...state.flags, ...newFlags } })),
}));

// UI Store for global UI state
interface UIState {
  isSidebarOpen: boolean;
  isBottomSheetOpen: boolean;
  bottomSheetContent: React.ReactNode | null;
  toastQueue: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openBottomSheet: (content: React.ReactNode) => void;
  closeBottomSheet: () => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: true,
  isBottomSheetOpen: false,
  bottomSheetContent: null,
  toastQueue: [],
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openBottomSheet: (content) => set({ isBottomSheetOpen: true, bottomSheetContent: content }),
  closeBottomSheet: () => set({ isBottomSheetOpen: false, bottomSheetContent: null }),
  addToast: (message, type) => {
    const id = crypto.randomUUID();
    set((state) => ({ 
      toastQueue: [...state.toastQueue, { id, message, type }] 
    }));
    setTimeout(() => {
      set((state) => ({ 
        toastQueue: state.toastQueue.filter((t) => t.id !== id) 
      }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ 
    toastQueue: state.toastQueue.filter((t) => t.id !== id) 
  })),
}));

// Sync Store for offline-first
interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt: number | null;
  pendingCount: number;
  // Actions
  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSync: (timestamp: number) => void;
  setPendingCount: (count: number) => void;
}

export const useSyncStore = create<SyncState>()((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  lastSyncAt: null,
  pendingCount: 0,
  setOnline: (online) => set({ isOnline: online }),
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  setLastSync: (timestamp) => set({ lastSyncAt: timestamp }),
  setPendingCount: (count) => set({ pendingCount: count }),
}));

// Initialize online/offline listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useSyncStore.getState().setOnline(true));
  window.addEventListener('offline', () => useSyncStore.getState().setOnline(false));
}
