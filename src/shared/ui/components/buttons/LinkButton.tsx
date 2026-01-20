import React from "react";
import { Pressable, Text } from "react-native";
import { styles } from "../../../../styles/ui/buttons/linkButtonStyles";

type Props = {
  title: string;
  onPress: () => void;
  align?: "left" | "center" | "right";
};

export default function LinkButton({ title, onPress, align = "center" }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <Text style={[styles.text, { textAlign: align }]}>{title}</Text>
    </Pressable>
  );
}
