import React, { useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

import type { AppTheme } from "../../../theme/themes";
import { spacing, tokens } from "../../../theme";
import { useTheme } from "../../../theme/ThemeProvider";

type CardVariant = "glass" | "elevated" | "outline";
type CardState = "default" | "active" | "selected";

type Props = {
  children: React.ReactNode;
  variant?: CardVariant;
  state?: CardState;
  onPress?: () => void;
};

export default function PressableCard({
  children,
  variant = "glass",
  state = "default",
  onPress,
}: Props) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const variantStyle = useMemo(() => {
    if (variant === "elevated") return styles.variantElevated;
    if (variant === "outline") return styles.variantOutline;
    return styles.variantGlass;
  }, [styles, variant]);

  const stateStyle = useMemo(() => {
    if (state === "selected") return styles.stateSelected;
    if (state === "active") return styles.stateActive;
    return styles.stateDefault;
  }, [styles, state]);

  function pressIn() {
    Animated.timing(scale, {
      toValue: 0.992,
      duration: 90,
      useNativeDriver: true,
    }).start();
  }

  function pressOut() {
    Animated.timing(scale, {
      toValue: 1,
      duration: 110,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={!onPress}
    >
      <View
        style={[styles.glowBase, state !== "default" ? styles.glowOn : null]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.cardBase,
          variantStyle,
          stateStyle,
          { transform: [{ scale }] },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    cardBase: {
      borderRadius: tokens.radii.md,
      padding: spacing.md,
      borderWidth: 1,
    },

    // Variants
    variantGlass: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    variantOutline: {
      backgroundColor: "transparent",
      borderColor: theme.colors.border,
    },
    variantElevated: {
      backgroundColor: theme.colors.surface2,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },

    // States
    stateDefault: {
      borderColor: theme.colors.border,
    },
    stateActive: {
      borderColor: theme.colors.primary,
    },
    stateSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surface2,
    },

    // Subtle glow
    glowBase: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: tokens.radii.md,
      opacity: 0,
    },
    glowOn: {
      opacity: 1,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.22,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
  });
