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
import AppButton from "../../../../shared/ui/components/buttons/AppButton";
import LinkButton from "../../../../shared/ui/components/buttons/LinkButton";
import { useLoginController } from "../controllers/useLoginController";
import type { AppTheme } from "../../../../shared/theme/themes";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const { state, actions, derived } = useLoginController();

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

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
              title="Entrar"
              subtitle="Controle seu dinheiro com clareza e uma experiência suave." 
            />
          </View>

          <Card style={styles.card}>
            {!!state.submitError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{state.submitError}</Text>
              </View>
            )}

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

            <PasswordField
              ref={passRef}
              label="Senha"
              value={state.password}
              onChangeText={actions.setPassword}
              error={state.errors.password ?? null}
              placeholder="Sua senha"
              returnKeyType="done"
              onSubmitEditing={actions.submit}
            />

            <View style={{ marginTop: spacing.lg }}>
              <AppButton
                title={state.loading ? "Entrando…" : "Entrar"}
                onPress={actions.submit}
                loading={state.loading}
                disabled={!derived.canSubmit}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Ainda não tem conta?</Text>
              <LinkButton title="Criar conta" onPress={() => navigation.navigate("Register")} />
            </View>
          </Card>

          <Text style={styles.disclaimer}>
            Ao continuar, você concorda com o uso responsável do app e com boas práticas de segurança.
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
