import React, { useMemo } from "react";
import { View, type ViewProps } from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import { makeGlowCardStyles } from "../../../../styles/ui/layout/glowCardStyles";

export default function GlowCard({ style, children, ...props }: ViewProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeGlowCardStyles(theme), [theme]);

  return (
    <View style={[styles.card, style]} {...props}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}
