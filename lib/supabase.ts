// FILE: /lib/supabase.ts
// App Router, CSR 전용 브라우저 클라이언트 (HMR-안전)
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ★ 도메인/프로젝트별로 절대 겹치지 않게 바꾸세요
const STORAGE_KEY = 'sb-bionvibe-main-auth-v1';

declare global {
  // eslint-disable-next-line no-var
  var __SB__: SupabaseClient | undefined;
  var __SB_COUNT__: number | undefined;
}

export function getBrowserSupabase(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('getBrowserSupabase: browser only');
  }
  if (!globalThis.__SB__) {
    globalThis.__SB__ = createClient(URL, KEY, {
      auth: { 
        persistSession: true, 
        storageKey: STORAGE_KEY,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    globalThis.__SB_COUNT__ = (globalThis.__SB_COUNT__ ?? 0) + 1;
    // 필요 시 개발 콘솔에서 생성 횟수 확인
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Supabase] Browser client created x', globalThis.__SB_COUNT__);
    }
  }
  return globalThis.__SB__!;
}

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
