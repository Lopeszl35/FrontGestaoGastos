// Escala baseada em 4px (consistência visual = sensação premium)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const typography = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  weight: {
    regular: "400" as const,
    medium: "600" as const,
    bold: "700" as const,
  },
} as const;

export const tokens = {
  radii: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
  },

  // “Glow” comedido. Em fintech premium, glow existe só como estado (focus/ativo).
  glow: {
    primary: "rgba(79, 140, 255, 0.18)",
    soft: "rgba(79, 140, 255, 0.06)",
    danger: "rgba(255, 77, 79, 0.16)",
    success: "rgba(38, 194, 129, 0.16)",
  },

  shadow: {
    card: {
      shadowColor: "#000000",
      shadowOpacity: 0.24,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    cardActive: {
      shadowColor: "#000000",
      shadowOpacity: 0.32,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },
    inputFocus: {
      shadowColor: "rgba(79, 140, 255, 0.35)",
      shadowOpacity: 0.28,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  },

  // Timing: causa → efeito. Sem “acrobacia”.
  motion: {
    press: 90,
    fast: 140,
    normal: 220,
    slow: 280,
  },
} as const;