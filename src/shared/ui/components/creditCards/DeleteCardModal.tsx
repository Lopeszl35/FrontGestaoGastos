// src/shared/ui/components/creditCards/DeleteCardModal.tsx

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "../../../theme/ThemeProvider";
import { makeDeleteCardModalStyles } from "../../../../styles/ui/creditCards/deleteCardModalStyles";
import AppButton from "../buttons/AppButton";

import type { CreditCard } from "../../../../types/creditCard";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  card: CreditCard | null;
};

export default function DeleteCardModal({ visible, onClose, onConfirm, card }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeDeleteCardModalStyles(theme), [theme]);
  
  const [showModal, setShowModal] = useState(visible);
  const [loading, setLoading] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

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

      // Efeito de shake sutil no ícone
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 5,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -5,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.delay(3000),
        ])
      ).start();
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
        if (finished) setShowModal(false);
      });
    }
  }, [visible]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Alert.alert("Erro", "Não foi possível excluir o cartão.");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal || !card) return null;

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
            {/* Ícone de Alerta Animado */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [{ rotate: shakeAnim.interpolate({
                    inputRange: [-5, 5],
                    outputRange: ['-3deg', '3deg'],
                  })}],
                },
              ]}
            >
              <MaterialIcons name="warning" size={48} color={theme.colors.danger} />
            </Animated.View>

            <Text style={styles.title}>Excluir Cartão?</Text>
            
            <View style={styles.cardPreview}>
              <View style={[styles.colorBadge, { backgroundColor: card.corHex || theme.colors.primary }]} />
              <Text style={styles.cardName}>{card.nome}</Text>
            </View>
            
            <Text style={styles.message}>
              Esta ação não pode ser desfeita. Todos os lançamentos e histórico 
              associados a este cartão serão permanentemente removidos.
            </Text>

            <View style={styles.warningBox}>
              <MaterialIcons name="info" size={18} color={theme.colors.warning} />
              <Text style={styles.warningText}>
                Certifique-se de que não há faturas pendentes
              </Text>
            </View>

            <View style={styles.footer}>
              {/* Botão Cancelar (Seguro - Outline) */}
              <View style={styles.buttonWrapper}>
                <AppButton 
                  title="Cancelar" 
                  onPress={onClose} 
                  variant="outline"
                  disabled={loading}
                />
              </View>

              {/* Botão Excluir (Perigo - Danger) */}
              <View style={styles.buttonWrapper}>
                <AppButton 
                  title="Excluir" 
                  onPress={handleConfirm} 
                  variant="danger"
                  loading={loading}
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}