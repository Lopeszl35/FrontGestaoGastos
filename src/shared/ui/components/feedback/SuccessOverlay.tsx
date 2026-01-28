import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { useSuccessAnimation } from "../../../../animations/useSuccessAnimation";
import { spacing, typography } from "../../../theme";
import type { AppTheme } from "../../../theme/themes";
import { useTheme } from "../../../theme/ThemeProvider";

type Props = {
  visible: boolean;
  message?: string;
  onComplete?: () => void;
};

export default function SuccessOverlay({
  visible,
  message = "Sucesso!",
  onComplete,
}: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { scale, opacity, rotate, trigger } = useSuccessAnimation();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    Animated.timing(fade, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();

    trigger();

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => onComplete?.());
    }, 1400);

    return () => clearTimeout(timer);
  }, [fade, onComplete, trigger, visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fade }]}>
      <BlurView intensity={18} style={StyleSheet.absoluteFill} />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale }, { rotate }], opacity },
          ]}
        >
          <MaterialIcons
            name="check-circle"
            size={74}
            color={theme.colors.success}
          />
        </Animated.View>

        <Animated.Text style={[styles.message, { opacity }]}>
          {message}
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 9999,
      alignItems: "center",
      justifyContent: "center",
    },

    content: {
      alignItems: "center",
      gap: spacing.lg,
    },

    iconContainer: {
      width: 120,
      height: 120,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(16, 185, 129, 0.10)",
      borderRadius: 60,
      borderWidth: 1,
      borderColor: "rgba(16, 185, 129, 0.35)",
    },

    message: {
      color: theme.colors.text,
      fontSize: typography.size.lg,
      fontWeight: typography.weight.semibold,
      textAlign: "center",
      maxWidth: 260,
    },
  });
