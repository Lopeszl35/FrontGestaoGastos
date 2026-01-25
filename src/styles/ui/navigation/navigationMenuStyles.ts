import { StyleSheet, Dimensions } from 'react-native';
import type { AppTheme } from '../../../shared/theme/themes';
import { spacing, typography, tokens } from '../../../shared/theme/tokens';

const { height } = Dimensions.get('window');

export function makeNavigationMenuStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    },

    backdrop: {
      flex: 1,
    },

    menuContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: height * 0.85,
      borderTopLeftRadius: tokens.radii.xl + 8,
      borderTopRightRadius: tokens.radii.xl + 8,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 40,
      shadowOffset: { width: 0, height: -10 },
      elevation: 24,
    },

    menuGradient: {
      flex: 1,
      paddingTop: spacing.xl,
      paddingHorizontal: spacing.lg,
    },

    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },

    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },

    headerIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerTitle: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.bold,
    },

    headerSubtitle: {
      fontSize: typography.size.sm,
    },

    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Divider
    divider: {
      height: 1,
      marginVertical: spacing.md,
    },

    // Menu Items
    menuItems: {
      gap: spacing.sm,
    },

    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: tokens.radii.md,
      borderWidth: 1,
      gap: spacing.md,
    },

    menuItemIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },

    menuItemText: {
      flex: 1,
      fontSize: typography.size.md,
      fontWeight: typography.weight.medium,
    },

    // Logout Button
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: tokens.radii.md,
      borderWidth: 1.5,
      gap: spacing.md,
      marginTop: spacing.md,
    },

    logoutIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    logoutText: {
      flex: 1,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },
  });
}