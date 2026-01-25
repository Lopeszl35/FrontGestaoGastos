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
    bg: "#0A0A0F",
    surface: "#13131A",
    surface2: "#1A1A24",
    text: "#FFFFFF",
    textTitle: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.60)",
    textSubtle: "rgba(255, 255, 255, 0.40)",
    border: "rgba(255, 255, 255, 0.08)",

    primary: "#7C3AED",
    primary2: "#6366F1",
    accent: "#06B6D4",
    accent2: "#0891B2",
    danger: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",

    gradients: {
      background: ["#0A0A0F", "#13131A", "#0A0A0F"],
      button: ["#7C3AED", "#6366F1"],
      buttonAccent: ["#06B6D4", "#0891B2"],
      card: ["rgba(124, 58, 237, 0.08)", "rgba(99, 102, 241, 0.04)"],
    },
  },
  tokens,
};

export const lightTheme: AppTheme = {
  name: "light",
  colors: {
    bg: "#088a8f",
    surface: "#0d0d0e",
    surface2: "#F3F4F6",
    text: "#ffffff",
    textTitle: "#111827",
    textMuted: "rgba(250, 250, 250, 0.78)",
    textSubtle: "rgba(17, 24, 39, 0.40)",
    border: "rgba(17, 24, 39, 0.08)",

    primary: "#7C3AED",
    primary2: "#6366F1",
    accent: "#0891B2",
    accent2: "#0E7490",
    danger: "#DC2626",
    success: "#059669",
    warning: "#D97706",
    info: "#2563EB",

    gradients: {
      background: ["#0f172a", "#0f172a", "#0f172a"],
      button: ["#7C3AED", "#6366F1"],
      buttonAccent: ["#0891B2", "#0E7490"],
      card: ["rgba(124, 58, 237, 0.04)", "rgba(99, 102, 241, 0.02)"],
    },
  },
  tokens,
};
