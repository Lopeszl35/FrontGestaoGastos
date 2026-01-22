import { StyleSheet } from "react-native";
import { spacing, typography } from "../../../shared/theme";
import { AppTheme } from "../../../shared/theme";

export function makeLinkButtonStyles(theme: AppTheme) {
  const { colors } = theme;
  
  return StyleSheet.create({
    wrap: {
      paddingVertical: spacing.sm,
      alignItems: "center",
    },
    text: {
      color: colors.primary,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },
    underline: {
      height: 1.5,
      backgroundColor: colors.primary,
      marginTop: 2,
      borderRadius: 1,
    },
  });
}