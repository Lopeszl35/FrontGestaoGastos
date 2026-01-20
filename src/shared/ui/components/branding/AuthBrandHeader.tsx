import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";
import { useTheme } from "../../../theme";
import { makeAuthBrandHeaderStyles } from "../../../../styles/ui/branding/authBrandHeaderStyles";

type Props = {
  title: string;
  subtitle: string;
};

export default function AuthBrandHeader({ title, subtitle }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeAuthBrandHeaderStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBubble}>
        <Image source={require("../../../../../assets/app-icon.png")} style={styles.logo} />
      </View>

      <Text style={styles.brand}>Konta <Text style={styles.brandBy}>by Nexor</Text></Text>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}
