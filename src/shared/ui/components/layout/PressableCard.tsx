    import React, { useMemo, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { styles } from "../../../../styles/ui/layout/pressableCardStyles";

type CardVariant = "glass" | "elevated" | "outline";
type CardState = "default" | "active" | "selected";

type Props = {
  children: React.ReactNode;
  variant?: CardVariant;
  state?: CardState;
  onPress?: () => void;
};

export default function PressableCard({ children, variant = "glass", state = "default", onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const variantStyle = useMemo(() => {
    if (variant === "elevated") return styles.variantElevated;
    if (variant === "outline") return styles.variantOutline;
    return styles.variantGlass;
  }, [variant]);

  const stateStyle = useMemo(() => {
    if (state === "selected") return styles.stateSelected;
    if (state === "active") return styles.stateActive;
    return styles.stateDefault;
  }, [state]);

  function pressIn() {
    Animated.timing(scale, { toValue: 0.985, duration: 90, useNativeDriver: true }).start();
  }

  function pressOut() {
    Animated.timing(scale, { toValue: 1, duration: 110, useNativeDriver: true }).start();
  }

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} disabled={!onPress}>
      <View style={[styles.glowBase, state !== "default" ? styles.glowOn : null]} pointerEvents="none" />
      <Animated.View style={[styles.cardBase, variantStyle, stateStyle, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
