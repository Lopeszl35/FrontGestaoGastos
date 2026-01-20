import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";
import AuthBrandHeader from "../../../../shared/ui/components/branding/AuthBrandHeader";
import type { AuthStackParamList } from "../../../../types/navigation";
import ScreenBackground from "../../../../shared/ui/components/layout/ScreenBackground";
import GlowCard from "../../../../shared/ui/components/layout/GlowCard";
import TextField from "../../../../shared/ui/components/form/TextField";
import PasswordField from "../../../../shared/ui/components/form/PasswordField";
import LinkButton from "../../../../shared/ui/components/buttons/LinkButton";
import AppButton from "../../../../shared/ui/components/buttons/AppButton";
import { useRegisterController } from "../controllers/useRegisterController";
import { styles } from "../../../../styles/screens/auth/registerStyles";
import { colors } from "../../../../shared/theme";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { state, actions, derived } = useRegisterController();

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const salaryRef = useRef<TextInput>(null);
  const balanceRef = useRef<TextInput>(null);

  return (
    <ScreenBackground>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.kav}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          scrollEnabled={true}
        >
          <View style={styles.header}>
              <AuthBrandHeader
                title="Bem-vindo ao Konta"
                subtitle="Creie sua conta e organize seu dinheiro com clareza desde o primeiro dia."
              />
            </View>
          <GlowCard>
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

            <TextField
              label="Salário (opcional)"
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
              label="Saldo inicial (opcional)"
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

            <Text style={styles.label}>Perfil financeiro</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={state.financialProfile}
                onValueChange={(v) => actions.setFinancialProfile(v)}
                dropdownIconColor={colors.textMuted}
                style={styles.picker}
              >
                <Picker.Item label="Conservador" value="CONSERVADOR" />
                <Picker.Item label="Moderado" value="MODERADO" />
                <Picker.Item label="Agressivo" value="AGRESSIVO" />
              </Picker>
            </View>
            <Text style={styles.helper}>Isso ajustará metas e sugestões no futuro.</Text>

            {!!state.submitError && <Text style={styles.formError}>{state.submitError}</Text>}

            <AppButton
              title={state.loading ? "Registrando…" : "Registrar"}
              onPress={actions.submit}
              disabled={!derived.canSubmit}
              loading={state.loading}
              variant="primary"
            />

            <LinkButton title="Já tenho conta" onPress={() => navigation.goBack()} />
          </GlowCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
