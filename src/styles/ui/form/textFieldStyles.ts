import { StyleSheet } from "react-native";
import { colors, spacing, typography, tokens } from "../../../shared/theme";

export const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },

  label: { color: colors.textMuted, fontSize: typography.size.sm, marginBottom: spacing.xs },

  animatedWrap: {},

  inputWrap: {
    borderWidth: 1,
    borderRadius: tokens.radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 0,          // <- remove padding vertical
    minHeight: 54,               // <- altura padrão Nexor
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
},

  inputWrapDefault: {
    backgroundColor: colors.inputBg,
    borderColor: colors.inputBorder,
  },

  inputWrapFocused: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: colors.inputBorderFocus,
    ...tokens.shadow.inputFocus,
  },

  inputWrapError: {
    backgroundColor: "rgba(255,92,124,0.06)",
    borderColor: colors.inputBorderError,
  },

  leftIcon: { marginRight: spacing.sm, color: colors.textMuted },

 input: {
    flex: 1,
    height: "100%",              // <- ocupa a altura do wrap
    color: colors.text,
    fontSize: typography.size.md,
    backgroundColor: "transparent",
    paddingVertical: 0,          // <- sem padding interno
    paddingHorizontal: 0,
    margin: 0,
    textAlignVertical: "center",
    includeFontPadding: false,
 },

  placeholder: { color: "rgba(255,255,255,0.35)" },

  error: { color: colors.danger, marginTop: spacing.xs, fontSize: typography.size.xs },
});
