import React, { useMemo, useRef } from "react";
import { ActivityIndicator, Animated, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../theme";
import { styles } from "../../../../styles/ui/buttons/appButtonStyles";

type Variant = "primary" | "outline" | "danger";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
};

export default function AppButton({ title, onPress, loading, disabled, variant = "primary" }: Props) {
  const isDisabled = !!disabled || !!loading;
  const scale = useRef(new Animated.Value(1)).current;

  const variantWrap = useMemo(() => {
    if (variant === "danger") return styles.wrapDanger;
    if (variant === "outline") return styles.wrapOutline;
    return styles.wrapPrimary;
  }, [variant]);

  function pressIn() {
    if (isDisabled) return;
    Animated.timing(scale, { toValue: 0.985, duration: 80, useNativeDriver: true }).start();
  }
  function pressOut() {
    Animated.timing(scale, { toValue: 1, duration: 110, useNativeDriver: true }).start();
  }

  return (
    <Pressable onPress={onPress} disabled={isDisabled} onPressIn={pressIn} onPressOut={pressOut} style={styles.pressable}>
      <View style={[styles.glow, !isDisabled ? styles.glowOn : null]} pointerEvents="none" />
      <Animated.View style={[styles.base, variantWrap, isDisabled ? styles.disabled : null, { transform: [{ scale }] }]}>
        {variant === "primary" ? (
          <LinearGradient colors={colors.gradients.primary} style={styles.gradient}>
            {loading ? <ActivityIndicator /> : null}
            <Text style={styles.text}>{title}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.flat}>
            {loading ? <ActivityIndicator /> : null}
            <Text style={styles.text}>{title}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}
