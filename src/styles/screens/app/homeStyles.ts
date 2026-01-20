import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../../shared/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, justifyContent: "center" },
  title: { color: colors.text, fontSize: typography.size.xl, fontWeight: typography.weight.bold, marginBottom: spacing.sm },
  subtitle: { color: colors.textMuted, fontSize: typography.size.md, lineHeight: 22 },
  spacer: { height: spacing.lg },
});
