// src/shared/theme/themes.ts
import type { ColorValue } from "react-native";
import { tokens } from "./tokens";

export type ThemeName = "light" | "dark";

export type AppTheme = {
  name: ThemeName;
  colors: {
    bg: string;
    surface: string;
    surface2: string;
    text: string;
    textMuted: string;
    border: string;

    primary: string;     
    primary2: string;
    danger: string;

    gradients: {
      background: readonly [ColorValue, ColorValue];
      button: readonly [ColorValue, ColorValue];
    };
  };
  tokens: typeof tokens;
};

export const darkTheme: AppTheme = {
  name: "dark",
  colors: {
    bg: "#07130C",
    surface: "#0B1E14",
    surface2: "#0E2619",  
    text: "#000000",
    textMuted: "rgba(234, 247, 239, 0.70)",
    border: "rgba(234, 247, 239, 0.10)",

    primary: "#42E68A",
    primary2: "#19A05F",
    danger: "#FF5C7C",

    gradients: {
      background: ["#07130C", "#0A1D14"],
      button: ["#42E68A", "#19A05F"],
    },
  },
  tokens,
};

export const lightTheme: AppTheme = {
  name: "light",
  colors: {
    bg: "#F1F6F1",        
    surface: "#0eeb75", 
    surface2: "#10271B",
    text: "#000000",
    textMuted: "rgba(0, 0, 0, 0.65)",
    border: "rgba(3, 3, 3, 0.12)",

    primary: "#19A05F",
    primary2: "#0E7D47",
    danger: "#D9445F",

    gradients: {
      background: ["#f8f1f1", "#62d662"],
      button: ["#19A05F", "#0E7D47"],
    },
  },
  tokens,
};
