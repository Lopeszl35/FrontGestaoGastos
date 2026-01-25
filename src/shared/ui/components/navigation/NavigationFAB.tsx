import React, { useEffect, useRef } from 'react';
import { Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme/ThemeProvider';
import { navigationFABStyles } from '../../../../styles/ui/navigation/navigationFABStyles';

type Props = {
  onPress: () => void;
  isMenuOpen: boolean;
};

export default function NavigationFAB({ onPress, isMenuOpen }: Props) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  // Animação de pulso contínuo quando menu está fechado
  useEffect(() => {
    if (!isMenuOpen) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.08,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulse.setValue(1);
    }
  }, [isMenuOpen]);

  // Rotação do ícone
  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isMenuOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 10,
    }).start();
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={navigationFABStyles.container}
    >
      {/* Glow Effect */}
      <Animated.View
        style={[
          navigationFABStyles.glow,
          {
            opacity: isMenuOpen ? 0.4 : 0.3,
            transform: [{ scale: pulse }],
          },
        ]}
      />

      {/* FAB Button */}
      <Animated.View
        style={[
          navigationFABStyles.fab,
          {
            transform: [{ scale }, { rotate }],
          },
        ]}
      >
        <LinearGradient
          colors={theme.colors.gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={navigationFABStyles.gradient}
        >
          <MaterialIcons
            name={isMenuOpen ? 'close' : 'menu'}
            size={28}
            color="#FFFFFF"
          />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}