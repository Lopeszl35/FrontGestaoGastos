import React, { useMemo } from "react";
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
  // Fintech premium: nada de pulso infinito (cansa e parece “app gamer”).
  // Mantemos um glow discreto e estático.
  const glowOpacity = isDisabled ? 0 : 0.18;

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
