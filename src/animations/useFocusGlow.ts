import { useRef } from "react";
import { Animated } from "react-native";

export function useFocusGlow() {
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.95)).current;

  function onFocus() {
    Animated.parallel([
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(glowScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }),
    ]).start();
  }

  function onBlur() {
    Animated.parallel([
      Animated.timing(glowOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowScale, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }

  return { glowOpacity, glowScale, onFocus, onBlur };
}
