import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSuccessAnimation } from "../../../../animations/useSuccessAnimation";
import { colors } from "../../../../shared/theme/colors";
import { typography } from "../../../../shared/theme/typography";
import { spacing } from "../../../../shared/theme/spacing";

const { width, height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  message?: string;
  onComplete?: () => void;
};

export default function SuccessOverlay({ visible, message = "Sucesso!", onComplete }: Props) {
  const { scale, opacity, rotate, trigger } = useSuccessAnimation();
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      trigger();

      const timer = setTimeout(() => {
        Animated.timing(fadeIn, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onComplete?.();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeIn }]}>
      <BlurView intensity={20} style={StyleSheet.absoluteFill} />
      
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale }, { rotate }],
              opacity,
            },
          ]}
        >
          <MaterialIcons name="check-circle" size={80} color="#42E68A" />
        </Animated.View>

        <Animated.Text style={[styles.message, { opacity }]}>
          {message}
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    alignItems: "center",
    gap: spacing.xl,
  },

  iconContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(66, 230, 138, 0.15)",
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "rgba(66, 230, 138, 0.4)",
  },

  message: {
    color: "#FFFFFF",
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    textAlign: "center",
  },
  
  formError: {
      color: colors.danger,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
      flex: 1,
    },

    buttonContainer: {
      marginTop: spacing.sm,
    },

    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: spacing.md,
      gap: spacing.md,
    },

    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: "rgba(234, 247, 239, 0.1)",
    },

    dividerText: {
      color: colors.textMuted,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },

    links: {
      gap: spacing.sm,
      alignItems: "center",
    },

    registerPrompt: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    registerText: {
      color: colors.textMuted,
      fontSize: typography.size.sm,
    },

    hint: {
      marginTop: spacing.xl,
      color: colors.textMuted,
      fontSize: typography.size.xs,
      textAlign: "center",
      opacity: 0.7,
    },

    // Partículas decorativas
    particle: {
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: 50,
      opacity: 0.03,
    },

    particle1: {
      backgroundColor: colors.primary,
      top: "10%",
      left: "10%",
    },

    particle2: {
      backgroundColor: colors.primary,
      top: "40%",
      right: "5%",
      width: 80,
      height: 80,
    },

    particle3: {
      backgroundColor: colors.primary,
      bottom: "20%",
      left: "15%",
      width: 60,
      height: 60,
    },

});