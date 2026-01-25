import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { spacing, typography, tokens } from '../../../theme/tokens';

type Props = {
  label: string;
  value: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  trend?: number;
  delay?: number;
};

export default function QuickStatsCard({ label, value, icon, color, trend, delay = 0 }: Props) {
  const { theme } = useTheme();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideUp, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        speed: 10,
        bounciness: 6,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: fadeIn,
          transform: [{ translateY: slideUp }],
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
        
        {trend !== undefined && (
          <View style={styles.trend}>
            <MaterialIcons 
              name={trend >= 0 ? 'arrow-upward' : 'arrow-downward'} 
              size={14} 
              color={trend >= 0 ? theme.colors.success : theme.colors.danger} 
            />
            <Text style={[
              styles.trendText, 
              { color: trend >= 0 ? theme.colors.success : theme.colors.danger }
            ]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  value: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
});
