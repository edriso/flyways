import { useState, useEffect } from 'react';

// Available themes
export const themes = [
  { id: 'light', name: 'Light', icon: '☀️' },
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'blue', name: 'Ocean', icon: '🌊' },
  { id: 'pink', name: 'Rose', icon: '🌸' },
  { id: 'purple', name: 'Lavender', icon: '☂️' },
  { id: 'green', name: 'Mint', icon: '🌿' },
];

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Get saved theme or default to 'light'
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('dark', 'theme-blue', 'theme-pink', 'theme-purple', 'theme-green');
    
    // Apply the selected theme
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme !== 'light') {
      root.classList.add(`theme-${theme}`);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Cycle to next theme
  const nextTheme = () => {
    const currentIndex = themes.findIndex(t => t.id === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].id);
  };

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return { theme, setTheme, nextTheme, currentTheme, themes };
};

