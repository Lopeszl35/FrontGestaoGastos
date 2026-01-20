import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../../shared/theme";

export const styles = StyleSheet.create({
  pressable: { borderRadius: 18, overflow: "hidden" },
  gradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  text: {
    color: colors.text,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  disabled: { opacity: 0.55 },
  pressed: { transform: [{ scale: 0.99 }] },
});
