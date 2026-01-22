// ============================================
// LinkButton.tsx - VERSÃO ATUALIZADA
// src/shared/ui/components/buttons/LinkButton.tsx
// ============================================
import React, { useRef, useMemo } from "react";
import { Animated, Pressable, Text } from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import { makeLinkButtonStyles } from "../../../../styles/ui/buttons/linkButtonStyles";

type Props = {
  title: string;
  onPress: () => void;
  align?: "left" | "center" | "right";
};

export default function LinkButton({ title, onPress, align = "center" }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeLinkButtonStyles(theme), [theme]);
  
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.parallel([
      Animated.timing(underlineWidth, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1.02,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start();
  };

  const pressOut = () => {
    Animated.parallel([
      Animated.timing(underlineWidth, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={styles.wrap}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text style={[styles.text, { textAlign: align }]}>{title}</Text>
        <Animated.View
          style={[
            styles.underline,
            {
              transform: [{ scaleX: underlineWidth }],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}