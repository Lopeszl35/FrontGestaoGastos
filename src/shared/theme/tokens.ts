// src/shared/theme/tokens.ts
export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
} as const;

export const typography = {
  size: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, xxl: 30 },
  weight: { regular: "400" as const, medium: "600" as const, bold: "700" as const },
} as const;

export const tokens = {
  radii: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
  },

  glow: {
    primary: "rgba(66, 230, 138, 0.42)", 
    secondary: "rgba(25, 160, 95, 0.30)",
    soft: "rgba(255,255,255,0.10)",
    danger: "rgba(255, 92, 124, 0.50)",
    cyan: "rgba(3, 56, 7, 0.55)", 
  },

  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
      elevation: 10,
    },
      cardActive: {
      shadowColor: "rgba(66, 230, 138, 0.60)", 
      shadowOpacity: 0.28,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 16 },
      elevation: 14,
    },
    inputFocus: {
      shadowColor: "rgba(66, 230, 138, 0.55)",
      shadowOpacity: 0.22,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
  },

  motion: {
    fast: 90,
    normal: 140,
    slow: 220,
  },
} as const;
