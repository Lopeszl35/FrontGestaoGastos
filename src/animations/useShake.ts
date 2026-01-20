import { useRef } from "react";
import { Animated } from "react-native";

export function useShake() {
  const x = useRef(new Animated.Value(0)).current;

  function shake() {
    x.setValue(0);
    Animated.sequence([
      Animated.timing(x, { toValue: 8, duration: 45, useNativeDriver: true }),
      Animated.timing(x, { toValue: -8, duration: 45, useNativeDriver: true }),
      Animated.timing(x, { toValue: 6, duration: 45, useNativeDriver: true }),
      Animated.timing(x, { toValue: -6, duration: 45, useNativeDriver: true }),
      Animated.timing(x, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  }

  return { shakeX: x, shake };
}
