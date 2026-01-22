import React, { useMemo, useRef } from "react";
import { ActivityIndicator, Animated, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../theme/ThemeProvider";
import { makeAppButtonStyles } from "../../../../styles/ui/buttons/appButtonStyles";
import { useButtonPress } from "../../../../animations/useButtonPress";

type Variant = "primary" | "outline" | "danger";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
};

export default function AppButton({ title, onPress, loading, disabled, variant = "primary" }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeAppButtonStyles(theme), [theme]);
  
  const isDisabled = !!disabled || !!loading;
  const { scale, opacity, pressIn, pressOut } = useButtonPress();
  const glowPulse = useRef(new Animated.Value(0)).current;

  // Pulso contínuo no glow quando não está desabilitado
  React.useEffect(() => {
    if (!isDisabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowPulse, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowPulse, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isDisabled]);

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.28],
  });

  const variantWrap = useMemo(() => {
    if (variant === "danger") return styles.wrapDanger;
    if (variant === "outline") return styles.wrapOutline;
    return styles.wrapPrimary;
  }, [variant, styles]);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={styles.pressable}
    >
      <Animated.View
        style={[
          styles.glow,
          !isDisabled ? styles.glowOn : null,
          { opacity: isDisabled ? 0 : glowOpacity },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.base,
          variantWrap,
          isDisabled ? styles.disabled : null,
          { transform: [{ scale }], opacity },
        ]}
      >
        {variant === "primary" ? (
          <LinearGradient colors={theme.colors.gradients.button} style={styles.gradient}>
            {loading ? <ActivityIndicator color={theme.colors.text} /> : null}
            <Text style={styles.text}>{title}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.flat}>
            {loading ? <ActivityIndicator color={theme.colors.text} /> : null}
            <Text style={styles.text}>{title}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}
