export const colors = {
  // Backgrounds - Preto profundo suave (não verde)
  background: "#0A0A0F",      // Quase preto, tom azulado
  surface: "#13131A",          // Card background - cinza escuro limpo
  surface2: "#1A1A24",         // Surface elevado
  border: "rgba(255, 255, 255, 0.08)",

  // Textos - Branco ultra clean com contraste AAA
  text: "#FFFFFF",
  textMuted: "rgba(255, 255, 255, 0.60)",
  textSubtle: "rgba(255, 255, 255, 0.40)",

  // Primary - Violet vibrante mas elegante
  primaryA: "#7C3AED",         // Violet 600
  primaryB: "#A78BFA",         // Violet 400  
  primaryC: "#6366F1",         // Indigo 500
  
  // Accent - Cyan elétrico para CTAs
  accentA: "#06B6D4",          // Cyan 500
  accentB: "#22D3EE",          // Cyan 400
  
  // Status colors - Vibrantes mas legíveis
  danger: "#EF4444",           // Red 500
  success: "#10B981",          // Emerald 500
  warning: "#F59E0B",          // Amber 500
  info: "#3B82F6",             // Blue 500

  // Input states com ALTO contraste
  inputBg: "rgba(255, 255, 255, 0.03)",
  inputBorder: "rgba(255, 255, 255, 0.12)",
  inputBorderFocus: "rgba(124, 58, 237, 0.80)",
  inputBorderError: "rgba(239, 68, 68, 0.80)",

  gradients: {
    // Background - Deep space clean
    background: ["#0A0A0F", "#13131A", "#0A0A0F"] as const,
    
    // Primary button - Violet profissional
    primary: ["#7C3AED", "#6366F1"] as const,
    
    // Accent button - Cyan energético
    accent: ["#06B6D4", "#0891B2"] as const,
    
    // Card subtle glow
    cardGlow: ["rgba(124, 58, 237, 0.08)", "rgba(99, 102, 241, 0.04)"] as const,
  },
};
