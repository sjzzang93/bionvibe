// FILE: /lib/supabase.ts
// App Router, CSR 전용 브라우저 클라이언트 (HMR-안전)
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let warnedMissingConfig = false;

const warnIfMissingConfig = () => {
  if (warnedMissingConfig) return;
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.warn(
      '[Supabase] 환경변수가 설정되지 않아 실시간/저장 기능이 비활성화됩니다. NEXT_PUBLIC_SUPABASE_URL 및 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해주세요.',
    );
  }
  warnedMissingConfig = true;
};

// ★ 도메인/프로젝트별로 절대 겹치지 않게 바꾸세요
const STORAGE_KEY = 'sb-bionvibe-main-auth-v1';

declare global {
  // eslint-disable-next-line no-var
  var __SB__: SupabaseClient | null | undefined;
  var __SB_COUNT__: number | undefined;
}

export function getBrowserSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    warnIfMissingConfig();
    return null;
  }

  if (typeof window === 'undefined') {
    return createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  if (!globalThis.__SB__) {
    globalThis.__SB__ = createClient(SUPABASE_URL, SUPABASE_KEY, {
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
  return globalThis.__SB__ ?? null;
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
