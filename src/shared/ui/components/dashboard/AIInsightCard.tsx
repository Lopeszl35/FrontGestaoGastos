import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme/ThemeProvider';
import { spacing, typography, tokens } from '../../../theme/tokens';

type Props = {
  title: string;
  message: string;
  type: 'warning' | 'success' | 'info';
};

export default function AIInsightCard({ title, message, type }: Props) {
  const { theme } = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getColors = () => {
    switch (type) {
      case 'warning':
        return [theme.colors.warning, '#D97706'];
      case 'success':
        return [theme.colors.success, '#059669'];
      default:
        return [theme.colors.accent, theme.colors.accent2];
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'success':
        return 'check-circle';
      default:
        return 'lightbulb';
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <LinearGradient
        colors={['rgba(124, 58, 237, 0.10)', 'rgba(6, 182, 212, 0.10)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { borderColor: 'rgba(124, 58, 237, 0.30)' }]}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${getColors()[0]}20` }]}>
            <MaterialIcons name={getIcon()} size={20} color={getColors()[0]} />
          </View>
          <View style={styles.badge}>
            <MaterialIcons name="auto-awesome" size={12} color={theme.colors.primary} />
            <Text style={[styles.badgeText, { color: theme.colors.primary }]}>IA</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: theme.colors.textMuted }]}>{message}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  message: {
    fontSize: typography.size.sm,
    lineHeight: 20,
  },
});