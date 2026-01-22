import React, { useMemo, useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useTheme } from "../../../theme";
import { makeAuthBrandHeaderStyles } from "../../../../styles/ui/branding/authBrandHeaderStyles";
import AnimatedLogo from "../../../../styles/ui/branding/AnimatedLogo";

type Props = {
  title: string;
  subtitle: string;
};

export default function AuthBrandHeader({ title, subtitle }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeAuthBrandHeaderStyles(theme), [theme]);
  
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideUp, {
        toValue: 0,
        delay: 200,
        useNativeDriver: true,
        speed: 10,
        bounciness: 8,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedLogo />

      <Animated.View
        style={{
          opacity: fadeIn,
          transform: [{ translateY: slideUp }],
        }}
      >
        <Text style={styles.brand}>
          Konta <Text style={styles.brandBy}>by Nexor</Text>
        </Text>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Animated.View>
    </View>
  );
}