'use client';

import * as React from 'react';

interface ProgressContextValue {
  progress: number;
  setProgress: (value: number) => void;
}

const ProgressContext = React.createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = React.useState(0);

  const value = React.useMemo(() => ({ progress, setProgress }), [progress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = React.useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}

