'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ThemeToggleButton() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null // avoid hydration mismatch
  
  console.log(systemTheme);

  return (
    <button
      onClick={() => theme == 'dark' ? setTheme('light') : setTheme('dark')}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
