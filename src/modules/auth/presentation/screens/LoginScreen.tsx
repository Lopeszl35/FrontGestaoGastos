import React, { useMemo, useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  ScrollView,
  TextInput,
  View,
  Animated,
  Dimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import type { AuthStackParamList } from "../../../../types/navigation";
import { useLoginController } from "../controllers/useLoginController";

import ScreenBackground from "../../../../shared/ui/components/layout/ScreenBackground";
import AuthBrandHeader from "../../../../shared/ui/components/branding/AuthBrandHeader";
import TextField from "../../../../shared/ui/components/form/TextField";
import PasswordField from "../../../../shared/ui/components/form/PasswordField";
import LinkButton from "../../../../shared/ui/components/buttons/LinkButton";
import AppButton from "../../../../shared/ui/components/buttons/AppButton";

import { useTheme } from "../../../../shared/theme/ThemeProvider";
import { makeLoginStyles } from "../../../../styles/screens/auth/loginStyles";

const { height } = Dimensions.get("window");

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { state, actions, derived } = useLoginController();
  const { theme } = useTheme();
  const styles = useMemo(() => makeLoginStyles(theme), [theme]);

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  // Animações de entrada
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;

  // Partículas flutuantes (decorativas)
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada da tela
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

    // Animação contínua das partículas
    const animateParticles = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle1Y, {
            toValue: -30,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(particle1Y, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(particle2Y, {
            toValue: -40,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(particle2Y, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(particle3Y, {
            toValue: -25,
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(particle3Y, {
            toValue: 0,
            duration: 3500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateParticles();
  }, []);

  return (
    <ScreenBackground>
      {/* Partículas decorativas flutuantes */}
      <Animated.View
        style={[
          styles.particle,
          styles.particle1,
          { transform: [{ translateY: particle1Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle2,
          { transform: [{ translateY: particle2Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle3,
          { transform: [{ translateY: particle3Y }] },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
        >
          {/* Header com animação */}
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
              title="Bem-vindo de volta"
              subtitle="Entre para acompanhar sua evolução financeira com clareza e controle."
            />
          </Animated.View>

          {/* Card principal com glassmorphism */}
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

                  {!!state.submitError && (
                    <Animated.View style={{ opacity: fadeIn }}>
                      <View style={styles.errorBox}>
                        <Text style={styles.formError}>⚠️ {state.submitError}</Text>
                      </View>
                    </Animated.View>
                  )}

                  <View style={styles.buttonContainer}>
                    <AppButton
                      title={state.loading ? "Entrando…" : "Entrar"}
                      onPress={actions.submit}
                      disabled={!derived.canSubmit}
                      loading={state.loading}
                      variant="primary"
                    />
                  </View>

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <View style={styles.links}>
                    <LinkButton
                      title="Esqueci minha senha"
                      onPress={() => {}}
                      align="center"
                    />
                    <View style={styles.registerPrompt}>
                      <Text style={styles.registerText}>Não tem conta? </Text>
                      <LinkButton
                        title="Criar conta grátis"
                        onPress={() => navigation.navigate("Register")}
                        align="center"
                      />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Footer hint */}
          <Animated.View style={{ opacity: fadeIn }}>
            <Text style={styles.hint}>
              🔒 Segurança e controle para suas finanças — sempre.
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}