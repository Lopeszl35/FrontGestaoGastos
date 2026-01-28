import type { ColorValue } from "react-native";
import { tokens } from "./tokens";

export type ThemeName = "light" | "dark";

export type AppTheme = {
  name: ThemeName;
  colors: {
    bg: string;
    surface: string;
    surface2: string;
    surfaceAlt: string;
    text: string;
    textTitle: string;
    textMuted: string;
    textSubtle: string;
    border: string;

    primary: string;
    primary2: string;
    accent: string;
    accent2: string;
    danger: string;
    success: string;
    warning: string;
    info: string;

    gradients: {
      background: readonly [ColorValue, ColorValue, ColorValue];
      button: readonly [ColorValue, ColorValue];
      buttonAccent: readonly [ColorValue, ColorValue];
      card: readonly [ColorValue, ColorValue];
    };
  };
  tokens: typeof tokens;
};

export const darkTheme: AppTheme = {
  name: "dark",
  colors: {
    // Fintech premium — dark, calmo, “quase silencioso”
    bg: "#0B1220",
    surface: "#0F1B2D",
    surface2: "#122340",
    surfaceAlt: "#122340",
    text: "#EAF0FF",
    textTitle: "#FFFFFF",
    textMuted: "rgba(234, 240, 255, 0.72)",
    textSubtle: "rgba(234, 240, 255, 0.50)",
    border: "rgba(255, 255, 255, 0.08)",

    primary: "#4F8CFF",
    primary2: "#2D5BFF",
    accent: "#2EE0C2",
    accent2: "#22C3A9",
    danger: "#aa2f31",
    success: "#26C281",
    warning: "#F7B955",
    info: "#5AA9FF",

    gradients: {
      // Mantemos gradients discretos (sem “neon”).
      background: ["#0b1220", "#0D1630", "#0B1220"],
      button: ["#4F8CFF", "#2D5BFF"],
      buttonAccent: ["#2EE0C2", "#22C3A9"],
      card: ["rgba(79, 140, 255, 0.10)", "rgba(79, 140, 255, 0.04)"],
    },
  },
  tokens,
};

export const lightTheme: AppTheme = {
  name: "light",
  colors: {
    // Mantido apenas por compatibilidade. MVP usa dark-only.
    bg: "#0B1220",
    surface: "#0F1B2D",
    surface2: "#122340",
    surfaceAlt: "#122340",
    text: "#EAF0FF",
    textTitle: "#FFFFFF",
    textMuted: "rgba(234, 240, 255, 0.72)",
    textSubtle: "rgba(234, 240, 255, 0.50)",
    border: "rgba(255, 255, 255, 0.08)",

    primary: "#4F8CFF",
    primary2: "#2D5BFF",
    accent: "#2EE0C2",
    accent2: "#22C3A9",
    danger: "#FF4D4F",
    success: "#26C281",
    warning: "#F7B955",
    info: "#5AA9FF",

    gradients: {
      background: ["#0B1220", "#0D1630", "#0B1220"],
      button: ["#4F8CFF", "#2D5BFF"],
      buttonAccent: ["#2EE0C2", "#22C3A9"],
      card: ["rgba(79, 140, 255, 0.08)", "rgba(79, 140, 255, 0.03)"],
    },
  },
  tokens,
};
