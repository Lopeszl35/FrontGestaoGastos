import React, { useMemo } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import type { AppTheme } from "../../../theme/themes";
import { spacing, tokens } from "../../../theme";
import { useTheme } from "../../../theme/ThemeProvider";

type Props = ViewProps & {
  children?: React.ReactNode;
};

export default function Card({ children, style, ...rest }: Props) {
  const { theme } = useTheme();

  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View {...rest} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: tokens.radii.md,
      padding: spacing.md,
    },
  });
