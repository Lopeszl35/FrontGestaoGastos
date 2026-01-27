// src/shared/ui/components/creditCards/PayInvoiceModal.tsx

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "../../../theme/ThemeProvider";
import { makePayInvoiceModalStyles } from "../../../../styles/ui/creditCards/payInvoiceModalStyles";
import AppButton from "../buttons/AppButton";
import TextField from "../form/TextField";

import { creditCardsService } from "../../../../services/creditCardsService";
import { useAuthSession } from "../../../auth/AuthSessionContext";
import type { CreditCard } from "../../../../types/creditCard";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  card: CreditCard | null;
  valorFatura: number;
};

export default function PayInvoiceModal({ visible, onClose, onSuccess, card, valorFatura }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makePayInvoiceModalStyles(theme), [theme]);
  const { user, token } = useAuthSession();

  const [showModal, setShowModal] = useState(visible);
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [valorPagamento, setValorPagamento] = useState("");
  const [pagamentoTotal, setPagamentoTotal] = useState(true);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      setValorPagamento(valorFatura.toFixed(2));
      setPagamentoTotal(true);
      setErrors({});
      
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      // Animação de pulso no valor
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 150, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setShowModal(false);
      });
    }
  }, [visible, valorFatura]);

  const getUserId = () => {
    if (!user) return null;
    const id = user.id_usuario || (user as any).id;
    if (id) return Number(id);
    return null;
  };

  const handlePay = async () => {
    if (!card) return;

    const newErrors: { [key: string]: string } = {};
    
    if (!valorPagamento.trim()) {
      newErrors.valor = "Valor é obrigatório";
    } else {
      const valor = parseFloat(valorPagamento.replace(/[^0-9.,]/g, "").replace(',', '.'));
      if (isNaN(valor) || valor <= 0) {
        newErrors.valor = "Valor inválido";
      } else if (valor > valorFatura) {
        newErrors.valor = "Valor excede a fatura";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const userId = getUserId();
    
    if (!userId) {
      Alert.alert("Erro de Sessão", "Não foi possível identificar o usuário.");
      return;
    }

    // Obter ano e mês atuais
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;

    setLoading(true);
    try {
      const valorClean = valorPagamento.replace(/[^0-9.,]/g, "").replace(',', '.');
      const valorFinal = parseFloat(valorClean);

      if (isNaN(valorFinal)) {
        setErrors({ valor: "Valor inválido" });
        setLoading(false);
        return;
      }

      // Backend espera: idCartao (number, não uuid)
      // Precisamos buscar o id numérico do cartão
      // Nota: O card não tem id_cartao exposto, apenas uuid_cartao
      // Vamos precisar adicionar uma propriedade ou fazer conversão no service
      
      await creditCardsService.payInvoice(
        userId,
        card.uuid_cartao, // O service precisará converter para idCartao
        valorFinal,
        ano,
        mes,
        token ?? undefined
      );
      
      Alert.alert(
        "Sucesso!", 
        pagamentoTotal 
          ? "Fatura paga totalmente!" 
          : `Pagamento parcial de R$ ${valorFinal.toFixed(2)} realizado com sucesso!`
      );
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Erro ao pagar fatura:", error);
      Alert.alert("Erro", "Não foi possível processar o pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleValorChange = (text: string) => {
    setValorPagamento(text);
    const valor = parseFloat(text.replace(/[^0-9.,]/g, "").replace(',', '.'));
    setPagamentoTotal(!isNaN(valor) && valor >= valorFatura);
  };

  if (!showModal || !card) return null;

  const valorPagamentoNum = parseFloat(valorPagamento.replace(/[^0-9.,]/g, "").replace(',', '.')) || 0;
  const percentualPago = (valorPagamentoNum / valorFatura) * 100;

  return (
    <Modal transparent visible={showModal} animationType="none" onRequestClose={onClose}>
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
            {/* Header */}
            <View style={styles.header}> 
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MaterialIcons name="payment" size={24} color={theme.colors.success} />
                <View>
                  <Text style={styles.title}>Pagar Fatura</Text>
                  <Text style={styles.subtitle}>{card.nome}</Text>
                </View>
              </View>
              
              <Pressable 
                onPress={onClose} 
                style={{ padding: 8, marginRight: -8 }}
                hitSlop={20}
              >
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>

            {/* Valor da Fatura */}
            <View style={styles.faturaContainer}>
              <Text style={styles.faturaLabel}>Valor da Fatura</Text>
              <Animated.Text 
                style={[
                  styles.faturaValor,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                R$ {valorFatura.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Animated.Text>
            </View>

            {/* Input Valor Pagamento */}
            <View style={{ paddingHorizontal: 24 }}>
              <TextField 
                label="Valor do Pagamento"
                placeholder="0,00"
                value={valorPagamento}
                onChangeText={handleValorChange}
                keyboardType="numeric"
                error={errors.valor}
                leftIconName="attach-money"
              />
            </View>

            {/* Indicador de Tipo de Pagamento */}
            <View style={styles.paymentTypeContainer}>
              <View style={[
                styles.paymentTypeBadge,
                { 
                  backgroundColor: pagamentoTotal 
                    ? `${theme.colors.success}20` 
                    : `${theme.colors.warning}20`,
                  borderColor: pagamentoTotal ? theme.colors.success : theme.colors.warning,
                }
              ]}>
                <MaterialIcons 
                  name={pagamentoTotal ? "check-circle" : "schedule"} 
                  size={16} 
                  color={pagamentoTotal ? theme.colors.success : theme.colors.warning} 
                />
                <Text style={[
                  styles.paymentTypeText,
                  { color: pagamentoTotal ? theme.colors.success : theme.colors.warning }
                ]}>
                  {pagamentoTotal ? "Pagamento Total" : "Pagamento Parcial"}
                </Text>
              </View>
            </View>

            {/* Barra de Progresso */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${Math.min(percentualPago, 100)}%`,
                      backgroundColor: pagamentoTotal ? theme.colors.success : theme.colors.warning,
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {percentualPago.toFixed(0)}% da fatura
              </Text>
            </View>

            {/* Ações Rápidas */}
            <View style={styles.quickActions}>
              <Pressable
                style={[styles.quickActionButton, { borderColor: theme.colors.border }]}
                onPress={() => setValorPagamento((valorFatura * 0.25).toFixed(2))}
              >
                <Text style={[styles.quickActionText, { color: theme.colors.textMuted }]}>25%</Text>
              </Pressable>
              <Pressable
                style={[styles.quickActionButton, { borderColor: theme.colors.border }]}
                onPress={() => setValorPagamento((valorFatura * 0.50).toFixed(2))}
              >
                <Text style={[styles.quickActionText, { color: theme.colors.textMuted }]}>50%</Text>
              </Pressable>
              <Pressable
                style={[styles.quickActionButton, { borderColor: theme.colors.border }]}
                onPress={() => setValorPagamento((valorFatura * 0.75).toFixed(2))}
              >
                <Text style={[styles.quickActionText, { color: theme.colors.textMuted }]}>75%</Text>
              </Pressable>
              <Pressable
                style={[styles.quickActionButton, { borderColor: theme.colors.success }]}
                onPress={() => setValorPagamento(valorFatura.toFixed(2))}
              >
                <Text style={[styles.quickActionText, { color: theme.colors.success }]}>Total</Text>
              </Pressable>
            </View>

            {/* Alerta de Saldo */}
            <View style={styles.warningBox}>
              <MaterialIcons name="info" size={18} color={theme.colors.info} />
              <Text style={styles.warningText}>
                O valor será debitado do seu saldo atual
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.buttonWrapper}>
                <AppButton 
                  title="Cancelar" 
                  onPress={onClose} 
                  variant="outline"
                  disabled={loading}
                />
              </View>

              <View style={styles.buttonWrapper}>
                <AppButton 
                  title="Pagar" 
                  onPress={handlePay} 
                  variant="primary"
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