// src/styles/ui/creditCards/creditCardDetailsStyles.ts

import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../shared/theme/themes';
import { spacing, typography, tokens } from '../../../shared/theme/tokens';

export function makeCreditCardDetailsStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },

    content: {
      padding: spacing.lg,
      gap: spacing.md,
    },

    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },

    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: tokens.radii.md,
    },

    actionText: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
    },

    section: {
      borderRadius: tokens.radii.lg,
      padding: spacing.lg,
      borderWidth: 1,
      gap: spacing.md,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    sectionTitle: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
    },

    totalGastos: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
    },

    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },

    infoLabel: {
      fontSize: typography.size.md,
    },

    categoryItem: {
      paddingVertical: spacing.xs,
    },

    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    categoryName: {
      fontSize: typography.size.md,
      flex: 1,
    },

    categoryValue: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },

    parcelaItem: {
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },

    parcelaHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    parcelaDescricao: {
      fontSize: typography.size.md,
      flex: 1,
    },

    parcelaValor: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },

    parcelaInfo: {
      fontSize: typography.size.sm,
    },

    gastoItem: {
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },

    gastoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    gastoDescricao: {
      fontSize: typography.size.md,
      flex: 1,
    },

    gastoValor: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },

    gastoFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    gastoCategoria: {
      fontSize: typography.size.sm,
    },

    gastoParcela: {
      fontSize: typography.size.xs,
    },

    emptyText: {
      fontSize: typography.size.md,
      textAlign: 'center',
      paddingVertical: spacing.lg,
    },
  });
}