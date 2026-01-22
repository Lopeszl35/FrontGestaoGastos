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
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
  },

  glow: {
    primary: "rgba(124, 58, 237, 0.25)",
    accent: "rgba(6, 182, 212, 0.25)",
    soft: "rgba(124, 58, 237, 0.06)",
    danger: "rgba(239, 68, 68, 0.25)",
    success: "rgba(16, 185, 129, 0.25)",
  },

  shadow: {
    card: {
      shadowColor: "#000000",
      shadowOpacity: 0.30,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },
    cardActive: {
      shadowColor: "#7C3AED",
      shadowOpacity: 0.40,
      shadowRadius: 32,
      shadowOffset: { width: 0, height: 16 },
      elevation: 16,
    },
    inputFocus: {
      shadowColor: "#7C3AED",
      shadowOpacity: 0.30,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  },

  motion: {
    fast: 90,
    normal: 140,
    slow: 220,
  },
} as const;