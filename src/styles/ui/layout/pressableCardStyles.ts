import { StyleSheet } from "react-native";
import { colors, spacing, tokens } from "../../../shared/theme";

export const styles = StyleSheet.create({
  glowBase: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    borderRadius: tokens.radii.xl,
    backgroundColor: "transparent",
  },
  glowOn: {
    backgroundColor: tokens.glow.primary,
    opacity: 0.22,
  },

  cardBase: {
    borderRadius: tokens.radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
  },

  variantGlass: {
    backgroundColor: "rgba(11,18,32,0.85)",
    borderColor: "rgba(255,255,255,0.08)",
  },
  variantElevated: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    ...tokens.shadow.card,
  },
  variantOutline: {
    backgroundColor: "transparent",
    borderColor: "rgba(109,94,246,0.35)",
  },

  stateDefault: {},
  stateActive: {
    borderColor: "rgba(34,193,195,0.55)",
    ...tokens.shadow.cardActive,
  },
  stateSelected: {
    borderColor: "rgba(109,94,246,0.75)",
    ...tokens.shadow.cardActive,
  },
});
