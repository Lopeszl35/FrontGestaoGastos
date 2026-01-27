// src/shared/ui/components/creditCards/MonthYearSelector.tsx

import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme/ThemeProvider';
import { makeMonthYearSelectorStyles } from '../../../../styles/ui/creditCards/monthYearSelectorStyles';

type Props = {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number, year: number) => void;
};

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function MonthYearSelector({ selectedMonth, selectedYear, onMonthChange }: Props) {
  const { theme } = useTheme();
  const styles = makeMonthYearSelectorStyles(theme);

  const scaleLeft = useRef(new Animated.Value(1)).current;
  const scaleRight = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePrevious = () => {
    Animated.sequence([
      Animated.spring(scaleLeft, { toValue: 0.9, useNativeDriver: true, speed: 50 }),
      Animated.spring(scaleLeft, { toValue: 1, useNativeDriver: true, speed: 40 }),
    ]).start();

    if (selectedMonth === 1) {
      onMonthChange(12, selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1, selectedYear);
    }
  };

  const handleNext = () => {
    Animated.sequence([
      Animated.spring(scaleRight, { toValue: 0.9, useNativeDriver: true, speed: 50 }),
      Animated.spring(scaleRight, { toValue: 1, useNativeDriver: true, speed: 40 }),
    ]).start();

    if (selectedMonth === 12) {
      onMonthChange(1, selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1, selectedYear);
    }
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.surface2]}
        style={styles.gradient}
      >
        {/* Botão Anterior */}
        <Animated.View style={{ transform: [{ scale: scaleLeft }] }}>
          <Pressable onPress={handlePrevious} style={styles.arrowButton}>
            <LinearGradient
              colors={[theme.colors.primary + '30', theme.colors.primary + '20']}
              style={styles.arrowGradient}
            >
              <MaterialIcons name="chevron-left" size={24} color={theme.colors.primary} />
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Mês e Ano */}
        <View style={styles.centerContent}>
          <Text style={[styles.monthText, { color: theme.colors.text }]}>
            {MESES[selectedMonth - 1]}
          </Text>
          <Text style={[styles.yearText, { color: theme.colors.textMuted }]}>
            {selectedYear}
          </Text>
          
          {isCurrentMonth() && (
            <View style={[styles.currentBadge, { backgroundColor: theme.colors.success + '20' }]}>
              <Text style={[styles.currentBadgeText, { color: theme.colors.success }]}>
                Atual
              </Text>
            </View>
          )}
        </View>

        {/* Botão Próximo */}
        <Animated.View style={{ transform: [{ scale: scaleRight }] }}>
          <Pressable onPress={handleNext} style={styles.arrowButton}>
            <LinearGradient
              colors={[theme.colors.primary + '30', theme.colors.primary + '20']}
              style={styles.arrowGradient}
            >
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}