import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../../shared/theme";

export const styles = StyleSheet.create({
  kav: { flex: 1 },
  container: { flex: 1, padding: spacing.xl },
  header: { paddingTop: spacing.xxl, paddingBottom: spacing.lg },
  logoBubble: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { color: colors.text, fontSize: typography.size.xxl, fontWeight: typography.weight.bold },
  subtitle: { color: colors.textMuted, fontSize: typography.size.md, marginTop: spacing.xs, lineHeight: 22 },

  label: { color: colors.textMuted, fontSize: typography.size.sm, marginBottom: spacing.xs, marginTop: spacing.xs },
  pickerWrap: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBg,
    overflow: "hidden",
  },
  picker: { color: colors.text },
  helper: { color: "rgba(255,255,255,0.45)", fontSize: typography.size.xs, marginTop: spacing.xs, marginBottom: spacing.md },

  formError: { color: colors.danger, marginTop: spacing.sm, fontSize: typography.size.sm },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingBottom: 64,
},

});
