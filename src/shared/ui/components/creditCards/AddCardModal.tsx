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
import { makeAddCardModalStyles } from "../../../../styles/ui/creditCards/addCardModalStyles";
import AppButton from "../buttons/AppButton";
import TextField from "../form/TextField";

import { creditCardsService } from "../../../../services/creditCardsService";
import { useAuthSession } from "../../../auth/AuthSessionContext";
import type { CreateCreditCardDTO } from "../../../../types/creditCard";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const CARD_COLORS = ["#1A1A1F", "#2563EB", "#7C3AED", "#DB2777", "#DC2626", "#059669"];

export default function AddCardModal({ visible, onClose, onSuccess }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeAddCardModalStyles(theme), [theme]);
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

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      resetForm();
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

  // ✅ Lógica de ID mais robusta e com Logs
  const getUserId = () => {
    console.log("🔍 [AddCardModal] Verificando User Data:", JSON.stringify(user, null, 2));
    
    if (!user) return null;

    // Tenta pegar id_usuario (padrão) ou id
    const id = user.id_usuario || (user as any).id;
    
    // Se não achar, tenta converter para número caso venha como string
    if (id) return Number(id);

    return null;
  };

  const handleSave = async () => {
    // 1. Validação de Formulário
    const newErrors: { [key: string]: string } = {};
    
    if (!nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!limite.trim()) newErrors.limite = "Limite é obrigatório";
    
    const diaF = parseInt(diaFechamento);
    const diaV = parseInt(diaVencimento);

    if (!diaFechamento || isNaN(diaF) || diaF < 1 || diaF > 31) {
      newErrors.diaFechamento = "Inválido (1-31)";
    }
    if (!diaVencimento || isNaN(diaV) || diaV < 1 || diaV > 31) {
      newErrors.diaVencimento = "Inválido (1-31)";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // 2. Validação de Usuário
    const userId = getUserId();
    
    if (!userId) {
      console.error("❌ [AddCardModal] ID não encontrado. Objeto user:", user);
      Alert.alert(
        "Erro de Sessão", 
        "Não foi possível identificar o usuário. Tente fazer logout e login novamente."
      );
      return;
    }

    setLoading(true);
    try {
      let limiteCleanStr = limite.replace(/[^0-9.,]/g, "");
      limiteCleanStr = limiteCleanStr.replace(',', '.');
      const limiteFinal = parseFloat(limiteCleanStr);

      if (isNaN(limiteFinal)) {
        setErrors({ ...newErrors, limite: "Valor inválido" });
        setLoading(false);
        return;
      }

      const payload: CreateCreditCardDTO = {
        nome,
        limiteTotal: limiteFinal,
        diaFechamento: parseInt(diaFechamento),
        diaVencimento: parseInt(diaVencimento),
        ultimos4: ultimos4 || null,
        corHex: selectedColor,
        bandeira: "Outro", 
      };

      await creditCardsService.createCard(userId, payload, token ?? undefined);
      
      onSuccess(); 
      onClose();   
    } catch (error) {
      console.error("❌ Erro API:", error);
      Alert.alert("Erro", "Não foi possível criar o cartão.");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

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
                  <MaterialIcons name="add-card" size={24} color={theme.colors.primary} />
                  <Text style={styles.title}>Novo Cartão</Text>
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
                  placeholder="Ex: Nubank, Inter..."
                  value={nome}
                  onChangeText={setNome}
                  error={errors.nome}
                  leftIconName="credit-card"
                />

                <TextField 
                  label="Limite Total (R$)"
                  placeholder="0,00"
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
                      placeholder="DD"
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
                      placeholder="DD"
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
                  placeholder="1234"
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
                  title="Salvar Cartão" 
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