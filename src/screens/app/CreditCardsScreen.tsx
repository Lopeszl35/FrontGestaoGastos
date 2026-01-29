// src/screens/app/CreditCardsScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "../../shared/theme/ThemeProvider";
import { useAuthSession } from "../../shared/auth/AuthSessionContext";
import { creditCardsService } from "../../services/creditCardsService";

import type {
  CreditCardsOverview,
  CreditCardOverviewItem,
  CreditCardDetails,
  CreditCard, // do endpoint /cartoes
} from "../../types/creditCard";

// Modais (mantém os teus)
import AddCardModal from "../../shared/ui/components/creditCards/AddCardModal";
import EditCardModal from "../../shared/ui/components/creditCards/EditCardModal";
import DeleteCardModal from "../../shared/ui/components/creditCards/DeleteCardModal";
import AddExpenseModal from "../../shared/ui/components/creditCards/AddExpenseModal";
import PayInvoiceModal from "../../shared/ui/components/creditCards/PayInvoiceModal";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatBRL(value: number) {
  return (value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function CreditCardsScreen() {
  const { theme } = useTheme();
  const { user, token } = useAuthSession();

  // ✅ normalize token: service aceita string|undefined, então nunca passe null
  const authToken = token ?? undefined;

  const userId = (user as any)?.id_usuario ?? (user as any)?.id;

  const now = useMemo(() => new Date(), []);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // lista “seca” do /cartoes (serve para pegar uuid garantido)
  const [rawCards, setRawCards] = useState<CreditCard[]>([]);

  // overview (lista rica + detalhes)
  const [overview, setOverview] = useState<CreditCardsOverview | null>(null);
  const [cards, setCards] = useState<CreditCardOverviewItem[]>([]);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  // ✅ detalhes só aparecem quando o usuário selecionar um cartão
  const [hasUserSelectedCard, setHasUserSelectedCard] = useState(false);

  const [details, setDetails] = useState<CreditCardDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modais
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] = useState(false);
  const [isPayInvoiceModalVisible, setIsPayInvoiceModalVisible] = useState(false);

  const selectedCard = useMemo(() => {
    if (!selectedUuid) return null;
    return cards.find((c) => c.uuid_cartao === selectedUuid) ?? null;
  }, [cards, selectedUuid]);

  /**
   * 1) Sempre buscar /cartoes primeiro (para ter uuid garantido)
   * 2) Depois chamar overview usando um uuid válido
   *
   * IMPORTANT: aqui a função SEMPRE resolve um uuid válido para chamar o overview.
   * O "detalhe visível" é controlado pela flag hasUserSelectedCard.
   */
  const loadAllThenOverview = useCallback(
    async (opts?: {
      ano?: number;
      mes?: number;
      preferredUuid?: string | null;
      keepDetailsVisibility?: boolean; // não mexe na flag do usuário
    }) => {
      if (!userId) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const ano = opts?.ano ?? selectedYear;
      const mes = opts?.mes ?? selectedMonth;

      try {
        // ✅ STEP 1: pega todos os cartões (uuid garantido)
        const all = await creditCardsService.getAllCards(userId, authToken);
        setRawCards(all);

        const firstUuid = all?.[0]?.uuid_cartao ?? null;

        if (!firstUuid) {
          // usuário não tem cartões → tela vazia
          setOverview(null);
          setCards([]);
          setSelectedUuid(null);
          setDetails(null);
          // se não pediu para manter, reseta
          if (!opts?.keepDetailsVisibility) setHasUserSelectedCard(false);
          return;
        }

        // resolve uuid alvo: preferred (se existir) senão primeiro
        const preferredUuid = opts?.preferredUuid ?? null;
        const hasPreferred = preferredUuid
          ? all.some((c) => c.uuid_cartao === preferredUuid)
          : false;

        const targetUuid = hasPreferred ? (preferredUuid as string) : firstUuid;

        // ✅ STEP 2: chama overview com uuid válido
        const data = await creditCardsService.getCardsOverview(
          userId,
          ano,
          mes,
          targetUuid,
          authToken
        );

        setOverview(data);

        // normaliza para UI
        const normalized: CreditCardOverviewItem[] = (data.cartoes ?? []).map((c) => ({
          ...c,
          bandeira: c.bandeira ?? "Outro",
          ultimos4: c.ultimos4 ?? "",
          corHex: c.corHex ?? theme.colors.primary,
        }));

        setCards(normalized);

        const nextSelected =
          data.cartaoSelecionadoUuid ??
          targetUuid ??
          normalized?.[0]?.uuid_cartao ??
          null;

        setSelectedUuid(nextSelected);

        // detalhes vêm junto do overview — mas só serão renderizados quando hasUserSelectedCard === true
        setDetails(data.detalhes ?? null);

        // Não alterar visibilidade do detalhe (a tela decide)
        if (!opts?.keepDetailsVisibility) {
          // No load inicial, isso mantém detalhes escondidos até o usuário clicar.
          // Em ações internas (refresh, mês/ano), normalmente queremos manter o que o usuário escolheu.
          setHasUserSelectedCard(false);
        }
      } catch (e) {
        console.error("❌ [CreditCards] loadAllThenOverview error:", e);
        setOverview(null);
        setCards([]);
        setSelectedUuid(null);
        setDetails(null);
        if (!opts?.keepDetailsVisibility) setHasUserSelectedCard(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId, authToken, selectedMonth, selectedYear, theme.colors.primary]
  );

  useEffect(() => {
    setLoading(true);
    // ✅ load inicial: pega overview mas NÃO exibe detalhes até clique do usuário
    loadAllThenOverview({
      ano: selectedYear,
      mes: selectedMonth,
      preferredUuid: null,
      keepDetailsVisibility: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // ✅ refresh mantém a decisão do usuário (se ele já abriu detalhes, continua abrindo)
    loadAllThenOverview({
      ano: selectedYear,
      mes: selectedMonth,
      preferredUuid: selectedUuid,
      keepDetailsVisibility: true,
    });
  }, [loadAllThenOverview, selectedMonth, selectedYear, selectedUuid]);

  const handleSelectCard = useCallback(
    async (uuid: string) => {
      setHasUserSelectedCard(true); // ✅ só aqui os detalhes ficam visíveis
      setSelectedUuid(uuid);
      setDetailsLoading(true);
      await loadAllThenOverview({
        ano: selectedYear,
        mes: selectedMonth,
        preferredUuid: uuid,
        keepDetailsVisibility: true,
      });
      setDetailsLoading(false);
    },
    [loadAllThenOverview, selectedMonth, selectedYear]
  );

  // UI simples: avança 1 mês (você pode trocar por BottomSheet real depois)
  const handleMonthPicker = useCallback(() => {
    Alert.alert(
      "Selecionar mês",
      "Implemente aqui um bottom sheet/selector. Por ora, vou avançar 1 mês.",
      [
        {
          text: "OK",
          onPress: async () => {
            const next = selectedMonth === 12 ? 1 : selectedMonth + 1;
            const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;

            setSelectedMonth(next);
            setSelectedYear(nextYear);

            setDetailsLoading(true);
            await loadAllThenOverview({
              ano: nextYear,
              mes: next,
              preferredUuid: selectedUuid,
              keepDetailsVisibility: true, // mantém se o usuário já abriu
            });
            setDetailsLoading(false);
          },
        },
      ]
    );
  }, [loadAllThenOverview, selectedMonth, selectedYear, selectedUuid]);

  const totals = useMemo(() => {
    const limiteTotal = cards.reduce((acc, c) => acc + (c.limiteTotal ?? 0), 0);
    const limiteUsado = cards.reduce((acc, c) => acc + (c.limiteUsado ?? 0), 0);
    return { limiteTotal, limiteUsado };
  }, [cards]);

  const valorFatura = details?.gastosDoMes?.total ?? 0;
  const mesAno = `${MESES[selectedMonth - 1]} ${selectedYear}`;

  const selectedIsActive =
    details?.resumoCartao?.ativo ?? selectedCard?.ativo ?? true;

  const toggleCardStatus = useCallback(async () => {
    if (!userId || !selectedUuid) return;

    try {
      await creditCardsService.toggleCardStatus(
        userId,
        selectedUuid,
        !selectedIsActive,
        authToken
      );

      Alert.alert(
        "Sucesso",
        !selectedIsActive ? "Cartão ativado" : "Cartão desativado"
      );

      setDetailsLoading(true);
      await loadAllThenOverview({
        ano: selectedYear,
        mes: selectedMonth,
        preferredUuid: selectedUuid,
        keepDetailsVisibility: true,
      });
      setDetailsLoading(false);
    } catch (e) {
      console.error("toggleCardStatus error:", e);
      Alert.alert("Erro", "Não foi possível alterar o status do cartão.");
    }
  }, [
    userId,
    selectedUuid,
    selectedIsActive,
    authToken,
    loadAllThenOverview,
    selectedMonth,
    selectedYear,
  ]);

  // ====== UI ======

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.bg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={{
            marginTop: 10,
            color: theme.colors.textMuted,
            fontWeight: "600",
          }}
        >
          Carregando cartões...
        </Text>
      </View>
    );
  }

  // ✅ sem cartões (rawCards é a fonte de verdade)
  if (!rawCards || rawCards.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.bg,
          padding: 18,
          justifyContent: "center",
        }}
      >
        <View style={{ alignItems: "center", gap: 14 }}>
          <View
            style={{ width: 110, height: 110, borderRadius: 26, overflow: "hidden" }}
          >
            <LinearGradient
              colors={[theme.colors.primary + "40", theme.colors.primary + "10"]}
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <MaterialIcons
                name="credit-card"
                size={62}
                color={theme.colors.primary}
              />
            </LinearGradient>
          </View>

          <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "800" }}>
            Comece pelos seus cartões
          </Text>
          <Text
            style={{
              color: theme.colors.textMuted,
              fontSize: 13,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Adicione seu primeiro cartão e o Konta monta automaticamente sua visão mensal.
          </Text>

          <Pressable
            onPress={() => setIsAddModalVisible(true)}
            style={{ marginTop: 8 }}
          >
            <LinearGradient
              colors={theme.colors.gradients.button}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 18,
                borderRadius: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <MaterialIcons name="add-circle" size={22} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                Adicionar cartão
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        <AddCardModal
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onSuccess={async () => {
            setDetailsLoading(true);
            await loadAllThenOverview({
              ano: selectedYear,
              mes: selectedMonth,
              preferredUuid: null,
              keepDetailsVisibility: false,
            });
            setDetailsLoading(false);
          }}
        />
      </View>
    );
  }

  const showDetails = hasUserSelectedCard && !!selectedUuid;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <View>
            <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "900" }}>
              Cartões de Crédito
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontSize: 12,
                fontWeight: "600",
                marginTop: 3,
              }}
            >
              Gerencie seus cartões
            </Text>
          </View>

          <Pressable onPress={() => setIsAddModalVisible(true)}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View> 
                <MaterialIcons name="add" size={22} color={theme.colors.accent} backgroundColor={theme.colors.accent} />
                <Text style={{ color: theme.colors.accent, fontSize: 10, fontWeight: "700" }}>novo cartão</Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* TOTAIS */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: 12,
            }}
          >
            <Text style={{ color: theme.colors.textMuted, fontSize: 11, fontWeight: "700" }}>
              Total Limite
            </Text>
            <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "900", marginTop: 6 }}>
              {formatBRL(totals.limiteTotal)}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: 12,
            }}
          >
            <Text style={{ color: theme.colors.textMuted, fontSize: 11, fontWeight: "700" }}>
              Total Usado
            </Text>
            <Text style={{ color: theme.colors.danger, fontSize: 14, fontWeight: "900", marginTop: 6 }}>
              {formatBRL(totals.limiteUsado)}
            </Text>
          </View>
        </View>

        {/* LISTA DE CARTÕES */}
        <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "900", marginBottom: 10 }}>
          Seus Cartões
        </Text>

        <View style={{ gap: 10 }}>
          {cards.map((c) => {
            const isSelected = c.uuid_cartao === selectedUuid;
            const cardColor = c.corHex || theme.colors.primary;
            const perc = Math.max(0, Math.min(100, c.percentualUsado ?? 0));

            return (
              <Pressable key={c.uuid_cartao} onPress={() => handleSelectCard(c.uuid_cartao)}>
                <LinearGradient
                  colors={[cardColor, `${cardColor}DD`]}
                  style={{
                    borderRadius: 18,
                    padding: 14,
                    borderWidth: isSelected ? 1 : 0,
                    borderColor: isSelected ? "rgba(255,255,255,0.35)" : "transparent",
                    overflow: "hidden",
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 12,
                          backgroundColor: "rgba(255,255,255,0.18)",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialIcons name="credit-card" size={18} color="#fff" />
                      </View>

                      <View>
                        <Text style={{ color: "#fff", fontWeight: "900", fontSize: 14 }}>{c.nome}</Text>
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.85)",
                            fontWeight: "700",
                            fontSize: 11,
                            marginTop: 2,
                          }}
                        >
                          •••• {c.ultimos4}
                        </Text>
                      </View>
                    </View>

                    <Text style={{ color: "rgba(255,255,255,0.95)", fontWeight: "900", fontSize: 12 }}>
                      {(c.bandeira ?? "Outro").toUpperCase()}
                    </Text>
                  </View>

                  <View style={{ marginTop: 12 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ color: "rgba(255,255,255,0.85)", fontWeight: "800", fontSize: 11 }}>
                        Limite usado
                      </Text>
                      <Text style={{ color: "rgba(255,255,255,0.95)", fontWeight: "900", fontSize: 11 }}>
                        {perc}%
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 6,
                        backgroundColor: "rgba(255,255,255,0.18)",
                        borderRadius: 10,
                        marginTop: 8,
                      }}
                    >
                      <View
                        style={{
                          height: 6,
                          width: `${perc}%`,
                          borderRadius: 10,
                          backgroundColor: "rgba(255,255,255,0.95)",
                        }}
                      />
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                      <Text style={{ color: "#fff", fontWeight: "900", fontSize: 12 }}>
                        {formatBRL(c.limiteUsado)}
                      </Text>
                      <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: "900", fontSize: 12 }}>
                        {formatBRL(c.limiteTotal)}
                      </Text>
                    </View>
                  </View>

                  {isSelected && selectedIsActive === false && (
                    <View
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 999,
                        backgroundColor: "rgba(0,0,0,0.35)",
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "900", fontSize: 11 }}>Inativo</Text>
                    </View>
                  )}
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>

        {/* ✅ DETALHES SÓ QUANDO O USUÁRIO SELECIONAR UM CARTÃO */}
        {showDetails ? (
          <View style={{ marginTop: 16 }}>
            {/* HEADER DETALHES */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "900" }}>
                {selectedCard?.nome ?? details?.resumoCartao?.nome ?? "Detalhes do cartão"}
              </Text>

              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable
                  onPress={() => setIsEditModalVisible(true)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="edit" size={18} color={theme.colors.text} />
                </Pressable>

                <Pressable
                  onPress={toggleCardStatus}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons
                    name={selectedIsActive ? "visibility-off" : "visibility"}
                    size={18}
                    color={selectedIsActive ? theme.colors.warning : theme.colors.success}
                  />
                </Pressable>

                <Pressable
                  onPress={() => setIsDeleteModalVisible(true)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="delete" size={18} color={theme.colors.danger} />
                </Pressable>
              </View>
            </View>

            {/* Card grande do cartão selecionado */}
            <View style={{ borderRadius: 18, overflow: "hidden" }}>
              <LinearGradient
                colors={[
                  details?.resumoCartao?.corHex ??
                    selectedCard?.corHex ??
                    theme.colors.primary,
                  (details?.resumoCartao?.corHex ??
                    selectedCard?.corHex ??
                    theme.colors.primary) + "DD",
                ]}
                style={{ padding: 14 }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View>
                    <Text style={{ color: "#fff", fontWeight: "900", fontSize: 14 }}>
                      {details?.resumoCartao?.nome ?? selectedCard?.nome ?? "Cartão"}
                    </Text>
                    <Text style={{ color: "rgba(255,255,255,0.85)", fontWeight: "700", fontSize: 11, marginTop: 3 }}>
                      •••• {details?.resumoCartao?.ultimos4 ?? selectedCard?.ultimos4 ?? ""}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 42,
                      height: 28,
                      borderRadius: 10,
                      backgroundColor: "rgba(255,255,255,0.18)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "900", fontSize: 11 }}>
                      {(details?.resumoCartao?.bandeira ?? selectedCard?.bandeira ?? "CARD")
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 12 }}>
                  <Text style={{ color: "rgba(255,255,255,0.85)", fontWeight: "800", fontSize: 11 }}>
                    Limite usado
                  </Text>

                  <View style={{ height: 6, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 10, marginTop: 8 }}>
                    <View
                      style={{
                        height: 6,
                        width: `${Math.max(0, Math.min(100, selectedCard?.percentualUsado ?? 0))}%`,
                        borderRadius: 10,
                        backgroundColor: "rgba(255,255,255,0.95)",
                      }}
                    />
                  </View>

                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                    <Text style={{ color: "#fff", fontWeight: "900", fontSize: 12 }}>
                      {formatBRL(details?.resumoCartao?.limiteUsado ?? selectedCard?.limiteUsado ?? 0)}
                    </Text>
                    <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: "900", fontSize: 12 }}>
                      {formatBRL(details?.resumoCartao?.limiteTotal ?? selectedCard?.limiteTotal ?? 0)}
                    </Text>
                  </View>
                </View>

                {selectedIsActive === false ? (
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 999,
                      backgroundColor: "rgba(0,0,0,0.35)",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "900", fontSize: 11 }}>
                      Inativo
                    </Text>
                  </View>
                ) : null}
              </LinearGradient>
            </View>

            {/* Mês (dropdown) + 2 cards pequenos: fatura e disponível */}
            <Pressable
              onPress={handleMonthPicker}
              style={{
                marginTop: 10,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 14,
                paddingVertical: 12,
                paddingHorizontal: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <MaterialIcons name="calendar-today" size={18} color={theme.colors.textMuted} />
                <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 12 }}>
                  {mesAno}
                </Text>
              </View>
              <MaterialIcons name="keyboard-arrow-down" size={22} color={theme.colors.textMuted} />
            </Pressable>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: 12,
                }}
              >
                <Text style={{ color: theme.colors.textMuted, fontSize: 11, fontWeight: "800" }}>
                  Fatura
                </Text>
                <Text style={{ color: theme.colors.danger, fontSize: 13, fontWeight: "900", marginTop: 6 }}>
                  {formatBRL(valorFatura)}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: 12,
                }}
              >
                <Text style={{ color: theme.colors.textMuted, fontSize: 11, fontWeight: "800" }}>
                  Disponível
                </Text>
                <Text style={{ color: theme.colors.success, fontSize: 13, fontWeight: "900", marginTop: 6 }}>
                  {formatBRL(details?.resumoCartao?.limiteDisponivel ?? selectedCard?.limiteDisponivel ?? 0)}
                </Text>
              </View>
            </View>

            {/* Seções: Resumo / Por categoria / Parcelas / Gastos */}
            <View style={{ marginTop: 10, gap: 10 }}>
              {/* RESUMO */}
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <MaterialIcons name="list-alt" size={18} color={theme.colors.textMuted} />
                  <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 12 }}>
                    Resumo
                  </Text>
                </View>

                <Row
                  label="Limite Total"
                  value={formatBRL(details?.resumoCartao?.limiteTotal ?? selectedCard?.limiteTotal ?? 0)}
                  theme={theme}
                />
                <Row
                  label="Fechamento"
                  value={`Dia ${details?.resumoCartao?.diaFechamento ?? selectedCard?.diaFechamento ?? "-"}`}
                  theme={theme}
                />
                <Row
                  label="Vencimento"
                  value={`Dia ${details?.resumoCartao?.diaVencimento ?? selectedCard?.diaVencimento ?? "-"}`}
                  theme={theme}
                />
                <Row
                  label="Status"
                  value={selectedIsActive ? "Ativo" : "Inativo"}
                  theme={theme}
                />
              </View>

              {/* POR CATEGORIA */}
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <MaterialIcons name="pie-chart" size={18} color={theme.colors.textMuted} />
                  <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 12 }}>
                    Por Categoria
                  </Text>
                </View>

                {(details?.porCategoria?.length ?? 0) === 0 ? (
                  <Text style={{ color: theme.colors.textMuted, fontWeight: "700", fontSize: 12 }}>
                    Sem dados neste mês.
                  </Text>
                ) : (
                  details!.porCategoria.map((it, idx) => (
                    <Row key={idx} label={it.categoria} value={formatBRL(it.valor)} theme={theme} />
                  ))
                )}
              </View>

              {/* PARCELAS ATIVAS */}
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <MaterialIcons name="layers" size={18} color={theme.colors.textMuted} />
                  <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 12 }}>
                    Parcelas Ativas
                  </Text>
                </View>

                {(details?.parcelasAtivas?.length ?? 0) === 0 ? (
                  <Text style={{ color: theme.colors.textMuted, fontWeight: "700", fontSize: 12 }}>
                    Nenhum parcelamento ativo.
                  </Text>
                ) : (
                  details!.parcelasAtivas.map((p, idx) => (
                    <View
                      key={idx}
                      style={{
                        paddingVertical: 10,
                        borderTopWidth: idx === 0 ? 0 : 1,
                        borderTopColor: theme.colors.border,
                      }}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 12 }}>
                          {p.descricao}
                        </Text>
                        <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 12 }}>
                          {formatBRL(p.valorParcela)}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: theme.colors.textMuted,
                          fontWeight: "700",
                          fontSize: 11,
                          marginTop: 4,
                        }}
                      >
                        {p.parcelaAtual}/{p.totalParcelas} • Restam {p.restam}
                      </Text>
                    </View>
                  ))
                )}
              </View>

              {/* GASTOS DO MÊS */}
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <MaterialIcons name="receipt-long" size={18} color={theme.colors.textMuted} />
                    <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 12 }}>
                      Gastos
                    </Text>
                  </View>

                  <Text style={{ color: theme.colors.primary, fontWeight: "900", fontSize: 12 }}>
                    {formatBRL(details?.gastosDoMes?.total ?? 0)}
                  </Text>
                </View>

                {(details?.gastosDoMes?.itens?.length ?? 0) === 0 ? (
                  <Text style={{ color: theme.colors.textMuted, fontWeight: "700", fontSize: 12 }}>
                    Nenhum gasto registrado.
                  </Text>
                ) : (
                  details!.gastosDoMes.itens.map((g, idx) => (
                    <View
                      key={idx}
                      style={{
                        paddingVertical: 10,
                        borderTopWidth: idx === 0 ? 0 : 1,
                        borderTopColor: theme.colors.border,
                      }}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 12 }}>
                          {g.descricao}
                        </Text>
                        <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 12 }}>
                          {formatBRL(g.valor)}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                        <Text style={{ color: theme.colors.textMuted, fontWeight: "700", fontSize: 11 }}>
                          {g.categoria}
                        </Text>

                        {g.parcela?.total > 1 ? (
                          <Text style={{ color: theme.colors.textMuted, fontWeight: "800", fontSize: 11 }}>
                            {g.parcela.atual}/{g.parcela.total}x
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>

            {/* Ações grandes no rodapé (Novo Gasto / Pagar) */}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <Pressable onPress={() => setIsAddExpenseModalVisible(true)} style={{ flex: 1 }}>
                <LinearGradient
                  colors={[theme.colors.success, theme.colors.success + "DD"]}
                  style={{
                    height: 46,
                    borderRadius: 14,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <MaterialIcons name="add" size={20} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "900" }}>Novo Gasto</Text>
                </LinearGradient>
              </Pressable>

              <Pressable onPress={() => setIsPayInvoiceModalVisible(true)} style={{ flex: 1 }}>
                <LinearGradient
                  colors={theme.colors.gradients.button}
                  style={{
                    height: 46,
                    borderRadius: 14,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <MaterialIcons name="payment" size={20} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "900" }}>Pagar</Text>
                </LinearGradient>
              </Pressable>
            </View>

            {detailsLoading ? (
              <View style={{ marginTop: 12, alignItems: "center" }}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : null}
          </View>
        ) : (
          // placeholder opcional para indicar que precisa selecionar
          <View
            style={{
              marginTop: 16,
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 16,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <MaterialIcons name="touch-app" size={20} color={theme.colors.textMuted} />
            <Text style={{ color: theme.colors.textMuted, fontWeight: "800", fontSize: 12 }}>
              Selecione um cartão para ver os detalhes.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* MODAIS */}
      <AddCardModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={async () => {
          setDetailsLoading(true);
          await loadAllThenOverview({
            ano: selectedYear,
            mes: selectedMonth,
            preferredUuid: selectedUuid,
            keepDetailsVisibility: true,
          });
          setDetailsLoading(false);
        }}
      />

      <EditCardModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={async () => {
          setDetailsLoading(true);
          await loadAllThenOverview({
            ano: selectedYear,
            mes: selectedMonth,
            preferredUuid: selectedUuid,
            keepDetailsVisibility: true,
          });
          setDetailsLoading(false);
        }}
        card={selectedCard as any}
      />

      <DeleteCardModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={async () => {
          if (!userId || !selectedUuid) return;
          try {
            await creditCardsService.deleteCard(userId, selectedUuid, authToken);
            Alert.alert("Sucesso", "Cartão excluído!");
            setIsDeleteModalVisible(false);

            // após excluir, recarrega — e esconde detalhes até nova seleção
            setDetailsLoading(true);
            await loadAllThenOverview({
              ano: selectedYear,
              mes: selectedMonth,
              preferredUuid: null,
              keepDetailsVisibility: false,
            });
            setDetailsLoading(false);
          } catch (e) {
            console.error(e);
            Alert.alert("Erro", "Não foi possível excluir o cartão.");
          }
        }}
        card={selectedCard as any}
      />

      <AddExpenseModal
        visible={isAddExpenseModalVisible}
        onClose={() => setIsAddExpenseModalVisible(false)}
        onSuccess={async () => {
          setDetailsLoading(true);
          await loadAllThenOverview({
            ano: selectedYear,
            mes: selectedMonth,
            preferredUuid: selectedUuid,
            keepDetailsVisibility: true,
          });
          setDetailsLoading(false);
        }}
        card={selectedCard as any}
      />

      <PayInvoiceModal
        visible={isPayInvoiceModalVisible}
        onClose={() => setIsPayInvoiceModalVisible(false)}
        onSuccess={async () => {
          setDetailsLoading(true);
          await loadAllThenOverview({
            ano: selectedYear,
            mes: selectedMonth,
            preferredUuid: selectedUuid,
            keepDetailsVisibility: true,
          });
          setDetailsLoading(false);
        }}
        card={selectedCard as any}
        valorFatura={valorFatura}
      />
    </View>
  );
}

function Row({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: any;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
      <Text style={{ color: theme.colors.textMuted, fontWeight: "800", fontSize: 11 }}>
        {label}
      </Text>
      <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 11 }}>
        {value}
      </Text>
    </View>
  );
}
