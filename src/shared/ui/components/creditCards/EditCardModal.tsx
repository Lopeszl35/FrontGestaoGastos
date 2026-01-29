// src/shared/ui/components/creditCards/EditCardModal.tsx

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "../../../theme/ThemeProvider";
import { makeEditCardModalStyles } from "../../../../styles/ui/creditCards/editCardModalStyles";
import AppButton from "../buttons/AppButton";
import TextField from "../form/TextField";

import { creditCardsService } from "../../../../services/creditCardsService";
import { useAuthSession } from "../../../auth/AuthSessionContext";
import type { CreditCard, EditCreditCardDTO } from "../../../../types/creditCard";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CARD_COLORS = ["#1A1A1F", "#2563EB", "#7C3AED", "#DB2777", "#DC2626", "#059669"];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  card: CreditCard | null;
};

export default function EditCardModal({ visible, onClose, onSuccess, card }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeEditCardModalStyles(theme), [theme]);
  const { user, token } = useAuthSession();

  const [showModal, setShowModal] = useState(visible);
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [nome, setNome] = useState("");
  const [limite, setLimite] = useState("");
  const [diaFechamento, setDiaFechamento] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [ultimos4, setUltimos4] = useState("");
  const [selectedColor, setSelectedColor] = useState(CARD_COLORS[0]);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Popula campos quando o card muda
  useEffect(() => {
    if (card && visible) {
      setNome(card.nome || "");
      setLimite(card.limiteTotal?.toString() || "");
      setDiaFechamento(card.diaFechamento?.toString() || "");
      setDiaVencimento(card.diaVencimento?.toString() || "");
      setUltimos4(card.ultimos4 || "");
      setSelectedColor(card.corHex || CARD_COLORS[0]);
    }
  }, [card, visible]);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 150, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setShowModal(false);
      });
    }
  }, [visible]);

  const resetForm = () => {
    setNome("");
    setLimite("");
    setDiaFechamento("");
    setDiaVencimento("");
    setUltimos4("");
    setSelectedColor(CARD_COLORS[0]);
    setErrors({});
    setLoading(false);
  };

  const getUserId = () => {
    if (!user) return null;
    const id = user.id_usuario || (user as any).id;
    if (id) return Number(id);
    return null;
  };

  const handleSave = async () => {
    if (!card) return;

    const newErrors: { [key: string]: string } = {};
    
    // Validações opcionais (só valida se o campo foi preenchido)
    if (nome.trim() && nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    }
    
    if (limite.trim()) {
      const limiteNum = parseFloat(limite.replace(/[^0-9.,]/g, "").replace(',', '.'));
      if (isNaN(limiteNum) || limiteNum < 0) {
        newErrors.limite = "Valor inválido";
      }
    }
    
    if (diaFechamento.trim()) {
      const diaF = parseInt(diaFechamento);
      if (isNaN(diaF) || diaF < 1 || diaF > 31) {
        newErrors.diaFechamento = "Inválido (1-31)";
      }
    }
    
    if (diaVencimento.trim()) {
      const diaV = parseInt(diaVencimento);
      if (isNaN(diaV) || diaV < 1 || diaV > 31) {
        newErrors.diaVencimento = "Inválido (1-31)";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const userId = getUserId();
    
    if (!userId) {
      Alert.alert(
        "Erro de Sessão", 
        "Não foi possível identificar o usuário."
      );
      return;
    }

    setLoading(true);
    try {
      // Monta payload apenas com campos alterados
      const payload: EditCreditCardDTO = {};
      
      if (nome.trim() && nome !== card.nome) {
        payload.nome = nome.trim();
      }
      
      if (limite.trim()) {
        const limiteCleanStr = limite.replace(/[^0-9.,]/g, "").replace(',', '.');
        const limiteFinal = parseFloat(limiteCleanStr);
        if (!isNaN(limiteFinal) && limiteFinal !== card.limiteTotal) {
          payload.limiteTotal = limiteFinal;
        }
      }
      
      if (diaFechamento.trim()) {
        const diaF = parseInt(diaFechamento);
        if (!isNaN(diaF) && diaF !== card.diaFechamento) {
          payload.diaFechamento = diaF;
        }
      }
      
      if (diaVencimento.trim()) {
        const diaV = parseInt(diaVencimento);
        if (!isNaN(diaV) && diaV !== card.diaVencimento) {
          payload.diaVencimento = diaV;
        }
      }
      
      if (ultimos4.trim() && ultimos4 !== card.ultimos4) {
        payload.ultimos4 = ultimos4 || null;
      }
      
      if (selectedColor !== card.corHex) {
        payload.corHex = selectedColor;
      }

      // Se nenhum campo foi alterado
      if (Object.keys(payload).length === 0) {
        Alert.alert("Atenção", "Nenhuma alteração foi feita.");
        setLoading(false);
        return;
      }

      await creditCardsService.editCard(
        userId, 
        card.uuid_cartao, 
        payload, 
        token ?? undefined
      );
      
      Alert.alert("Sucesso", "Cartão atualizado com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Erro API:", error);
      Alert.alert("Erro", "Não foi possível atualizar o cartão.");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal || !card) return null;

  return (
    <Modal transparent visible={showModal} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
        >
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
              style={[
                styles.card, 
                { 
                  maxHeight: SCREEN_HEIGHT * 0.85,
                  padding: 0 
                }
              ]} 
            >
              {/* Header */}
              <View style={[styles.header, { padding: 24, paddingBottom: 16 }]}> 
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <MaterialIcons name="edit" size={24} color={theme.colors.primary} />
                  <Text style={styles.title}>Editar Cartão</Text>
                </View>
                
                <Pressable 
                  onPress={onClose} 
                  style={{ padding: 8, marginRight: -8 }}
                  hitSlop={20}
                >
                  <MaterialIcons name="close" size={24} color={theme.colors.text} />
                </Pressable>
              </View>

              {/* ScrollView */}
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
                keyboardShouldPersistTaps="handled"
                style={{ flexShrink: 1 }} 
              >
                <TextField 
                  label="Nome do Cartão"
                  placeholder={card.nome}
                  value={nome}
                  onChangeText={setNome}
                  error={errors.nome}
                  leftIconName="credit-card"
                />

                <TextField 
                  label="Limite Total (R$)"
                  placeholder={card.limiteTotal?.toString()}
                  value={limite}
                  onChangeText={setLimite}
                  keyboardType="numeric"
                  error={errors.limite}
                  leftIconName="attach-money"
                />

                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <TextField 
                      label="Dia Fechamento"
                      placeholder={card.diaFechamento?.toString()}
                      value={diaFechamento}
                      onChangeText={setDiaFechamento}
                      keyboardType="number-pad"
                      maxLength={2}
                      error={errors.diaFechamento}
                      leftIconName="event"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <TextField 
                      label="Dia Vencimento"
                      placeholder={card.diaVencimento?.toString()}
                      value={diaVencimento}
                      onChangeText={setDiaVencimento}
                      keyboardType="number-pad"
                      maxLength={2}
                      error={errors.diaVencimento}
                      leftIconName="event-available"
                    />
                  </View>
                </View>

                <TextField 
                  label="Últimos 4 dígitos (Opcional)"
                  placeholder={card.ultimos4 || "1234"}
                  value={ultimos4}
                  onChangeText={setUltimos4}
                  keyboardType="number-pad"
                  maxLength={4}
                  leftIconName="pin"
                />

                <View style={{ marginBottom: 24 }}>
                  <Text style={styles.sectionLabel}>Cor do Cartão</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.colorSelector}>
                      {CARD_COLORS.map((color) => (
                        <Pressable
                          key={color}
                          onPress={() => setSelectedColor(color)}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            selectedColor === color && styles.colorOptionSelected,
                          ]}
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={[styles.footer, { padding: 24, paddingTop: 16 }]}>
                <AppButton 
                  title="Salvar Alterações" 
                  onPress={handleSave} 
                  variant="primary"
                  loading={loading}
                />
                {!loading && (
                  <AppButton 
                    title="Cancelar" 
                    onPress={onClose} 
                    variant="outline"
                  />
                )}
              </View>

            </LinearGradient>
          </Animated.View>    
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}