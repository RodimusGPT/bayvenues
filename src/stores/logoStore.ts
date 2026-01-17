import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LogoVariant } from '../components/ui/Logo';
import type { IconVariant } from '../components/ui/LogoIcon';

interface LogoState {
  variant: LogoVariant;
  iconVariant: IconVariant;
  setVariant: (variant: LogoVariant) => void;
  setIconVariant: (variant: IconVariant) => void;
}

export const useLogoStore = create<LogoState>()(
  persist(
    (set) => ({
      variant: 'tech-forward',
      iconVariant: 'rings',
      setVariant: (variant) => set({ variant }),
      setIconVariant: (iconVariant) => set({ iconVariant }),
    }),
    {
      name: 'logo-variant',
    }
  )
);
