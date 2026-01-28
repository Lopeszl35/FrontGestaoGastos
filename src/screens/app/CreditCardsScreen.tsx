// src/screens/app/CreditCardsScreen.tsx

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../shared/theme/ThemeProvider';
import { useAuthSession } from '../../shared/auth/AuthSessionContext';
import CreditCardItem from '../../shared/ui/components/creditCards/CreditCardItem';
import CreditCardDetails from '../../shared/ui/components/creditCards/CreditCardDetails';
import TotalSummaryCard from '../../shared/ui/components/creditCards/TotalSummaryCard';
import MonthYearSelector from '../../shared/ui/components/creditCards/MonthYearSelector';
import { creditCardsService } from '../../services/creditCardsService';
import { makeCreditCardsStyles } from '../../styles/screens/app/creditCardsStyles';
import type { CreditCard, CreditCardDetails as DetailsType } from '../../types/creditCard';

// ✅ Importando todos os modais
import AddCardModal from '../../shared/ui/components/creditCards/AddCardModal';
import EditCardModal from '../../shared/ui/components/creditCards/EditCardModal';
import DeleteCardModal from '../../shared/ui/components/creditCards/DeleteCardModal';
import AddExpenseModal from '../../shared/ui/components/creditCards/AddExpenseModal';
import PayInvoiceModal from '../../shared/ui/components/creditCards/PayInvoiceModal';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

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

  // ✅ Estados dos modais
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] = useState(false);
  const [isPayInvoiceModalVisible, setIsPayInvoiceModalVisible] = useState(false);

  // ✅ Estados do filtro de data
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const getUserId = () => {
    return user?.id_usuario ?? (user as any)?.id;
  };

  // ✅ Função para calcular totais
  const calculateTotals = () => {
    const limiteTotal = cards.reduce((sum, card) => sum + (typeof card.limite === 'string' ? parseFloat(card.limite) : card.limite) || 0, 0);
    const limiteUsado = cards.reduce((sum, card) => sum + (card.limiteUsado || 0), 0);
    
    // Soma os gastos de todos os cartões no mês selecionado
    let gastosDoMes = 0;
    if (cardDetails) {
      gastosDoMes = cardDetails.gastosDoMes?.total || 0;
    }

    return { limiteTotal, limiteUsado, gastosDoMes };
  };

  const loadCards = async (month?: number, year?: number) => {
    const userId = getUserId();
    
    if (!userId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const targetMonth = month || selectedMonth;
    const targetYear = year || selectedYear;

    try {
      const allCards = await creditCardsService.getAllCards(
        userId, 
        token ?? undefined
      );
      setCards(allCards);

      if (allCards.length > 0) {
        setSelectedCard(allCards[0]);
        await loadCardDetails(allCards[0].uuid_cartao, targetMonth, targetYear);
      }
    } catch (error) {
      console.error('❌ [CreditCards] Erro ao carregar cartões:', error);
      setCards([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadCardDetails = async (cardUuid: string, month?: number, year?: number) => {
    const userId = getUserId();
    if (!userId) return;

    const targetMonth = month || selectedMonth;
    const targetYear = year || selectedYear;

    setDetailsLoading(true);
    try {
      const overview = await creditCardsService.getCardsOverview(
        userId,
        targetYear,
        targetMonth,
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
  }, []);

  // ✅ Handler para mudança de mês/ano
  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    
    // Recarrega dados com o novo mês
    if (selectedCard) {
      loadCardDetails(selectedCard.uuid_cartao, month, year);
    }
  };

  const handleCardPress = (card: CreditCard) => {
    setSelectedCard(card);
    loadCardDetails(card.uuid_cartao);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCards();
  };

  // ✅ Handlers dos modais
  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleToggleStatus = async () => {
    const userId = getUserId();
    if (!selectedCard || !userId) return;

    try {
      await creditCardsService.toggleCardStatus(
        userId,
        selectedCard.uuid_cartao,
        !selectedCard.ativo,
        token ?? undefined
      );

      Alert.alert(
        'Sucesso',
        selectedCard.ativo ? 'Cartão desativado' : 'Cartão ativado'
      );

      loadCards();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      Alert.alert('Erro', 'Não foi possível alterar o status do cartão.');
    }
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    const userId = getUserId();
    if (!selectedCard || !userId) return;

    try {
      await creditCardsService.deleteCard(
        userId,
        selectedCard.uuid_cartao,
        token ?? undefined
      );

      Alert.alert('Sucesso', 'Cartão excluído com sucesso!');
      setSelectedCard(null);
      setCardDetails(null);
      loadCards();
    } catch (error) {
      console.error('Erro ao excluir cartão:', error);
      throw error;
    }
  };

  const handleAddExpense = () => {
    setIsAddExpenseModalVisible(true);
  };

  const handlePayInvoice = () => {
    setIsPayInvoiceModalVisible(true);
  };

  const handleAddCard = () => {
    setIsAddModalVisible(true);
  };

  const handleModalSuccess = () => {
    loadCards();
  };

  if (loading) {
    return (
      <View style={styles.full}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
            Carregando cartões...
          </Text>
        </View>
      </View>
    );
  }

  // ✅ TELA VAZIA REDESENHADA
  if (cards.length === 0) {
    return (
      <View style={styles.full}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIllustration}>
            <LinearGradient
              colors={[theme.colors.primary + '30', theme.colors.primary + '10']}
              style={styles.emptyIllustrationBg}
            >
              <MaterialIcons name="credit-card" size={80} color={theme.colors.primary} />
            </LinearGradient>
          </View>

          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            Comece a gerenciar seus cartões
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
            Adicione seu primeiro cartão de crédito e tenha controle total sobre seus gastos
          </Text>

          <Pressable onPress={handleAddCard}>
            <LinearGradient
              colors={theme.colors.gradients.button}
              style={styles.emptyAddButton}
            >
              <MaterialIcons name="add-circle" size={28} color="#FFFFFF" />
              <Text style={styles.emptyAddButtonText}>Adicionar Primeiro Cartão</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.emptyFeatures}>
            <View style={styles.emptyFeatureItem}>
              <View style={[styles.emptyFeatureIcon, { backgroundColor: theme.colors.success + '20' }]}>
                <MaterialIcons name="trending-up" size={20} color={theme.colors.success} />
              </View>
              <Text style={[styles.emptyFeatureText, { color: theme.colors.textMuted }]}>
                Acompanhe seus gastos
              </Text>
            </View>

            <View style={styles.emptyFeatureItem}>
              <View style={[styles.emptyFeatureIcon, { backgroundColor: theme.colors.info + '20' }]}>
                <MaterialIcons name="insights" size={20} color={theme.colors.info} />
              </View>
              <Text style={[styles.emptyFeatureText, { color: theme.colors.textMuted }]}>
                Receba insights inteligentes
              </Text>
            </View>

            <View style={styles.emptyFeatureItem}>
              <View style={[styles.emptyFeatureIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                <MaterialIcons name="notifications-active" size={20} color={theme.colors.warning} />
              </View>
              <Text style={[styles.emptyFeatureText, { color: theme.colors.textMuted }]}>
                Alertas de vencimento
              </Text>
            </View>
          </View>
        </View>

        <AddCardModal 
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onSuccess={handleModalSuccess}
        />
      </View>
    );
  }

  const valorFatura = cardDetails?.gastosDoMes?.total || 0;
  const totals = calculateTotals();
  const mesAnoFormatado = `${MESES[selectedMonth - 1]} ${selectedYear}`;

  return (
    <View style={styles.full}>
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
        {/* ✅ HEADER REDESENHADO */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Meus Cartões</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              {cards.length} {cards.length === 1 ? 'cartão cadastrado' : 'cartões cadastrados'}
            </Text>
          </View>
          
          <Pressable onPress={handleAddCard}>
            <LinearGradient
              colors={theme.colors.gradients.button}
              style={styles.headerAddButton}
            >
              <MaterialIcons name="add" size={24} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        </View>

        {/* ✅ SELETOR DE MÊS/ANO */}
        <MonthYearSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={handleMonthChange}
        />

        {/* ✅ CARD DE RESUMO TOTAL */}
        <TotalSummaryCard
          limiteTotal={totals.limiteTotal}
          limiteUsado={totals.limiteUsado}
          gastosDoMes={totals.gastosDoMes}
          mesAno={mesAnoFormatado}
        />

        {/* ✅ LISTA DE CARTÕES */}
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

        {/* ✅ SEÇÃO DE DETALHES */}
        {selectedCard && (
          <View style={styles.detailsSection}>
            <View style={styles.detailsHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Detalhes do Cartão
              </Text>
              
              <View style={styles.quickActions}>
                <Pressable onPress={handleAddExpense}>
                  <LinearGradient
                    colors={[theme.colors.success, theme.colors.success + 'DD']}
                    style={styles.quickActionButton}
                  >
                    <MaterialIcons name="add-shopping-cart" size={20} color="#FFFFFF" />
                    <Text style={styles.quickActionText}>Gasto</Text>
                  </LinearGradient>
                </Pressable>

                <Pressable onPress={handlePayInvoice}>
                  <LinearGradient
                    colors={theme.colors.gradients.button}
                    style={styles.quickActionButton}
                  >
                    <MaterialIcons name="payment" size={20} color="#FFFFFF" />
                    <Text style={styles.quickActionText}>Pagar</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>

            {detailsLoading ? (
              <View style={styles.detailsLoading}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.detailsLoadingText, { color: theme.colors.textMuted }]}>
                  Carregando detalhes...
                </Text>
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
                <MaterialIcons name="info-outline" size={48} color={theme.colors.textMuted} />
                <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                  Nenhum detalhe disponível
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ✅ Todos os Modais */}
      <AddCardModal 
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={handleModalSuccess}
      />

      <EditCardModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={handleModalSuccess}
        card={selectedCard}
      />

      <DeleteCardModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        card={selectedCard}
      />

      <AddExpenseModal
        visible={isAddExpenseModalVisible}
        onClose={() => setIsAddExpenseModalVisible(false)}
        onSuccess={handleModalSuccess}
        card={selectedCard}
      />

      <PayInvoiceModal
        visible={isPayInvoiceModalVisible}
        onClose={() => setIsPayInvoiceModalVisible(false)}
        onSuccess={handleModalSuccess}
        card={selectedCard}
        valorFatura={valorFatura}
      />
    </View>
  );
}