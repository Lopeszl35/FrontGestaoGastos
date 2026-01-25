// src/screens/app/CreditCardsScreen.tsx

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../shared/theme/ThemeProvider';
import { useAuthSession } from '../../shared/auth/AuthSessionContext';
import ScreenBackground from '../../shared/ui/components/layout/ScreenBackground';
import CreditCardItem from '../../shared/ui/components/creditCards/CreditCardItem';
import CreditCardDetails from '../../shared/ui/components/creditCards/CreditCardDetails';
import { creditCardsService } from '../../services/creditCardsService';
import { makeCreditCardsStyles } from '../../styles/screens/app/creditCardsStyles';
import type { CreditCard, CreditCardDetails as DetailsType } from '../../types/creditCard';

export default function CreditCardsScreen() {
  const { theme } = useTheme();
  const { user, token } = useAuthSession();
  const styles = useMemo(() => makeCreditCardsStyles(theme), [theme]);

  const [cards, setCards] = useState<CreditCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [cardDetails, setCardDetails] = useState<DetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Data atual para buscar visão geral
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const loadCards = async () => {
    console.log('🔍 [CreditCards] Iniciando loadCards...');
    console.log('🔍 [CreditCards] user.id_usuario:', user?.id_usuario);
    console.log('🔍 [CreditCards] token exists:', !!token);
    
    if (!user?.id_usuario) {
      console.log('⚠️ [CreditCards] Sem user.id_usuario, abortando...');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      console.log('📡 [CreditCards] Chamando API getAllCards...');
      const allCards = await creditCardsService.getAllCards(
        user.id_usuario, 
        token ?? undefined
      );
      console.log('✅ [CreditCards] Cartões recebidos:', allCards.length);
      setCards(allCards);

      // Seleciona o primeiro cartão automaticamente (somente se houver)
      if (allCards.length > 0) {
        console.log('🎯 [CreditCards] Selecionando primeiro cartão...');
        setSelectedCard(allCards[0]);
        await loadCardDetails(allCards[0].uuid_cartao);
      } else {
        console.log('📭 [CreditCards] Nenhum cartão encontrado');
      }
    } catch (error) {
      console.error('❌ [CreditCards] Erro ao carregar cartões:', error);
      // Em caso de erro, ainda mostra a tela (pode ser que não tenha cartões)
      setCards([]);
    } finally {
      console.log('🏁 [CreditCards] Finalizando loadCards');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadCardDetails = async (cardUuid: string) => {
    if (!user?.id_usuario) return;

    setDetailsLoading(true);
    try {
      const overview = await creditCardsService.getCardsOverview(
        user.id_usuario,
        currentYear,
        currentMonth,
        cardUuid,
        token ?? undefined
      );

      if (overview.detalhes) {
        setCardDetails(overview.detalhes);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do cartão:', error);
      setCardDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []); // Array vazio - executa apenas uma vez na montagem

  const handleCardPress = (card: CreditCard) => {
    setSelectedCard(card);
    loadCardDetails(card.uuid_cartao);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCards();
    if (selectedCard) {
      loadCardDetails(selectedCard.uuid_cartao);
    }
  };

  const handleEdit = () => {
    // TODO: Abrir modal de edição
    console.log('Editar cartão:', selectedCard);
  };

  const handleToggleStatus = async () => {
    if (!selectedCard || !user?.id_usuario) return;

    try {
      await creditCardsService.toggleCardStatus(
        user.id_usuario,
        selectedCard.uuid_cartao,
        !selectedCard.ativo,
        token ?? undefined
      );

      // Recarregar dados
      loadCards();
      if (selectedCard) {
        loadCardDetails(selectedCard.uuid_cartao);
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleDelete = () => {
    // TODO: Abrir modal de confirmação de exclusão
    console.log('Excluir cartão:', selectedCard);
  };

  if (loading) {
    return (
      <ScreenBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
            Carregando cartões...
          </Text>
        </View>
      </ScreenBackground>
    );
  }

  if (cards.length === 0) {
    return (
      <ScreenBackground>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="credit-card-off" size={64} color={theme.colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            Nenhum cartão cadastrado
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
            Adicione seu primeiro cartão para começar
          </Text>
          <Pressable style={[styles.addButton, { backgroundColor: theme.colors.primary }]}>
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Adicionar Cartão</Text>
          </Pressable>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>Meus Cartões</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              {cards.length} {cards.length === 1 ? 'cartão' : 'cartões'}
            </Text>
          </View>
          <Pressable
            style={[styles.addIconButton, { backgroundColor: theme.colors.primary + '20' }]}
          >
            <MaterialIcons name="add" size={24} color={theme.colors.primary} />
          </Pressable>
        </View>

        {/* Lista de Cartões */}
        <View style={styles.cardsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Selecione um cartão
          </Text>
          {cards.map((card, index) => (
            <CreditCardItem
              key={card.uuid_cartao}
              card={card}
              onPress={() => handleCardPress(card)}
              isSelected={selectedCard?.uuid_cartao === card.uuid_cartao}
              delay={index * 50}
            />
          ))}
        </View>

        {/* Detalhes do Cartão Selecionado */}
        {selectedCard && (
          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Detalhes do Cartão
            </Text>

            {detailsLoading ? (
              <View style={styles.detailsLoading}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : cardDetails ? (
              <CreditCardDetails
                details={cardDetails}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ) : (
              <View style={styles.detailsEmpty}>
                <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                  Nenhum detalhe disponível
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenBackground>
  );
}