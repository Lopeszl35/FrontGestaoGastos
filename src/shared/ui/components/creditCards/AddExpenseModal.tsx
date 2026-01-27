// src/shared/ui/components/creditCards/AddExpenseModal.tsx

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
  Switch,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "../../../theme/ThemeProvider";
import { makeAddExpenseModalStyles } from "../../../../styles/ui/creditCards/addExpenseModalStyles";
import AppButton from "../buttons/AppButton";
import TextField from "../form/TextField";

import { creditCardsService } from "../../../../services/creditCardsService";
import { useAuthSession } from "../../../auth/AuthSessionContext";
import type { CreditCard, CreateTransactionDTO } from "../../../../types/creditCard";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CATEGORIAS = [
  { id: 'alimentacao', label: 'Alimentação', icon: 'restaurant', color: '#10B981' },
  { id: 'transporte', label: 'Transporte', icon: 'directions-car', color: '#3B82F6' },
  { id: 'compras', label: 'Compras', icon: 'shopping-bag', color: '#F59E0B' },
  { id: 'saude', label: 'Saúde', icon: 'local-hospital', color: '#EF4444' },
  { id: 'lazer', label: 'Lazer', icon: 'sports-esports', color: '#8B5CF6' },
  { id: 'educacao', label: 'Educação', icon: 'school', color: '#06B6D4' },
  { id: 'casa', label: 'Casa', icon: 'home', color: '#EC4899' },
  { id: 'outros', label: 'Outros', icon: 'category', color: '#6B7280' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  card: CreditCard | null;
};

export default function AddExpenseModal({ visible, onClose, onSuccess, card }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeAddExpenseModalStyles(theme), [theme]);
  const { user, token } = useAuthSession();

  const [showModal, setShowModal] = useState(visible);
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataCompra, setDataCompra] = useState("");
  const [categoriaId, setCategoriaId] = useState("outros");
  const [parcelado, setParcelado] = useState(false);
  const [numeroParcelas, setNumeroParcelas] = useState("");
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      resetForm();
      // Define data de hoje por padrão
      const hoje = new Date();
      const dataFormatada = hoje.toISOString().split('T')[0];
      setDataCompra(dataFormatada);
      
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
    setDescricao("");
    setValor("");
    setDataCompra("");
    setCategoriaId("outros");
    setParcelado(false);
    setNumeroParcelas("");
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
    
    if (!descricao.trim()) newErrors.descricao = "Descrição é obrigatória";
    if (!valor.trim()) newErrors.valor = "Valor é obrigatório";
    if (!dataCompra.trim()) newErrors.dataCompra = "Data é obrigatória";
    
    if (parcelado) {
      const parcelas = parseInt(numeroParcelas);
      if (!numeroParcelas || isNaN(parcelas) || parcelas < 2 || parcelas > 60) {
        newErrors.numeroParcelas = "Inválido (2-60)";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const userId = getUserId();
    
    if (!userId) {
      Alert.alert("Erro de Sessão", "Não foi possível identificar o usuário.");
      return;
    }

    setLoading(true);
    try {
      const valorClean = valor.replace(/[^0-9.,]/g, "").replace(',', '.');
      const valorTotal = parseFloat(valorClean);

      if (isNaN(valorTotal)) {
        setErrors({ ...newErrors, valor: "Valor inválido" });
        setLoading(false);
        return;
      }

      const categoriaObj = CATEGORIAS.find(c => c.id === categoriaId);

      const payload: CreateTransactionDTO = {
        descricao: descricao.trim(),
        categoria: categoriaObj?.label || "Outros",
        valorTotal,
        dataCompra,
        parcelado,
        numeroParcelas: parcelado ? parseInt(numeroParcelas) : undefined,
      };

      // Endpoint esperado: /api/cartoes/:id_usuario/:cartao_uuid/lancamentos
      await creditCardsService.createTransaction(
        userId,
        card.uuid_cartao,
        payload,
        token ?? undefined
      );
      
      Alert.alert("Sucesso", parcelado 
        ? `Gasto parcelado em ${numeroParcelas}x adicionado com sucesso!`
        : "Gasto adicionado com sucesso!"
      );
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Erro API:", error);
      Alert.alert("Erro", "Não foi possível adicionar o gasto.");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal || !card) return null;

  const categoriaAtual = CATEGORIAS.find(c => c.id === categoriaId);

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
                  <MaterialIcons name="add-shopping-cart" size={24} color={theme.colors.success} />
                  <View>
                    <Text style={styles.title}>Novo Gasto</Text>
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

              {/* ScrollView */}
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
                keyboardShouldPersistTaps="handled"
                style={{ flexShrink: 1 }} 
              >
                <TextField 
                  label="Descrição"
                  placeholder="Ex: Compras no supermercado"
                  value={descricao}
                  onChangeText={setDescricao}
                  error={errors.descricao}
                  leftIconName="description"
                />

                <TextField 
                  label="Valor (R$)"
                  placeholder="0,00"
                  value={valor}
                  onChangeText={setValor}
                  keyboardType="numeric"
                  error={errors.valor}
                  leftIconName="attach-money"
                />

                <TextField 
                  label="Data da Compra"
                  placeholder="AAAA-MM-DD"
                  value={dataCompra}
                  onChangeText={setDataCompra}
                  error={errors.dataCompra}
                  leftIconName="calendar-today"
                />

                {/* Seletor de Categoria */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={styles.sectionLabel}>Categoria</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.categoriesGrid}>
                      {CATEGORIAS.map((cat) => (
                        <Pressable
                          key={cat.id}
                          onPress={() => setCategoriaId(cat.id)}
                          style={[
                            styles.categoryOption,
                            categoriaId === cat.id && styles.categoryOptionSelected,
                            { borderColor: cat.color },
                          ]}
                        >
                          <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}20` }]}>
                            <MaterialIcons name={cat.icon as any} size={20} color={cat.color} />
                          </View>
                          <Text style={[
                            styles.categoryLabel,
                            { color: categoriaId === cat.id ? theme.colors.text : theme.colors.textMuted }
                          ]}>
                            {cat.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Toggle Parcelado */}
                <View style={styles.toggleContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleLabel}>Parcelado</Text>
                    <Text style={styles.toggleHelper}>
                      Dividir em várias parcelas
                    </Text>
                  </View>
                  <Switch
                    value={parcelado}
                    onValueChange={setParcelado}
                    trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: theme.colors.primary }}
                    thumbColor={parcelado ? '#FFFFFF' : '#f4f3f4'}
                  />
                </View>

                {parcelado && (
                  <Animated.View style={{ opacity: 1 }}>
                    <TextField 
                      label="Número de Parcelas"
                      placeholder="Ex: 12"
                      value={numeroParcelas}
                      onChangeText={setNumeroParcelas}
                      keyboardType="number-pad"
                      maxLength={2}
                      error={errors.numeroParcelas}
                      leftIconName="format-list-numbered"
                    />
                    {numeroParcelas && !errors.numeroParcelas && (
                      <Text style={styles.parcelaPreview}>
                        {parseInt(numeroParcelas)}x de R$ {(parseFloat(valor.replace(/[^0-9.,]/g, "").replace(',', '.') || "0") / parseInt(numeroParcelas)).toFixed(2)}
                      </Text>
                    )}
                  </Animated.View>
                )}
              </ScrollView>

              {/* Footer */}
              <View style={[styles.footer, { padding: 24, paddingTop: 16 }]}>
                <AppButton 
                  title={parcelado ? "Adicionar Parcelado" : "Adicionar Gasto"}
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