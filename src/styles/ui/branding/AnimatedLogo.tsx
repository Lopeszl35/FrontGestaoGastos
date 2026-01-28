import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Image, StyleSheet } from "react-native";

import { useTheme } from "../../../shared/theme/ThemeProvider";
import type { AppTheme } from "../../../shared/theme/themes";

/**
 * Logo animado apenas na entrada (sem loop).
 * "Calmo, elegante, quase silencioso": nada de pulso infinito.
 */
export default function AnimatedLogo() {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-3deg", "0deg"],
  });

  return (
    <Animated.View
      style={[
        styles.logoBubble,
        {
          opacity: fadeIn,
          transform: [{ scale }, { rotate: rotation }],
        },
      ]}
    >
      <Image source={require("../../../../assets/app-icon.png")} style={styles.logo} />
    </Animated.View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    logoBubble: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    logo: {
      width: 42,
      height: 42,
      resizeMode: "contain",
    },
  });
