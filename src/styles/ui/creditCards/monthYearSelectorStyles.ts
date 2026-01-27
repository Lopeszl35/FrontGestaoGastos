// src/styles/ui/creditCards/monthYearSelectorStyles.ts

import { StyleSheet } from 'react-native';
import { spacing, typography, tokens } from '../../../shared/theme/tokens';

export const makeMonthYearSelectorStyles = (theme: any) => {
  return StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },

    gradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
      borderRadius: tokens.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    arrowButton: {
      width: 44,
      height: 44,
    },

    arrowGradient: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },

    centerContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    },

    monthText: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
      letterSpacing: -0.3,
    },

    yearText: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },

    currentBadge: {
      marginTop: 4,
      paddingVertical: 2,
      paddingHorizontal: spacing.sm,
      borderRadius: 6,
    },

    currentBadgeText: {
      fontSize: typography.size.xs - 1,
      fontWeight: typography.weight.bold,
    },
  });
};