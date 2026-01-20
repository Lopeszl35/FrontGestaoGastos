// src/shared/theme/themes.ts
import type { ColorValue } from "react-native";
import { tokens } from "./tokens";

export type ThemeName = "light" | "dark";

export type AppTheme = {
  name: ThemeName;
  colors: {
    bg: string;
    surface: string;
    surface2: string; // Para elementos secundários ou headers
    text: string;
    textMuted: string;
    border: string;

    primary: string;     
    primary2: string; // Gradiente ou hover
    danger: string;
    success: string;  // Adicionado para feedbacks positivos (ex: renda)

    gradients: {
      background: readonly [string, string];
      button: readonly [string, string];
      card: readonly [string, string]; // Adicionado para cartões premium
    };
  };
  tokens: typeof tokens;
};

export const darkTheme: AppTheme = {
  name: "dark",
  colors: {
    // Fundo profundo "Deep Void" para destacar o Neon
    bg: "#020617", 
    // Superfícies em camadas sutis de azul-petróleo escuro
    surface: "#0F172A",
    surface2: "#1E293B",  
    
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    border: "rgba(148, 163, 184, 0.10)", // Borda sutil

    // O "Verde AI" - Vibrante e Tecnológico
    primary: "#22C55E", 
    primary2: "#16A34A",
    
    danger: "#EF4444",
    success: "#22C55E",

    gradients: {
      // Um gradiente sutil que simula uma luz de topo (efeito spot)
      background: ["#020617", "#0B1120"], 
      // Botão com brilho interno
      button: ["#22C55E", "#16A34A"],
      card: ["#0F172A", "#1E293B"]
    },
  },
  tokens,
};

export const lightTheme: AppTheme = {
  name: "light",
  colors: {
    bg: "#F1F5F9",        
    surface: "#000505", 
    surface2: "#E2E8F0",
    
    text: "#0F172A",
    textMuted: "#64748B",
    border: "#E2E8F0",

    primary: "#166534",
    primary2: "#15803D",
    
    danger: "#DC2626",
    success: "#16A34A",

    gradients: {
      background: ["#F1F5F9", "#E2E8F0"],
      button: ["#166534", "#15803D"],
      card: ["#FFFFFF", "#F8FAFC"]
    },
  },
  tokens,
};