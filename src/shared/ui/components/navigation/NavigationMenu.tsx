import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme/ThemeProvider';
import { spacing } from '../../../theme/tokens';
import { makeNavigationMenuStyles } from '../../../../styles/ui/navigation/navigationMenuStyles';
import ConstructionModal from '../feedback/ConstructionModal';
import LogoutModal from '../feedback/LogoutModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MENU_HEIGHT = SCREEN_HEIGHT * 0.85;

type MenuItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  screen?: string;
  action?: () => void;
  isDanger?: boolean;
  wip?: boolean; // ✅ Flag para indicar "Work In Progress"
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export default function NavigationMenu({ visible, onClose, onLogout }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeNavigationMenuStyles(theme), [theme]);
  
  const [showMenu, setShowMenu] = useState(visible);
  const [constructionVisible, setConstructionVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(MENU_HEIGHT)).current;

  // Definição dos itens do menu
  const menuItems: MenuItem[] = [
    {
      id: 'credit-cards',
      label: 'Cartões de Crédito',
      icon: 'credit-card',
      color: theme.colors.warning,
      screen: 'CreditCards',
      wip: true, // 🚧 Em construção
    },
    {
      id: 'variable-expenses',
      label: 'Gastos Variáveis',
      icon: 'shopping-cart',
      color: theme.colors.success,
      screen: 'VariableExpenses',
      wip: true, // 🚧 Em construção
    },
    {
      id: 'fixed-expenses',
      label: 'Gastos Fixos',
      icon: 'home',
      color: theme.colors.info,
      screen: 'FixedExpenses',
      wip: true,
    },
    {
      id: 'financing',
      label: 'Financiamentos',
      icon: 'account-balance',
      color: theme.colors.accent,
      screen: 'Financing',
      wip: true,
    },
    {
      id: 'income',
      label: 'Receitas',
      icon: 'trending-up',
      color: theme.colors.success,
      screen: 'Income',
      wip: true,
    },
    {
      id: 'recurring',
      label: 'Gastos Recorrentes',
      icon: 'loop',
      color: theme.colors.primary,
      screen: 'RecurringExpenses',
      wip: true,
    },
    {
      id: 'reminders',
      label: 'Lembretes de Pagamento',
      icon: 'notifications-active',
      color: theme.colors.warning,
      screen: 'PaymentReminders',
      wip: true,
    },
  ];

  useEffect(() => {
    if (visible) {
      setShowMenu(true);
      StatusBar.setBarStyle('light-content');
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 12, bounciness: 6 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: MENU_HEIGHT, duration: 250, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setShowMenu(false);
      });
    }
  }, [visible]);

  const handleItemPress = (item: MenuItem) => {
    // ✅ Lógica centralizada: Se for WIP, abre o modal e para por aqui
    if (item.wip) {
      setConstructionVisible(true);
      return;
    }

    if (item.action) {
      item.action();
    } else if (item.screen) {
      // onNavigate(item.screen);
    }
    onClose();
  };

  if (!showMenu) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim, pointerEvents: visible ? 'auto' : 'none' }]}>
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark">
        <Pressable style={styles.backdrop} onPress={onClose} />
      </BlurView>

      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateY: slideAnim }],
            height: MENU_HEIGHT,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 999,
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(19, 19, 26, 0.98)', 'rgba(13, 13, 14, 0.98)']}
          style={[styles.menuGradient, { flex: 1, overflow: 'hidden' }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
                <MaterialIcons name="menu" size={24} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Menu</Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>Navegação</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <ScrollView
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
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

            <View style={[styles.divider, { backgroundColor: theme.colors.border, marginTop: spacing.md }]} />

            <Pressable
              onPress={() => {
                setLogoutModalVisible(true); 
              }}
              style={({ pressed }) => [
                styles.logoutButton,
                {
                  marginTop: spacing.md,
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
          </ScrollView>
        </LinearGradient>
      </Animated.View>

      {/* ✅ Modal reutilizável inserido aqui */}
      <ConstructionModal 
        visible={constructionVisible}
        onClose={() => setConstructionVisible(false)}
      />

      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)} // Usuário cancelou
        onConfirm={() => {
          setLogoutModalVisible(false); // Fecha o modal
          onClose(); // Fecha o menu
          setTimeout(() => {
             onLogout(); // Executa o logout real após uma leve pausa visual
          }, 200); 
        }}
      />
    </Animated.View>
  );
}

// Componente MenuItem (Puro visual)
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
      Animated.timing(fadeIn, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.spring(slideX, { toValue: 0, delay, useNativeDriver: true, speed: 12, bounciness: 6 }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 8 }).start();
  };

  return (
    <Animated.View style={{ opacity: fadeIn, transform: [{ translateX: slideX }, { scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.menuItem,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            opacity: item.wip ? 0.75 : 1, // Feedback visual sutil de que é diferente
          },
        ]}
      >
        <View style={[styles.menuItemIcon, { backgroundColor: `${item.color}15` }]}>
          <MaterialIcons name={item.icon} size={22} color={item.color} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={[styles.menuItemText, { color: theme.colors.text }]}>{item.label}</Text>
          {/* Badge "Em Breve" se for WIP */}
          {item.wip && (
            <Text style={{ fontSize: 10, color: theme.colors.textMuted, marginTop: 2, marginLeft: 0 }}>
              Em breve
            </Text>
          )}
        </View>
        <MaterialIcons name="chevron-right" size={20} color={theme.colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}