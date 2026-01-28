import React, { useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import type { FinancialProfile } from "../../../../types/auth";
import { spacing, typography, tokens, AppTheme } from "../../../theme";
import { useTheme } from "../../../theme/ThemeProvider";

type Option = {
  value: FinancialProfile;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  description: string;
};

const OPTIONS: Option[] = [
  {
    value: "CONSERVADOR",
    label: "Conservador",
    icon: "shield",
    description: "Segurança e previsibilidade.",
  },
  {
    value: "MODERADO",
    label: "Moderado",
    icon: "balance",
    description: "Equilíbrio entre risco e retorno.",
  },
  {
    value: "AGRESSIVO",
    label: "Arrojado",
    icon: "trending-up",
    description: "Mais risco, mais potencial de crescimento.",
  },
];

type Props = {
  value: FinancialProfile;
  onChange: (value: FinancialProfile) => void;
};

export default function ProfileSelector({ value, onChange }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      {OPTIONS.map((opt) => (
        <ProfileCard
          key={opt.value}
          option={opt}
          selected={value === opt.value}
          onPress={() => onChange(opt.value)}
        />
      ))}
    </View>
  );
}

function ProfileCard({
  option,
  selected,
  onPress,
}: {
  option: Option;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.985,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const accent = selected ? theme.colors.primary : theme.colors.border;
  const iconColor = selected ? theme.colors.primary : theme.colors.textMuted;
  const bg = selected ? theme.colors.surface2 : theme.colors.surface;

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.card, { transform: [{ scale }], borderColor: accent, backgroundColor: bg }]}>
        <View style={[styles.iconWrap, { borderColor: accent }]}
        >
          <MaterialIcons name={option.icon} size={22} color={iconColor} />
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>{option.label}</Text>
          <Text style={styles.description}>{option.description}</Text>
        </View>

        {selected ? (
          <MaterialIcons name="check-circle" size={22} color={theme.colors.primary} />
        ) : (
          <View style={{ width: 22, height: 22 }} />
        )}
      </Animated.View>
    </Pressable>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      gap: spacing.sm,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: tokens.radii.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      gap: spacing.md,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      backgroundColor: "rgba(255,255,255,0.02)",
    },
    content: {
      flex: 1,
      gap: 2,
    },
    label: {
      color: theme.colors.text,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },
    description: {
      color: theme.colors.textMuted,
      fontSize: typography.size.xs,
      lineHeight: 16,
    },
  });
