import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LogoVariant } from '../components/ui/Logo';

interface LogoState {
  variant: LogoVariant;
  setVariant: (variant: LogoVariant) => void;
}

export const useLogoStore = create<LogoState>()(
  persist(
    (set) => ({
      variant: 'tech-forward',
      setVariant: (variant) => set({ variant }),
    }),
    {
      name: 'logo-variant',
    }
  )
);
