import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, ScrollView, Animated, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { makeCreditCardDetailsStyles } from '../../../../styles/ui/creditCards/creditCardDetailsStyles';
import type { CreditCardDetails as DetailsType } from '../../../../types/creditCard';

type Props = {
  details: DetailsType;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
};

export default function CreditCardDetails({ details, onEdit, onToggleStatus, onDelete }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeCreditCardDetailsStyles(theme), [theme]);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  // ✅ Função auxiliar para formatar com segurança absoluta
  const formatCurrency = (value: number | undefined | null) => {
    return (value ?? 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      style: 'currency', // Opcional: Adiciona R$ automaticamente se quiser
      currency: 'BRL'
    }).replace('R$', '').trim(); // Mantendo seu estilo original sem o R$ dentro da string formatada
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideUp, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
    ]).start();
  }, [details?.resumoCartao?.uuid_cartao]);

  // ✅ Proteção contra detalhes nulos
  if (!details || !details.resumoCartao) return null;

  const { resumoCartao, porCategoria = [], parcelasAtivas = [], gastosDoMes = { total: 0, itens: [] } } = details;

  return (
    <Animated.View
      style={{
        opacity: fadeIn,
        transform: [{ translateY: slideUp }],
      }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={onEdit}
            style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
          >
            <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
            <Text style={[styles.actionText, { color: theme.colors.primary }]}>Editar</Text>
          </Pressable>

          <Pressable
            onPress={onToggleStatus}
            style={[
              styles.actionButton,
              {
                backgroundColor: resumoCartao.ativo
                  ? theme.colors.warning + '20'
                  : theme.colors.success + '20',
              },
            ]}
          >
            <MaterialIcons
              name={resumoCartao.ativo ? 'visibility-off' : 'visibility'}
              size={20}
              color={resumoCartao.ativo ? theme.colors.warning : theme.colors.success}
            />
            <Text
              style={[
                styles.actionText,
                {
                  color: resumoCartao.ativo ? theme.colors.warning : theme.colors.success,
                },
              ]}
            >
              {resumoCartao.ativo ? 'Desativar' : 'Ativar'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onDelete}
            style={[styles.actionButton, { backgroundColor: theme.colors.danger + '20' }]}
          >
            <MaterialIcons name="delete" size={20} color={theme.colors.danger} />
            <Text style={[styles.actionText, { color: theme.colors.danger }]}>Excluir</Text>
          </Pressable>
        </View>

        {/* Info Card */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Informações</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={18} color={theme.colors.textMuted} />
            <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>
              Fecha dia {resumoCartao.diaFechamento}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={18} color={theme.colors.textMuted} />
            <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>
              Vence dia {resumoCartao.diaVencimento}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="account-balance-wallet" size={18} color={theme.colors.textMuted} />
            <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>
              Limite Total: R$ {formatCurrency(resumoCartao.limiteTotal)}
            </Text>
          </View>
        </View>

        {/* Gastos por Categoria */}
        {porCategoria.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Gastos por Categoria</Text>

            {porCategoria.map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                    {item.categoria}
                  </Text>
                  <Text style={[styles.categoryValue, { color: theme.colors.text }]}>
                    R$ {formatCurrency(item.valor)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Parcelas Ativas */}
        {parcelasAtivas.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Parcelamentos Ativos</Text>

            {parcelasAtivas.map((parcela, index) => (
              <View key={index} style={styles.parcelaItem}>
                <View style={styles.parcelaHeader}>
                  <Text style={[styles.parcelaDescricao, { color: theme.colors.text }]}>
                    {parcela.descricao}
                  </Text>
                  <Text style={[styles.parcelaValor, { color: theme.colors.primary }]}>
                    R$ {formatCurrency(parcela.valorParcela)}
                  </Text>
                </View>
                <Text style={[styles.parcelaInfo, { color: theme.colors.textMuted }]}>
                  {parcela.parcelaAtual}/{parcela.totalParcelas} • Restam {parcela.restam} parcelas
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Gastos do Mês */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Gastos do Mês</Text>
            <Text style={[styles.totalGastos, { color: theme.colors.primary }]}>
              R$ {formatCurrency(gastosDoMes?.total)}
            </Text>
          </View>

          {(!gastosDoMes?.itens || gastosDoMes.itens.length === 0) ? (
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
              Nenhum gasto registrado neste mês
            </Text>
          ) : (
            gastosDoMes.itens.map((item, index) => (
              <View key={index} style={styles.gastoItem}>
                <View style={styles.gastoHeader}>
                  <Text style={[styles.gastoDescricao, { color: theme.colors.text }]}>
                    {item.descricao}
                  </Text>
                  <Text style={[styles.gastoValor, { color: theme.colors.text }]}>
                    R$ {formatCurrency(item.valor)}
                  </Text>
                </View>
                <View style={styles.gastoFooter}>
                  <Text style={[styles.gastoCategoria, { color: theme.colors.textMuted }]}>
                    {item.categoria}
                  </Text>
                  {item.parcela.total > 1 && (
                    <Text style={[styles.gastoParcela, { color: theme.colors.textSubtle }]}>
                      {item.parcela.atual}/{item.parcela.total}x
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </Animated.View>
  );
}