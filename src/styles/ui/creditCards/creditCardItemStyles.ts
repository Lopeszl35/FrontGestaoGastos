// src/styles/ui/creditCards/creditCardItemStyles.ts

import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../shared/theme/themes';
import { spacing, typography, tokens } from '../../../shared/theme/tokens';

export function makeCreditCardItemStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      borderRadius: tokens.radii.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      minHeight: 180,
      justifyContent: 'space-between',
      ...tokens.shadow.card,
    },

    cardSelected: {
      ...tokens.shadow.cardActive,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },

    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
    },

    cardName: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
      color: '#FFFFFF',
      flex: 1,
    },

    cardNumber: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.bold,
      color: '#FFFFFF',
      letterSpacing: 2,
      marginBottom: spacing.md,
    },

    limiteContainer: {
      gap: spacing.xs,
    },

    limiteRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    limiteLabel: {
      fontSize: typography.size.sm,
      color: 'rgba(255, 255, 255, 0.80)',
      fontWeight: typography.weight.medium,
    },

    limiteValue: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
      color: '#FFFFFF',
    },

    progressBarContainer: {
      height: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderRadius: 3,
      overflow: 'hidden',
      marginVertical: spacing.xs,
    },

    progressBar: {
      height: '100%',
      borderRadius: 3,
    },

    limiteFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    limiteUsed: {
      fontSize: typography.size.xs,
      color: 'rgba(255, 255, 255, 0.70)',
    },

    percentual: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.bold,
      color: 'rgba(255, 255, 255, 0.90)',
    },

    inactiveBadge: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 12,
    },

    inactiveText: {
      fontSize: typography.size.xs,
      color: '#FFFFFF',
      fontWeight: typography.weight.bold,
    },
  });
}