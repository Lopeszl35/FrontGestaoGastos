import React, { forwardRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import TextField from "./TextField";
import { colors } from "../../../theme";
import { styles } from "../../../../styles/ui/form/passwordFieldStyles";

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string | null;
  placeholder?: string;
  onSubmitEditing?: () => void;
  returnKeyType?: "next" | "done";
};

const PasswordField = forwardRef<TextInput, Props>(function PasswordField(
  { label, value, onChangeText, error, placeholder, onSubmitEditing, returnKeyType = "done" },
  ref
) {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.container}>
      <TextField
        ref={ref}
        label={label}
        value={value}
        onChangeText={onChangeText}
        error={error}
        placeholder={placeholder}
        secureTextEntry={!show}
        leftIconName="lock"
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />

      <Pressable onPress={() => setShow((s) => !s)} style={styles.eyeButton} hitSlop={10}>
        <MaterialIcons
          name={show ? "visibility-off" : "visibility"}
          size={20}
          color={colors.textMuted}
        />
      </Pressable>
    </View>
  );
});

export default PasswordField;
