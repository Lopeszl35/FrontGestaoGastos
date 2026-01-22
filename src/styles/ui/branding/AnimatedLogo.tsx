import React, { useEffect, useRef } from "react";
import { Animated, Image, View, StyleSheet } from "react-native";

export default function AnimatedLogo() {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 8,
        bounciness: 12,
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Sutil pulso contínuo
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '0deg'],
  });

  return (
    <Animated.View
      style={[
        styles.logoBubble,
        {
          opacity: fadeIn,
          transform: [{ scale }, { rotate: rotation }],
        },
      ]}
    >
      <Image source={require("../../../../assets/app-icon.png")} style={styles.logo} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logoBubble: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(11, 30, 20, 1)',
    borderWidth: 1,
    borderColor: 'rgba(234, 247, 239, 0.10)',
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: 'rgba(66, 230, 138, 0.5)',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  logo: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },
});