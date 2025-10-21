import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton pattern to prevent multiple instances
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'bionvibe-auth-token', // Unique storage key to avoid conflicts
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  return supabaseInstance;
}

export const supabase = getSupabaseClient();

// 타입 정의
export interface Contact {
  id?: number;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'answered' | 'closed';
  created_at?: string;
  answered_at?: string;
  admin_reply?: string;
}

export interface Analytics {
  id?: number;
  app_id: string;
  timestamp: string;
  referrer?: string;
}

export interface Ranking {
  id?: number;
  app_id: string;
  nickname: string;
  score: number;
  created_at?: string;
}

