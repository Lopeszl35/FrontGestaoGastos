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
import { makeConstructionModalStyles } from "../../../../styles/ui/feedback/constructionModalStyles";

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

export default function ConstructionModal({
  visible,
  onClose,
  title = "Em Construção",
  message = "Estamos trabalhando duro para trazer essa funcionalidade incrível para você. Aguarde novidades!",
}: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeConstructionModalStyles(theme), [theme]);
  
  // Estado local para controlar a montagem/desmontagem visual segura
  const [showModal, setShowModal] = useState(visible);
  
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 14,
          bounciness: 8,
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
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
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
        {/* Blur no fundo inteiro */}
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
        
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
            <View style={styles.iconContainer}>
              <MaterialIcons name="handyman" size={48} color={theme.colors.primary} />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonContainer}>
              <AppButton 
                title="Entendi" 
                onPress={onClose} 
                variant="primary"
              />
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}