// src/styles/screens/app/creditCardsStyles.ts

import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../shared/theme/themes';
import { spacing, typography, tokens } from '../../../shared/theme/tokens';

export function makeCreditCardsStyles(theme: AppTheme) {
  return StyleSheet.create({
    full: {
      flex: 1,
    },
    container: {
      flex: 1,
    },

    content: {
      padding: spacing.lg,
      gap: spacing.xl,
    },

    // ========================================
    // LOADING STATE
    // ========================================
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.md,
    },

    loadingText: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.medium,
    },

    // ========================================
    // EMPTY STATE REDESENHADO
    // ========================================
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xxl,
      gap: spacing.lg,
    },

    emptyIllustration: {
      marginBottom: spacing.md,
    },

    emptyIllustrationBg: {
      width: 160,
      height: 160,
      borderRadius: 80,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: theme.colors.primary + '40',
    },

    emptyTitle: {
      fontSize: typography.size.xxl,
      fontWeight: typography.weight.bold,
      textAlign: 'center',
      marginTop: spacing.md,
    },

    emptySubtitle: {
      fontSize: typography.size.md,
      textAlign: 'center',
      lineHeight: 24,
      maxWidth: 320,
    },

    emptyAddButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xxl,
      borderRadius: tokens.radii.lg,
      marginTop: spacing.md,
      ...tokens.shadow.cardActive,
    },

    emptyAddButtonText: {
      color: '#FFFFFF',
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
    },

    emptyFeatures: {
      marginTop: spacing.xxl,
      gap: spacing.md,
      width: '100%',
    },

    emptyFeatureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: theme.colors.surface,
      padding: spacing.md,
      borderRadius: tokens.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    emptyFeatureIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    emptyFeatureText: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.medium,
      flex: 1,
    },

    // ========================================
    // HEADER REDESENHADO
    // ========================================
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },

    headerContent: {
      flex: 1,
    },

    title: {
      fontSize: typography.size.xxl + 4,
      fontWeight: typography.weight.bold,
      letterSpacing: -0.5,
    },

    subtitle: {
      fontSize: typography.size.md,
      marginTop: spacing.xs,
      fontWeight: typography.weight.medium,
    },

    headerAddButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      ...tokens.shadow.cardActive,
    },

    // ========================================
    // CARDS SECTION
    // ========================================
    cardsSection: {
      gap: spacing.md,
    },

    sectionTitle: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
      marginBottom: spacing.sm,
    },

    // ========================================
    // DETAILS SECTION
    // ========================================
    detailsSection: {
      gap: spacing.md,
    },

    detailsHeader: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },

    quickActions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },

    quickActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      borderRadius: tokens.radii.md,
      ...tokens.shadow.card,
    },

    quickActionText: {
      color: '#FFFFFF',
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
    },

    detailsLoading: {
      paddingVertical: spacing.xxl * 2,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
    },

    detailsLoadingText: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.medium,
    },

    detailsEmpty: {
      paddingVertical: spacing.xxl * 2,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: tokens.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    emptyText: {
      fontSize: typography.size.md,
      textAlign: 'center',
      fontWeight: typography.weight.medium,
    },

    // ========================================
    // LEGACY (manter por compatibilidade)
    // ========================================
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

    addIconButton: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}