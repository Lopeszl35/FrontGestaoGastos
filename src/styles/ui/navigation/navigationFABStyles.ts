import { StyleSheet } from 'react-native';
import { tokens } from '../../../shared/theme/tokens';

export const navigationFABStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 999,
  },

  glow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
    top: -6,
    left: -6,
  },

  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    ...tokens.shadow.cardActive,
  },

  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});