'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => theme === 'dark' ? setTheme('light') : setTheme('dark')}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
