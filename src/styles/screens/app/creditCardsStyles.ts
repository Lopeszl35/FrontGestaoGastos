// src/styles/screens/app/creditCardsStyles.ts

import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../shared/theme/themes';
import { spacing, typography } from '../../../shared/theme/tokens';

export function makeCreditCardsStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },

    content: {
      padding: spacing.lg,
      gap: spacing.xl,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.md,
    },

    loadingText: {
      fontSize: typography.size.md,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      gap: spacing.md,
    },

    emptyTitle: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.bold,
      textAlign: 'center',
    },

    emptySubtitle: {
      fontSize: typography.size.md,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },

    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: 12,
    },

    addButtonText: {
      color: '#FFFFFF',
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },

    title: {
      fontSize: typography.size.xxl,
      fontWeight: typography.weight.bold,
    },

    subtitle: {
      fontSize: typography.size.md,
      marginTop: spacing.xs,
    },

    addIconButton: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardsSection: {
      gap: spacing.md,
    },

    sectionTitle: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
      marginBottom: spacing.sm,
    },

    detailsSection: {
      gap: spacing.md,
    },

    detailsLoading: {
      paddingVertical: spacing.xxl,
      alignItems: 'center',
      justifyContent: 'center',
    },

    detailsEmpty: {
      paddingVertical: spacing.xxl,
      alignItems: 'center',
      justifyContent: 'center',
    },

    emptyText: {
      fontSize: typography.size.md,
      textAlign: 'center',
    },
  });
}