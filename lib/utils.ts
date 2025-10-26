import { clsx } from 'clsx';

/**
 * Tailwind-centric class name merger similar to shadcn's `cn` helper.
 */
export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

