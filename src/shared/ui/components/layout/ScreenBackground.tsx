import React, { useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../theme";
import { makeScreenBackgroundStyles } from "../../../../styles/ui/layout/screenBackgroundStyles";

export default function ScreenBackground({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeScreenBackgroundStyles(theme), [theme]);

  return (
    <LinearGradient colors={theme.colors.gradients.background} style={styles.container}>
      {children}
    </LinearGradient>
  );
}
