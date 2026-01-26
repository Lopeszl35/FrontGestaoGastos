import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { makeCreditCardItemStyles } from '../../../../styles/ui/creditCards/creditCardItemStyles';
import type { CreditCard } from '../../../../types/creditCard';

type Props = {
  card: CreditCard;
  onPress: () => void;
  isSelected: boolean;
  delay?: number;
};

export default function CreditCardItem({ card, onPress, isSelected, delay = 0 }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeCreditCardItemStyles(theme), [theme]);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(-20)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // ✅ Função segura para formatar valores no card
  const formatCurrency = (value: number | undefined | null) => {
    return (value ?? 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
    });
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideX, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  const cardColor = card.corHex || theme.colors.primary;
  const percentual = card.percentualUsado || 0;

  const getCardIcon = () => {
    // Tratamento seguro para string opcional
    const bandeira = card.bandeira ? String(card.bandeira).toLowerCase() : '';
    switch (bandeira) {
      case 'visa':
        return 'payment';
      case 'mastercard':
        return 'credit-card';
      case 'elo':
        return 'card-membership';
      default:
        return 'credit-card';
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeIn,
        transform: [{ translateX: slideX }, { scale }],
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={[cardColor, `${cardColor}DD`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            isSelected && styles.cardSelected,
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialIcons name={getCardIcon()} size={24} color="#FFFFFF" />
              <Text style={styles.cardName}>{card.nome}</Text>
            </View>
            {isSelected && (
              <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
            )}
          </View>

          {/* Card Number */}
          {card.ultimos4 && (
            <Text style={styles.cardNumber}>•••• {card.ultimos4}</Text>
          )}

          {/* Limite */}
          <View style={styles.limiteContainer}>
            <View style={styles.limiteRow}>
              <Text style={styles.limiteLabel}>Disponível</Text>
              <Text style={styles.limiteValue}>
                R$ {formatCurrency(card.limiteDisponivel)}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${percentual}%`,
                    backgroundColor: percentual > 80 ? theme.colors.danger : '#FFFFFF',
                  },
                ]}
              />
            </View>

            <View style={styles.limiteFooter}>
              <Text style={styles.limiteUsed}>
                Usado: R$ {formatCurrency(card.limiteUsado)}
              </Text>
              <Text style={styles.percentual}>{percentual}%</Text>
            </View>
          </View>

          {/* Badge Inativo */}
          {!card.ativo && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveText}>Inativo</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}