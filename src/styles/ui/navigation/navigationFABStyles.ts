import { StyleSheet } from 'react-native';
import { tokens } from '../../../shared/theme/tokens';

export const navigationFABStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    zIndex: 999,
  },

  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
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