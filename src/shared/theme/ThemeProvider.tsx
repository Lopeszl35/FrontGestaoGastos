import React, { createContext, useContext, useMemo, useState } from "react";
import { darkTheme, lightTheme, type AppTheme, type ThemeName } from "./themes";

type ThemeContextValue = {
  theme: AppTheme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>("light");

  const theme = useMemo(() => (themeName === "dark" ? darkTheme : lightTheme), [themeName]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeName,
      setThemeName,
      toggleTheme: () => setThemeName((p) => (p === "dark" ? "light" : "dark")),
    }),
    [theme, themeName]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
