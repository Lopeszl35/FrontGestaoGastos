import React, { useMemo, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "../../../../types/navigation";
import { useTheme } from "../../../../shared/theme/ThemeProvider";
import { spacing, typography, tokens } from "../../../../shared/theme";
import ScreenBackground from "../../../../shared/ui/components/layout/ScreenBackground";
import AuthBrandHeader from "../../../../shared/ui/components/branding/AuthBrandHeader";
import Card from "../../../../shared/ui/components/layout/Card";
import TextField from "../../../../shared/ui/components/form/TextField";
import PasswordField from "../../../../shared/ui/components/form/PasswordField";
import ProfileSelector from "../../../../shared/ui/components/form/ProfileSelector";
import AppButton from "../../../../shared/ui/components/buttons/AppButton";
import LinkButton from "../../../../shared/ui/components/buttons/LinkButton";
import { useRegisterController } from "../controllers/useRegisterController";
import type { AppTheme } from "../../../../shared/theme/themes";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const { state, actions, derived } = useRegisterController();

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const salaryRef = useRef<TextInput>(null);
  const balanceRef = useRef<TextInput>(null);

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <AuthBrandHeader
              title="Criar conta"
              subtitle="Comece pelo essencial. Você ajusta o resto quando quiser." 
            />
          </View>

          <Card style={styles.card}>
            {!!state.submitError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{state.submitError}</Text>
              </View>
            )}

            <Text style={styles.sectionLabel}>Dados</Text>

            <TextField
              label="Nome completo"
              value={state.fullName}
              onChangeText={actions.setFullName}
              error={state.errors.fullName ?? null}
              placeholder="Seu nome"
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

            <View style={{ height: spacing.md }} />
            <Text style={styles.sectionLabel}>Segurança</Text>

            <PasswordField
              ref={passRef}
              label="Senha"
              value={state.password}
              onChangeText={actions.setPassword}
              error={state.errors.password ?? null}
              placeholder="mínimo 8 caracteres"
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
            />

            <PasswordField
              ref={confirmRef}
              label="Confirmar senha"
              value={state.confirmPassword}
              onChangeText={actions.setConfirmPassword}
              error={state.errors.confirmPassword ?? null}
              placeholder="repita sua senha"
              returnKeyType="next"
              onSubmitEditing={() => salaryRef.current?.focus()}
            />

            <View style={{ height: spacing.md }} />
            <Text style={styles.sectionLabel}>Financeiro (opcional)</Text>

            <TextField
              ref={salaryRef}
              label="Salário mensal"
              value={state.salaryText}
              onChangeText={actions.setSalaryText}
              error={state.errors.salary ?? null}
              placeholder="ex.: 3500,00"
              keyboardType="numeric"
              leftIconName="attach-money"
              returnKeyType="next"
              onSubmitEditing={() => balanceRef.current?.focus()}
            />

            <TextField
              ref={balanceRef}
              label="Saldo inicial"
              value={state.initialBalanceText}
              onChangeText={actions.setInitialBalanceText}
              error={state.errors.initialBalance ?? null}
              placeholder="ex.: 1500,00"
              keyboardType="numeric"
              leftIconName="account-balance-wallet"
              returnKeyType="done"
              onSubmitEditing={actions.submit}
            />

            <View style={{ marginTop: spacing.md }}>
              <Text style={styles.sectionLabel}>Perfil de investimento</Text>
              <ProfileSelector value={state.financialProfile} onChange={actions.setFinancialProfile} />
            </View>

            <View style={{ marginTop: spacing.lg }}>
              <AppButton
                title={state.loading ? "Criando…" : "Criar conta"}
                onPress={actions.submit}
                loading={state.loading}
                disabled={!derived.canSubmit}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem conta?</Text>
              <LinkButton title="Entrar" onPress={() => navigation.navigate("Login")} />
            </View>
          </Card>

          <Text style={styles.disclaimer}>
            Use uma senha forte. Evite repetir senhas de outros serviços.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    kav: { flex: 1 },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    header: {
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    card: {
      padding: spacing.lg,
      borderRadius: tokens.radii.lg,
    },
    sectionLabel: {
      color: theme.colors.textSubtle,
      fontSize: typography.size.xs,
      fontWeight: "800",
      letterSpacing: 1.1,
      textTransform: "uppercase",
      marginBottom: spacing.sm,
    },
    errorBox: {
      backgroundColor: "rgba(255, 77, 109, 0.10)",
      borderColor: "rgba(255, 77, 109, 0.25)",
      borderWidth: 1,
      borderRadius: tokens.radii.md,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    errorText: {
      color: theme.colors.danger,
      fontSize: typography.size.sm,
      fontWeight: "700",
      lineHeight: 18,
    },
    footer: {
      marginTop: spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
    },
    footerText: {
      color: theme.colors.textMuted,
      fontSize: typography.size.sm,
      fontWeight: "600",
    },
    disclaimer: {
      marginTop: spacing.lg,
      textAlign: "center",
      color: theme.colors.textSubtle,
      fontSize: typography.size.xs,
      lineHeight: 16,
    },
  });
