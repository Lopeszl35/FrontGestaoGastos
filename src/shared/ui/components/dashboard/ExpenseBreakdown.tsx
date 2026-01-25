import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { spacing, typography, tokens } from '../../../theme/tokens';

type Props = {
  fixas: number;
  variaveis: number;
  cartaoCredito: number;
  total: number;
};

export default function ExpenseBreakdown({ fixas, variaveis, cartaoCredito, total }: Props) {
  const { theme } = useTheme();

  const items = [
    { label: 'Despesas Fixas', value: fixas, icon: 'home' as const, color: theme.colors.info },
    { label: 'Despesas Variáveis', value: variaveis, icon: 'shopping-cart' as const, color: theme.colors.success },
    { label: 'Cartão de Crédito', value: cartaoCredito, icon: 'credit-card' as const, color: theme.colors.warning },
  ];

  const calculatePercentage = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Detalhamento de Despesas</Text>

      {items.map((item, index) => {
        const percentage = calculatePercentage(item.value);
        
        return (
          <View key={index} style={styles.item}>
            <View style={styles.itemHeader}>
              <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                  <MaterialIcons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={[styles.itemLabel, { color: theme.colors.text }]}>{item.label}</Text>
              </View>
              <Text style={[styles.itemValue, { color: theme.colors.text }]}>
                R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }
                ]} 
              />
            </View>
            <Text style={[styles.percentage, { color: theme.colors.textMuted }]}>
              {percentage.toFixed(1)}% do total
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderRadius: tokens.radii.xl,
    borderWidth: 1,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  item: {
    gap: spacing.xs,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  itemValue: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  percentage: {
    fontSize: typography.size.xs,
  },
});
