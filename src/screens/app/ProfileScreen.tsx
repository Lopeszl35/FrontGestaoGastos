import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../shared/theme/ThemeProvider";
import { spacing, typography, tokens } from "../../shared/theme";
import { useAuthSession } from "../../shared/auth/AuthSessionContext";
import TextField from "../../shared/ui/components/form/TextField";
import ProfileSelector from "../../shared/ui/components/form/ProfileSelector";
import Card from "../../shared/ui/components/layout/Card";
import AppButton from "../../shared/ui/components/buttons/AppButton";
import SuccessOverlay from "../../shared/ui/components/feedback/SuccessOverlay";

import { parseNumberLoose } from "../../shared/utils/number";
import type { FinancialProfile } from "../../types/auth";
import { makeUserRepository } from "../../modules/user/infra/factories/makeUserRepository";
import { GetUserSaldoUseCase } from "../../modules/user/application/usecases/GetUserSaldoUseCase";
import { UpdateUserSaldoUseCase } from "../../modules/user/application/usecases/UpdateUserSaldoUseCase";
import { UpdateUserUseCase } from "../../modules/user/application/usecases/UpdateUserUseCase";
import { mapProfileToBackend } from "../../shared/utils/financialProfile";
import type { AppTheme } from "../../shared/theme/themes";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const session = useAuthSession();

  const repo = useMemo(() => makeUserRepository(), []);
  const getSaldoUC = useMemo(() => new GetUserSaldoUseCase(repo), [repo]);
  const updateSaldoUC = useMemo(() => new UpdateUserSaldoUseCase(repo), [repo]);
  const updateUserUC = useMemo(() => new UpdateUserUseCase(repo), [repo]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const [nome, setNome] = useState(session.user?.nome ?? "");
  const [saldoText, setSaldoText] = useState(
    typeof session.user?.saldo_atual === "number" ? String(session.user?.saldo_atual) : ""
  );
  const [perfil, setPerfil] = useState<FinancialProfile>(session.user?.perfil_financeiro ?? "MODERADO");

  const original = useMemo(
    () => ({
      nome: session.user?.nome ?? "",
      saldo_atual: session.user?.saldo_atual ?? null,
      perfil_financeiro: session.user?.perfil_financeiro ?? "MODERADO",
    }),
    [session.user]
  );

  const userId = useMemo(() => {
    const u: any = session.user;
    const raw = u?.id_usuario ?? u?.id;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [session.user]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!session.token) return;
        const res = await getSaldoUC.execute(session.token);
        if (!mounted) return;
        if (typeof res?.saldo_atual === "number") {
          setSaldoText(String(res.saldo_atual));
          session.updateUser({ saldo_atual: res.saldo_atual } as any);
        }
      } catch (err: any) {
        // não bloqueia a tela; mantém valor do contexto
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [session.token]);

  const canSave = useMemo(() => {
    if (!session.token || !userId) return false;

    const saldoParsed = parseNumberLoose(saldoText);
    const saldoChanged =
      saldoParsed !== null &&
      (original.saldo_atual === null ? true : Math.abs(saldoParsed - (original.saldo_atual ?? 0)) > 0.0001);

    const nomeChanged = nome.trim() && nome.trim() !== original.nome;
    const perfilChanged = perfil !== original.perfil_financeiro;

    return (saldoChanged || nomeChanged || perfilChanged) && !saving;
  }, [session.token, userId, saldoText, nome, perfil, original, saving]);

  async function onSave() {
    if (!session.token || !userId) {
      Alert.alert("Sessão inválida", "Faça login novamente.");
      session.logout();
      return;
    }

    const nomeTrim = nome.trim();
    if (!nomeTrim) {
      Alert.alert("Nome obrigatório", "Informe seu nome.");
      return;
    }

    const saldoParsed = parseNumberLoose(saldoText);
    if (saldoText.trim() && saldoParsed === null) {
      Alert.alert("Saldo inválido", "Digite um valor numérico válido.");
      return;
    }

    setSaving(true);
    try {
      const requests: Promise<any>[] = [];

      const nomeChanged = nomeTrim !== original.nome;
      const perfilChanged = perfil !== original.perfil_financeiro;
      if (nomeChanged || perfilChanged) {
        requests.push(
          updateUserUC.execute(session.token, userId, {
            ...(nomeChanged ? { nome: nomeTrim } : {}),
            ...(perfilChanged ? { perfil_financeiro: mapProfileToBackend(perfil) } : {}),
          })
        );
      }

      if (saldoParsed !== null) {
        const saldoChanged =
          original.saldo_atual === null ? true : Math.abs(saldoParsed - (original.saldo_atual ?? 0)) > 0.0001;
        if (saldoChanged) {
          requests.push(updateSaldoUC.execute(session.token, saldoParsed));
        }
      }

      await Promise.all(requests);

      // Atualiza contexto
      session.updateUser({
        nome: nomeTrim,
        perfil_financeiro: perfil,
        ...(saldoParsed !== null ? { saldo_atual: saldoParsed } : {}),
      } as any);

      setSuccessVisible(true);
    } catch (err: any) {
      Alert.alert("Erro", err?.message ?? "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <View style={styles.loadingWrap}><Text style={styles.loadingText}>Carregando…</Text></View>;
  }

  return (
    <View style={styles.full}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
          <Text style={styles.subtitle}>Ajuste seu saldo, nome e perfil de investimento.</Text>
        </View>

        <Card style={styles.card}>
          <TextField
            label="Nome"
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
            leftIconName="person"
          />

          <TextField
            label="Saldo atual"
            value={saldoText}
            onChangeText={setSaldoText}
            placeholder="ex.: 2500,00"
            keyboardType="numeric"
            leftIconName="account-balance-wallet"
          />

          <View style={{ marginTop: spacing.md }}>
            <Text style={styles.sectionLabel}>Perfil de investimento</Text>
            <ProfileSelector value={perfil} onChange={setPerfil} />
          </View>

          <View style={{ marginTop: spacing.lg }}>
            <AppButton title="Salvar" onPress={onSave} loading={saving} disabled={!canSave} />
          </View>
        </Card>
      </ScrollView>

      <SuccessOverlay
        visible={successVisible}
        title="Atualizado"
        message="Suas preferências foram salvas."
        onDismiss={() => setSuccessVisible(false)}
      />
    </View>
  );
}


const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    full: {
      flex: 1,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    header: {
      marginBottom: spacing.md,
    },
    title: {
      color: theme.colors.text,
      fontSize: typography.size.xl,
      fontWeight: "800",
      letterSpacing: 0.2,
    },
    subtitle: {
      marginTop: 6,
      color: theme.colors.textMuted,
      fontSize: typography.size.sm,
      lineHeight: 18,
    },
    sectionLabel: {
      color: theme.colors.textMuted,
      fontSize: typography.size.xs,
      fontWeight: "700",
      marginBottom: spacing.sm,
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },
    card: {
      padding: spacing.lg,
      borderRadius: tokens.radii.lg,
    },
    loadingWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      color: theme.colors.textMuted,
      fontSize: typography.size.md,
      fontWeight: "600",
    },
  });
