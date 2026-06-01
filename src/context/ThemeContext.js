import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, defaultTheme } from '../themes/themes';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(defaultTheme);

  useEffect(() => {
    AsyncStorage.getItem('themeKey').then((saved) => {
      if (saved && themes[saved]) setThemeKey(saved);
    });
  }, []);

  const setTheme = async (key) => {
    setThemeKey(key);
    await AsyncStorage.setItem('themeKey', key);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[themeKey], themeKey, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
