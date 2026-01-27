// src/styles/ui/creditCards/totalSummaryCardStyles.ts

import { StyleSheet } from 'react-native';
import { spacing, typography, tokens } from '../../../shared/theme/tokens';

export const makeTotalSummaryCardStyles = (theme: any) => {
  return StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },

    gradient: {
      borderRadius: tokens.radii.xl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...tokens.shadow.card,
    },

    // Header
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
    },

    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerTitle: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },

    headerSubtitle: {
      fontSize: typography.size.xs,
      marginTop: 2,
      fontWeight: typography.weight.medium,
    },

    badge: {
      paddingVertical: 4,
      paddingHorizontal: spacing.sm,
      borderRadius: 8,
    },

    badgeText: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.bold,
    },

    // Main Values
    mainValues: {
      gap: spacing.sm,
      marginBottom: spacing.md,
    },

    valueRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    valueLabel: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },

    valueAmount: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
      letterSpacing: -0.3,
    },

    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: spacing.xs,
    },

    // Progress Bar
    progressContainer: {
      marginBottom: spacing.md,
    },

    progressBar: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',
      borderRadius: 4,
    },

    // Footer
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },

    footerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },

    footerLabel: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },

    footerValue: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
      letterSpacing: -0.3,
    },
  });
};