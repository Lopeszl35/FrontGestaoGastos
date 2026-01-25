import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { spacing, typography, tokens } from '../../../theme/tokens';
import type { Transaction } from '../../../../types/dashboard';

type Props = {
  transaction: Transaction;
  onPress?: () => void;
};

export default function TransactionItem({ transaction, onPress }: Props) {
  const { theme } = useTheme();
  const isIncome = transaction.tipo === 'receita';
  const color = isIncome ? theme.colors.success : theme.colors.text;

  const getIcon = () => {
    if (isIncome) return 'arrow-downward';
    if (transaction.metodo === 'CREDITO') return 'credit-card';
    return 'arrow-upward';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialIcons name={getIcon()} size={20} color={color} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
          {transaction.titulo}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.category, { color: theme.colors.textMuted }]}>
            {transaction.categoria}
          </Text>
          <Text style={[styles.date, { color: theme.colors.textSubtle }]}>
            {formatDate(transaction.data)}
          </Text>
        </View>
      </View>

      <Text style={[styles.amount, { color }]}>
        {isIncome ? '+' : '-'}R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  category: {
    fontSize: typography.size.xs,
  },
  date: {
    fontSize: typography.size.xs,
  },
  amount: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
});
