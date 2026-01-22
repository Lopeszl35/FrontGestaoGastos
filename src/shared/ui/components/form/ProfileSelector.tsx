import React, { useRef, useEffect } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { FinancialProfile } from "../../../../types/auth";
import { spacing, typography, tokens } from "../../../theme";

type ProfileOption = {
  value: FinancialProfile;
  label: string;
  icon: string;
  color: string;
  description: string;
};

const PROFILES: ProfileOption[] = [
  {
    value: "CONSERVADOR",
    label: "Conservador",
    icon: "shield",
    color: "#4A90E2",
    description: "Foco em segurança e estabilidade",
  },
  {
    value: "MODERADO",
    label: "Moderado",
    icon: "balance",
    color: "#7B68EE",
    description: "Equilíbrio entre risco e retorno",
  },
  {
    value: "AGRESSIVO",
    label: "Agressivo",
    icon: "trending-up",
    color: "#FF6B6B",
    description: "Maior potencial de crescimento",
  },
];

type Props = {
  value: FinancialProfile;
  onChange: (value: FinancialProfile) => void;
};

export default function ProfileSelector({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {PROFILES.map((profile) => (
        <ProfileCard
          key={profile.value}
          profile={profile}
          selected={value === profile.value}
          onPress={() => onChange(profile.value)}
        />
      ))}
    </View>
  );
}

function ProfileCard({
  profile,
  selected,
  onPress,
}: {
  profile: ProfileOption;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const borderOpacity = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(borderOpacity, {
      toValue: selected ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selected]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  const borderColor = borderOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(234, 247, 239, 0.1)", profile.color],
  });

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale }],
            borderColor,
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${profile.color}20` }]}>
          <MaterialIcons name={profile.icon as any} size={28} color={profile.color} />
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>{profile.label}</Text>
          <Text style={styles.description}>{profile.description}</Text>
        </View>

        {selected && (
          <Animated.View style={styles.checkContainer}>
            <MaterialIcons name="check-circle" size={24} color={profile.color} />
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(234, 247, 239, 0.03)",
    borderWidth: 2,
    borderRadius: tokens.radii.md,
    padding: spacing.md,
    gap: spacing.md,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    gap: 4,
  },

  label: {
    color: "rgba(255, 255, 255, 0.92)",
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },

  description: {
    color: "rgba(255, 255, 255, 0.60)",
    fontSize: typography.size.xs,
    lineHeight: 16,
  },

  checkContainer: {
    width: 28,
    height: 28,
  },
});
