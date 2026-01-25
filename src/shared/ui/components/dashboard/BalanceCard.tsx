import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { spacing, typography } from '../../../theme/tokens';

type Props = {
  saldo: number;
  balanco: number;
  onPress?: () => void;
};

export default function BalanceCard({ saldo, balanco, onPress }: Props) {
  const { theme } = useTheme();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 10,
        bounciness: 8,
      }),
    ]).start();
  }, []);

  const isPositive = balanco >= 0;
  const balanceColor = isPositive ? theme.colors.success : theme.colors.danger;

  return (
    <Animated.View style={{ opacity: fadeIn, transform: [{ scale }] }}>
      <Pressable onPress={onPress} style={styles.container}>
        <LinearGradient
          colors={theme.colors.gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Text style={[styles.label, { color: 'rgba(255,255,255,0.80)' }]}>
              Saldo Disponível
            </Text>
            <MaterialIcons name="visibility" size={20} color="rgba(255,255,255,0.60)" />
          </View>

          <Text style={styles.balance}>
            R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>

          <View style={styles.footer}>
            <MaterialIcons 
              name={isPositive ? 'trending-up' : 'trending-down'} 
              size={18} 
              color={balanceColor} 
            />
            <Text style={[styles.balanceChange, { color: balanceColor }]}>
              {isPositive ? '+' : ''}R$ {Math.abs(balanco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={[styles.balanceLabel, { color: 'rgba(255,255,255,0.60)' }]}>
              este mês
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  gradient: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  balance: {
    fontSize: 36,
    fontWeight: typography.weight.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  balanceChange: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  balanceLabel: {
    fontSize: typography.size.sm,
  },
});