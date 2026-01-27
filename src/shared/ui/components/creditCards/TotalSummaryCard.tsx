// src/shared/ui/components/creditCards/TotalSummaryCard.tsx

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { makeTotalSummaryCardStyles } from '../../../../styles/ui/creditCards/totalSummaryCardStyles';

type Props = {
  limiteTotal: number;
  limiteUsado: number;
  gastosDoMes: number;
  mesAno: string; // Ex: "Janeiro 2026"
};

export default function TotalSummaryCard({ limiteTotal, limiteUsado, gastosDoMes, mesAno }: Props) {
  const { theme } = useTheme();
  const styles = makeTotalSummaryCardStyles(theme);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideDown = useRef(new Animated.Value(-30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideDown, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 8,
      }),
    ]).start();

    // Animação de pulso sutil no valor gasto
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const limiteDisponivel = limiteTotal - limiteUsado;
  const percentualUsado = limiteTotal > 0 ? (limiteUsado / limiteTotal) * 100 : 0;

  const getColorByPercentage = () => {
    if (percentualUsado >= 90) return theme.colors.danger;
    if (percentualUsado >= 70) return theme.colors.warning;
    return theme.colors.success;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeIn,
          transform: [{ translateY: slideDown }],
        },
      ]}
    >
      <LinearGradient
        colors={theme.colors.gradients.card}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <MaterialIcons name="account-balance-wallet" size={20} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                Resumo Total
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>
                {mesAno}
              </Text>
            </View>
          </View>

          <View style={[styles.badge, { backgroundColor: getColorByPercentage() + '20' }]}>
            <Text style={[styles.badgeText, { color: getColorByPercentage() }]}>
              {percentualUsado.toFixed(0)}%
            </Text>
          </View>
        </View>

        {/* Valores Principais */}
        <View style={styles.mainValues}>
          <View style={styles.valueRow}>
            <Text style={[styles.valueLabel, { color: theme.colors.textMuted }]}>
              Limite Total
            </Text>
            <Text style={[styles.valueAmount, { color: theme.colors.text }]}>
              R$ {formatCurrency(limiteTotal)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.valueRow}>
            <Text style={[styles.valueLabel, { color: theme.colors.textMuted }]}>
              Disponível
            </Text>
            <Text style={[styles.valueAmount, { color: theme.colors.success }]}>
              R$ {formatCurrency(limiteDisponivel)}
            </Text>
          </View>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(percentualUsado, 100)}%`,
                  backgroundColor: getColorByPercentage(),
                },
              ]}
            />
          </View>
        </View>

        {/* Gastos do Mês */}
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <MaterialIcons name="trending-up" size={18} color={theme.colors.textMuted} />
            <Text style={[styles.footerLabel, { color: theme.colors.textMuted }]}>
              Gasto no mês
            </Text>
          </View>
          <Animated.Text
            style={[
              styles.footerValue,
              { 
                color: theme.colors.primary,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            R$ {formatCurrency(gastosDoMes)}
          </Animated.Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}