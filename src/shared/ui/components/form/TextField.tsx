import React, { forwardRef, useEffect, useMemo, useState, useRef } from "react";
import { Animated, Text, TextInput, TextInputProps, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { colors } from "../../../theme";
import { makeTextFieldStyles } from "../../../../styles/ui/form/textFieldStyles";
import { useShake } from "../../../../animations/useShake";
import { useFocusGlow } from "../../../../animations/useFocusGlow";
import { useTheme } from "../../../theme/ThemeProvider";

type Props = TextInputProps & {
  label: string;
  error?: string | null;
  leftIconName?: keyof typeof MaterialIcons.glyphMap;
};

const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, error, leftIconName, ...props },
  ref
) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeTextFieldStyles(theme), [theme]);
  
  const [focused, setFocused] = useState(false);
  const { shakeX, shake } = useShake();
  const { glowOpacity, glowScale, onFocus: glowFocus, onBlur: glowBlur } = useFocusGlow();

  // Animação do ícone
  const iconScale = useRef(new Animated.Value(1)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) shake();
  }, [error]);

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.15,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 30,
          bounciness: 10,
        }),
      ]).start();

      Animated.timing(iconRotate, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(iconRotate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  const iconRotation = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const wrapStyle = useMemo(() => {
    if (error) return [styles.inputWrap, styles.inputWrapError];
    if (focused) return [styles.inputWrap, styles.inputWrapFocused];
    return [styles.inputWrap, styles.inputWrapDefault];
  }, [focused, error, styles]);

  const handleFocus = () => {
    setFocused(true);
    glowFocus();
  };

  const handleBlur = () => {
    setFocused(false);
    glowBlur();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Animated.View style={[styles.animatedWrap, { transform: [{ translateX: shakeX }] }]}>
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
          pointerEvents="none"
        />

        <View style={wrapStyle}>
          {leftIconName ? (
            <Animated.View
              style={{
                transform: [{ scale: iconScale }, { rotate: iconRotation }],
              }}
            >
              <MaterialIcons
                name={leftIconName}
                size={20}
                style={styles.leftIcon}
                color={focused ? colors.primaryB : colors.textMuted}
              />
            </Animated.View>
          ) : null}

          <TextInput
            ref={ref}
            {...props}
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholderTextColor={styles.placeholder.color as string}
            selectionColor={colors.primaryB}
            cursorColor={colors.primaryB}
            autoCorrect={false}
            importantForAutofill="no"
            autoComplete="off"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>
      </Animated.View>

      {!!error && (
        <Animated.View style={{ opacity: 1 }}>
          <Text style={styles.error}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
});

export default TextField;