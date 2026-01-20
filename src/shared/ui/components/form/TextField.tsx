import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { Animated, Text, TextInput, TextInputProps, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { colors } from "../../../theme";
import { styles } from "../../../../styles/ui/form/textFieldStyles";
import { useShake } from "../../../../animations/useShake";

type Props = TextInputProps & {
  label: string;
  error?: string | null;
  leftIconName?: keyof typeof MaterialIcons.glyphMap;
};

const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, error, leftIconName, ...props },
  ref
) {
  const [focused, setFocused] = useState(false);
  const { shakeX, shake } = useShake();

  useEffect(() => {
    if (error) shake();
  }, [error]);

  const wrapStyle = useMemo(() => {
    if (error) return [styles.inputWrap, styles.inputWrapError];
    if (focused) return [styles.inputWrap, styles.inputWrapFocused];
    return [styles.inputWrap, styles.inputWrapDefault];
  }, [focused, error]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Animated.View style={[styles.animatedWrap, { transform: [{ translateX: shakeX }] }]}>
        <View style={wrapStyle}>
          {leftIconName ? <MaterialIcons name={leftIconName} size={20} style={styles.leftIcon} /> : null}

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
            />
        </View>
      </Animated.View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

export default TextField;
