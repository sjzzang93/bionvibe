// FILE: /lib/supabase-provider.tsx
'use client';

import { createContext, useContext, useMemo } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getBrowserSupabase } from './supabase';

const SupabaseCtx = createContext<SupabaseClient | null>(null);

export const useSupabase = () => useContext(SupabaseCtx);

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getBrowserSupabase(), []);
  return <SupabaseCtx.Provider value={supabase}>{children}</SupabaseCtx.Provider>;
}
