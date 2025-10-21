'use client';

import { createContext, useContext } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { getBrowserSupabase } from './supabase';

const SupabaseContext = createContext<SupabaseClient | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // globalThis를 사용한 싱글톤 인스턴스 사용
  const supabase = getBrowserSupabase();

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return context;
}

