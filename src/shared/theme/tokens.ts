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
    lg: 24, // Aumentei um pouco para ficar mais arredondado/moderno (Apple Style)
    xl: 32,
  },

  glow: {
    // Ajustado para o novo Verde Neon do Dark Mode
    primary: "rgba(34, 197, 94, 0.5)", 
    secondary: "rgba(22, 163, 74, 0.3)",
    soft: "rgba(255, 255, 255, 0.05)",
    danger: "rgba(239, 68, 68, 0.4)",
    cyan: "rgba(6, 182, 212, 0.5)", // Útil para elementos de IA/Futuristas
  },

  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.15, // Mais suave = mais sofisticado
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
    cardActive: {
      shadowColor: "#22C55E", // Glow verde ao selecionar
      shadowOpacity: 0.25,
      shadowRadius: 30,
      shadowOffset: { width: 0, height: 0 }, // Centralizado
      elevation: 10,
    },
    inputFocus: {
      shadowColor: "#22C55E",
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
  },

  motion: {
    fast: 150,   // Um pouco mais lento que 90ms para parecer "fluido" e não "nervoso"
    normal: 300,
    slow: 450,
  },
} as const;