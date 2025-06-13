import React, { createContext, useMemo, useState, useContext } from 'react';
import { createTheme } from '@mui/material/styles';

// Create the context
const ThemeContext = createContext();

// Custom provider component that manages the theme mode state
export function ThemeProviderCustom({ children }) {
  // Hold the theme mode in state; default to 'light'
  const [mode, setMode] = useState('light');

  // Function to toggle mode
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Using useMemo here ensures we only recreate the theme when mode changes
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to easily access the theme context
export function useThemeContext() {
  return useContext(ThemeContext);
}
