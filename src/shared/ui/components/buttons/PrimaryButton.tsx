import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../theme/colors";
import { styles } from "../../../../styles/ui/buttons/primaryButtonStyles";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function PrimaryButton({ title, onPress, disabled, loading }: Props) {
  const isDisabled = !!disabled || !!loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.pressable,
        isDisabled ? styles.disabled : null,
        pressed && !isDisabled ? styles.pressed : null,
      ]}
    >
      <LinearGradient colors={colors.gradients.primary} style={styles.gradient}>
        {loading ? (
          <>
            <ActivityIndicator />
            <Text style={styles.text}>{title}</Text>
          </>
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}
