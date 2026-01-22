import React, { useRef, useEffect, useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  Animated,
  Pressable,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

import AuthBrandHeader from "../../../../shared/ui/components/branding/AuthBrandHeader";
import type { AuthStackParamList } from "../../../../types/navigation";
import ScreenBackground from "../../../../shared/ui/components/layout/ScreenBackground";
import TextField from "../../../../shared/ui/components/form/TextField";
import PasswordField from "../../../../shared/ui/components/form/PasswordField";
import LinkButton from "../../../../shared/ui/components/buttons/LinkButton";
import AppButton from "../../../../shared/ui/components/buttons/AppButton";
import { useRegisterController } from "../controllers/useRegisterController";
import { makeRegisterStyles } from "../../../../styles/screens/auth/registerStyles";
import { useTheme } from "../../../../shared/theme/ThemeProvider";
import type { FinancialProfile } from "../../../../types/auth";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const PROFILE_OPTIONS: { value: FinancialProfile; label: string; icon: string; color: string }[] = [
  { value: "CONSERVADOR", label: "Conservador", icon: "shield", color: "#4A90E2" },
  { value: "MODERADO", label: "Moderado", icon: "balance", color: "#7B68EE" },
  { value: "AGRESSIVO", label: "Agressivo", icon: "trending-up", color: "#FF6B6B" },
];

export default function RegisterScreen({ navigation }: Props) {
  const { state, actions, derived } = useRegisterController();
  const { theme } = useTheme();
  const styles = useMemo(() => makeRegisterStyles(theme), [theme]);

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const salaryRef = useRef<TextInput>(null);
  const balanceRef = useRef<TextInput>(null);

  // Animações
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  // Calcula progresso do formulário
  const calculateProgress = () => {
    let filled = 0;
    const total = 6;

    if (state.fullName.trim()) filled++;
    if (state.email.trim()) filled++;
    if (state.password) filled++;
    if (state.confirmPassword) filled++;
    if (state.salaryText || state.initialBalanceText) filled++;
    filled++; // perfil sempre tem valor

    return (filled / total) * 100;
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideUp, {
        toValue: 0,
        useNativeDriver: true,
        speed: 8,
        bounciness: 10,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 10,
        bounciness: 8,
        delay: 200,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const progress = calculateProgress();
    Animated.timing(progressWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [state]);

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          scrollEnabled={true}
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeIn,
                transform: [{ translateY: slideUp }],
              },
            ]}
          >
            <AuthBrandHeader
              title="Bem-vindo ao Konta"
              subtitle="Crie sua conta e organize seu dinheiro com clareza desde o primeiro dia."
            />
          </Animated.View>

          {/* Barra de progresso */}
          <Animated.View
            style={[styles.progressContainer, { opacity: fadeIn }]}
          >
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(calculateProgress())}% completo
            </Text>
          </Animated.View>

          {/* Card principal */}
          <Animated.View
            style={{
              opacity: fadeIn,
              transform: [{ scale: cardScale }],
            }}
          >
            <View style={styles.cardGlow} />
            <View style={styles.card}>
              <LinearGradient
                colors={[
                  "rgba(0, 0, 0, 0.95)",
                  "rgb(0, 0, 0)",
                ]}
                style={styles.cardGradient}
              >
                <View style={styles.cardInner}>
                  {/* Seção: Informações Básicas */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <MaterialIcons name="person" size={20} color={theme.colors.primary} />
                      <Text style={styles.sectionTitle}>Informações Básicas</Text>
                    </View>

                    <TextField
                      label="Nome completo"
                      value={state.fullName}
                      onChangeText={actions.setFullName}
                      error={state.errors.fullName ?? null}
                      placeholder="Seu nome e sobrenome"
                      leftIconName="person"
                      ref={nameRef}
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                    />

                    <TextField
                      label="E-mail"
                      value={state.email}
                      onChangeText={actions.setEmail}
                      error={state.errors.email ?? null}
                      placeholder="voce@exemplo.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      leftIconName="email"
                      ref={emailRef}
                      returnKeyType="next"
                      onSubmitEditing={() => passRef.current?.focus()}
                    />
                  </View>

                  {/* Seção: Segurança */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <MaterialIcons name="lock" size={20} color={theme.colors.primary} />
                      <Text style={styles.sectionTitle}>Segurança</Text>
                    </View>

                    <PasswordField
                      label="Senha"
                      value={state.password}
                      onChangeText={actions.setPassword}
                      error={state.errors.password ?? null}
                      placeholder="mínimo 8 caracteres"
                      ref={passRef}
                      returnKeyType="next"
                      onSubmitEditing={() => confirmRef.current?.focus()}
                    />

                    <PasswordField
                      label="Confirmar senha"
                      value={state.confirmPassword}
                      onChangeText={actions.setConfirmPassword}
                      error={state.errors.confirmPassword ?? null}
                      placeholder="repita sua senha"
                      ref={confirmRef}
                      returnKeyType="next"
                      onSubmitEditing={() => salaryRef.current?.focus()}
                    />
                  </View>

                  {/* Seção: Dados Financeiros */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <MaterialIcons name="account-balance-wallet" size={20} color={theme.colors.primary} />
                      <Text style={styles.sectionTitle}>Dados Financeiros</Text>
                      <Text style={styles.sectionBadge}>Opcional</Text>
                    </View>

                    <TextField
                      label="Salário mensal"
                      value={state.salaryText}
                      onChangeText={actions.setSalaryText}
                      error={state.errors.salary ?? null}
                      placeholder="ex.: 3500,00"
                      keyboardType="numeric"
                      leftIconName="attach-money"
                      ref={salaryRef}
                      returnKeyType="next"
                      onSubmitEditing={() => balanceRef.current?.focus()}
                    />

                    <TextField
                      label="Saldo inicial"
                      value={state.initialBalanceText}
                      onChangeText={actions.setInitialBalanceText}
                      error={state.errors.initialBalance ?? null}
                      placeholder="ex.: 1200,00"
                      keyboardType="numeric"
                      leftIconName="account-balance"
                      ref={balanceRef}
                      returnKeyType="done"
                      onSubmitEditing={actions.submit}
                    />
                  </View>

                  {/* Seção: Perfil Financeiro */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <MaterialIcons name="psychology" size={20} color={theme.colors.primary} />
                      <Text style={styles.sectionTitle}>Perfil Financeiro</Text>
                    </View>

                    <View style={styles.profileCards}>
                      {PROFILE_OPTIONS.map((option) => (
                        <Pressable
                          key={option.value}
                          onPress={() => actions.setFinancialProfile(option.value)}
                          style={[
                            styles.profileCard,
                            state.financialProfile === option.value && styles.profileCardActive,
                          ]}
                        >
                          <View
                            style={[
                              styles.profileIconContainer,
                              { backgroundColor: `${option.color}20` },
                            ]}
                          >
                            <MaterialIcons
                              name={option.icon as any}
                              size={24}
                              color={option.color}
                            />
                          </View>
                          <Text style={styles.profileLabel}>{option.label}</Text>
                          {state.financialProfile === option.value && (
                            <View style={styles.profileCheck}>
                              <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
                            </View>
                          )}
                        </Pressable>
                      ))}
                    </View>
                    <Text style={styles.helper}>
                      💡 Isso ajustará metas e sugestões personalizadas no futuro.
                    </Text>
                  </View>

                  {/* Error global */}
                  {!!state.submitError && (
                    <View style={styles.errorBox}>
                      <MaterialIcons name="error-outline" size={20} color={theme.colors.danger} />
                      <Text style={styles.formError}>{state.submitError}</Text>
                    </View>
                  )}

                  {/* Botão de registro */}
                  <View style={styles.buttonContainer}>
                    <AppButton
                      title={state.loading ? "Criando conta…" : "Criar minha conta"}
                      onPress={actions.submit}
                      disabled={!derived.canSubmit}
                      loading={state.loading}
                      variant="primary"
                    />
                  </View>

                  {/* Link voltar */}
                  <View style={styles.backContainer}>
                    <Text style={styles.backText}>Já tem conta? </Text>
                    <LinkButton
                      title="Fazer login"
                      onPress={() => navigation.goBack()}
                      align="center"
                    />
                  </View>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Espaçamento extra */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
