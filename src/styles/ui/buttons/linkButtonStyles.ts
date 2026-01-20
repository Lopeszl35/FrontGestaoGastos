import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../../shared/theme";

export const styles = StyleSheet.create({
  wrap: { paddingVertical: spacing.sm },
  text: {
    color: colors.primaryB,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
