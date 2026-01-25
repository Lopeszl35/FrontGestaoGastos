import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "../../../theme/ThemeProvider";
import AppButton from "../buttons/AppButton";
import { makeLogoutModalStyles } from "../../../../styles/ui/feedback/logoutModalStyles";

type Props = {
  visible: boolean;
  onClose: () => void;   // Ação de Cancelar
  onConfirm: () => void; // Ação de Sair
};

export default function LogoutModal({ visible, onClose, onConfirm }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeLogoutModalStyles(theme), [theme]);
  
  // Controle de renderização segura
  const [showModal, setShowModal] = useState(visible);
  
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setShowModal(false);
        }
      });
    }
  }, [visible]);

  if (!showModal) return null;

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.surface, "#1A1A1F"]}
            style={styles.card}
          >
            {/* Ícone de Aviso/Saída */}
            <View style={styles.iconContainer}>
              <MaterialIcons name="power-settings-new" size={36} color={theme.colors.danger} />
            </View>

            <Text style={styles.title}>Deseja sair da conta?</Text>
            
            <Text style={styles.message}>
              Você precisará fazer login novamente para acessar seus dados financeiros.
            </Text>

            <View style={styles.footer}>
              {/* Botão Cancelar (Outline - Menos ênfase visual, opção segura) */}
              <View style={styles.buttonWrapper}>
                <AppButton 
                  title="Cancelar" 
                  onPress={onClose} 
                  variant="outline"
                />
              </View>

              {/* Botão Sair (Danger - Ênfase na ação destrutiva) */}
              <View style={styles.buttonWrapper}>
                <AppButton 
                  title="Sair" 
                  onPress={onConfirm} 
                  variant="danger"
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}