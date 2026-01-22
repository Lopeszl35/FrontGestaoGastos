import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { spacing, typography } from "../../../theme";

type Props = {
  progress: number;
  showPercentage?: boolean;
};

export default function FormProgressBar({ progress, showPercentage = true }: Props) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start();

    // Pulso quando completo
    if (progress === 100) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [progress]);

  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <Animated.View style={[styles.barFill, { width }]}>
          <LinearGradient
            colors={["#42E68A", "#19A05F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
          {progress === 100 && (
            <Animated.View style={[styles.glow, { opacity: pulseOpacity }]} />
          )}
        </Animated.View>
      </View>

      {showPercentage && (
        <Text style={styles.percentage}>
          {Math.round(progress)}% {progress === 100 ? "✓" : ""}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },

  barContainer: {
    height: 8,
    backgroundColor: "rgba(234, 247, 239, 0.08)",
    borderRadius: 4,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    position: "relative",
  },

  gradient: {
    flex: 1,
    borderRadius: 4,
  },

  glow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(66, 230, 138, 0.4)",
    borderRadius: 4,
  },

  percentage: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    textAlign: "right",
  },
});
