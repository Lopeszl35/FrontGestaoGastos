import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme/ThemeProvider';
import { spacing } from '../../../theme/tokens';
import { makeNavigationMenuStyles } from '../../../../styles/ui/navigation/navigationMenuStyles';

const { height } = Dimensions.get('window');

type MenuItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  screen?: string;
  action?: () => void;
  isDanger?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
};

export default function NavigationMenu({ visible, onClose, onNavigate, onLogout }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeNavigationMenuStyles(theme), [theme]);
  
  // Estado para controlar se o componente deve ser renderizado na árvore
  const [showMenu, setShowMenu] = useState(visible);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  const menuItems: MenuItem[] = [
    {
      id: 'credit-cards',
      label: 'Cartões de Crédito',
      icon: 'credit-card',
      color: theme.colors.warning,
      screen: 'CreditCards',
    },
    {
      id: 'variable-expenses',
      label: 'Gastos Variáveis',
      icon: 'shopping-cart',
      color: theme.colors.success,
      screen: 'VariableExpenses',
    },
    {
      id: 'fixed-expenses',
      label: 'Gastos Fixos',
      icon: 'home',
      color: theme.colors.info,
      screen: 'FixedExpenses',
    },
    {
      id: 'financing',
      label: 'Financiamentos',
      icon: 'account-balance',
      color: theme.colors.accent,
      screen: 'Financing',
    },
    {
      id: 'income',
      label: 'Receitas',
      icon: 'trending-up',
      color: theme.colors.success,
      screen: 'Income',
    },
    {
      id: 'recurring',
      label: 'Gastos Recorrentes',
      icon: 'loop',
      color: theme.colors.primary,
      screen: 'RecurringExpenses',
    },
    {
      id: 'reminders',
      label: 'Lembretes de Pagamento',
      icon: 'notifications-active',
      color: theme.colors.warning,
      screen: 'PaymentReminders',
    },
  ];

  useEffect(() => {
    if (visible) {
      // 1. Ao abrir, garante que o componente está renderizado antes de animar
      setShowMenu(true);
      StatusBar.setBarStyle('light-content');
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 12,
          bounciness: 8,
        }),
      ]).start();
    } else {
      // 2. Ao fechar, anima primeiro e só desmonta no callback (finished)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setShowMenu(false);
        }
      });
    }
  }, [visible]);

  const handleItemPress = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.screen) {
      onNavigate(item.screen);
    }
    onClose();
  };

  // Se não deve mostrar o menu, retorna null para não renderizar nada
  if (!showMenu) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
          pointerEvents: visible ? 'auto' : 'none',
        },
      ]}
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark">
        <Pressable style={styles.backdrop} onPress={onClose} />
      </BlurView>

      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(19, 19, 26, 0.98)', 'rgba(13, 13, 14, 0.98)']}
          style={styles.menuGradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
                <MaterialIcons name="menu" size={24} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Menu</Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>
                  Navegação
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
            </Pressable>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Menu Items */}
          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={item.id}
                item={item}
                onPress={() => handleItemPress(item)}
                delay={index * 50}
                theme={theme}
                styles={styles}
              />
            ))}
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Logout Button */}
          <Pressable
            onPress={() => {
              onLogout();
              onClose();
            }}
            style={({ pressed }) => [
              styles.logoutButton,
              {
                backgroundColor: 'rgba(239, 68, 68, 0.10)',
                borderColor: 'rgba(239, 68, 68, 0.30)',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={[styles.logoutIcon, { backgroundColor: 'rgba(239, 68, 68, 0.20)' }]}>
              <MaterialIcons name="logout" size={20} color={theme.colors.danger} />
            </View>
            <Text style={[styles.logoutText, { color: theme.colors.danger }]}>Sair da Conta</Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.danger} />
          </Pressable>

          {/* Bottom Spacing */}
          <View style={{ height: spacing.xl }} />
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

type MenuItemProps = {
  item: MenuItem;
  onPress: () => void;
  delay: number;
  theme: any;
  styles: any;
};

function MenuItem({ item, onPress, delay, theme, styles }: MenuItemProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(-20)).current;
  const scale = useRef(new Animated.Value(1)).current;

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
      toValue: 0.96,
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
        style={[
          styles.menuItem,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={[styles.menuItemIcon, { backgroundColor: `${item.color}15` }]}>
          <MaterialIcons name={item.icon} size={22} color={item.color} />
        </View>
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>{item.label}</Text>
        <MaterialIcons name="chevron-right" size={20} color={theme.colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}