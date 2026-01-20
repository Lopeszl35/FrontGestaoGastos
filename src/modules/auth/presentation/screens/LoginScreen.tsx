import React, { useMemo, useRef } from "react";
import { KeyboardAvoidingView, Platform, Text, ScrollView, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "../../../../types/navigation";
import { useLoginController } from "../controllers/useLoginController";

import ScreenBackground from "../../../../shared/ui/components/layout/ScreenBackground";
import GlowCard from "../../../../shared/ui/components/layout/GlowCard";
import AuthBrandHeader from "../../../../shared/ui/components/branding/AuthBrandHeader";

import TextField from "../../../../shared/ui/components/form/TextField";
import PasswordField from "../../../../shared/ui/components/form/PasswordField";
import LinkButton from "../../../../shared/ui/components/buttons/LinkButton";
import AppButton from "../../../../shared/ui/components/buttons/AppButton";

import { useTheme } from "../../../../shared/theme/ThemeProvider";
import { makeLoginStyles } from "../../../../styles/screens/auth/loginStyles";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { state, actions, derived } = useLoginController();
  const { theme } = useTheme();

  const styles = useMemo(() => makeLoginStyles(theme), [theme]);

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  return (
    <ScreenBackground>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.kav}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <AuthBrandHeader
              title="Bem-vindo de volta"
              subtitle="Entre para acompanhar sua evolução financeira com clareza e controle."
            />
          </View>

          <GlowCard>
            <TextField
              label="E-mail"
              value={state.email}
              onChangeText={actions.setEmail}
              error={state.errors.email ?? null}
              placeholder="voce@exemplo.com"
              keyboardType="email-address"
              leftIconName="email"
              ref={emailRef}
              returnKeyType="next"
              onSubmitEditing={() => passRef.current?.focus()}
            />

            <PasswordField
              label="Senha"
              value={state.password}
              onChangeText={actions.setPassword}
              error={state.errors.password ?? null}
              placeholder="mínimo 8 caracteres"
              ref={passRef}
              returnKeyType="done"
              onSubmitEditing={actions.submit}
            />

            {!!state.submitError && <Text style={styles.formError}>{state.submitError}</Text>}

            <AppButton
              title={state.loading ? "Entrando…" : "Entrar"}
              onPress={actions.submit}
              disabled={!derived.canSubmit}
              loading={state.loading}
              variant="primary"
            />
''
            <View style={styles.links}>
              <LinkButton title="Esqueci minha senha" onPress={() => {}} />
              <LinkButton title="Criar conta" onPress={() => navigation.navigate("Register")} />
            </View>
          </GlowCard>

          <Text style={styles.hint}>Segurança e controle para suas finanças — sempre.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
