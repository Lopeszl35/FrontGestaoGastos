import { StyleSheet } from "react-native";
import { colors, spacing, typography, tokens } from "../../../shared/theme";

export const styles = StyleSheet.create({
  pressable: { borderRadius: tokens.radii.md },

  glow: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 8,
    bottom: 8,
    borderRadius: tokens.radii.md,
    backgroundColor: "transparent",
  },
  glowOn: { backgroundColor: tokens.glow.cyan, opacity: 0.18 },

  base: { borderRadius: tokens.radii.md, overflow: "hidden" },

  wrapPrimary: {},
  wrapOutline: {
    borderWidth: 1,
    borderColor: "rgba(3, 56, 7, 0.55)",
    backgroundColor: "rgba(12, 8, 8, 0.03)",
  },
  wrapDanger: {
    borderWidth: 1,
    borderColor: "rgba(255,92,124,0.55)",
    backgroundColor: "rgba(255,92,124,0.08)",
  },

  gradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  flat: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },

  text: { color: colors.text, fontSize: typography.size.md, fontWeight: typography.weight.bold },

  disabled: { opacity: 0.55 },
});
