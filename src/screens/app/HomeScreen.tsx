import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../shared/theme/ThemeProvider';
import { useAuthSession } from '../../shared/auth/AuthSessionContext';
import ScreenBackground from '../../shared/ui/components/layout/ScreenBackground';
import BalanceCard from '../../shared/ui/components/dashboard/BalanceCard';
import QuickStatsCard from '../../shared/ui/components/dashboard/QuickStatsCard';
import ExpenseBreakdown from '../../shared/ui/components/dashboard/ExpenseBreakdown';
import TransactionItem from '../../shared/ui/components/dashboard/TransactionItem';
import AIInsightCard from '../../shared/ui/components/dashboard/AIInsightCard';
import NavigationMenu from '../../shared/ui/components/navigation/NavigationMenu';
import NavigationFAB from '../../shared/ui/components/navigation/NavigationFAB';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardData } from '../../types/dashboard';
import { spacing, typography } from '../../shared/theme/tokens';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { logout } = useAuthSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const loadData = async () => {
    try {
      const dashboardData = await dashboardService.getDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };


  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <ScreenBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
            Carregando seus dados...
          </Text>
        </View>
      </ScreenBackground>
    );
  }

  if (!data) {
    return (
      <ScreenBackground>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={theme.colors.danger} />
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Erro ao carregar dados
          </Text>
          <Pressable onPress={loadData} style={styles.retryButton}>
            <Text style={[styles.retryText, { color: theme.colors.primary }]}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      </ScreenBackground>
    );
  }

  const { resumoFinanceiro, detalhamentoDespesas, feedTransacoes, usuario } = data;

  // Simulação de insights de IA (será substituído por IA real no futuro)
  const aiInsights = [
    {
      title: 'Atenção aos gastos variáveis',
      message: 'Seus gastos variáveis aumentaram 15% este mês. Considere revisar compras não essenciais.',
      type: 'warning' as const,
    },
  ];

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
            <Text style={[styles.greeting, { color: theme.colors.textMuted }]}>
              Olá,
            </Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {usuario.nome}
            </Text>
          </View>
          <Pressable style={styles.notificationButton}>
            <MaterialIcons name="notifications-none" size={24} color={theme.colors.text} />
            <View style={[styles.notificationBadge, { backgroundColor: theme.colors.danger }]} />
          </Pressable>
        </View>

        {/* Balance Card */}
        <BalanceCard
          saldo={resumoFinanceiro.saldoAtual}
          balanco={resumoFinanceiro.balanco}
        />

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <QuickStatsCard
            label="Receitas"
            value={resumoFinanceiro.receitas}
            icon="trending-up"
            color={theme.colors.success}
            delay={100}
          />
          <QuickStatsCard
            label="Despesas"
            value={resumoFinanceiro.despesas}
            icon="trending-down"
            color={theme.colors.danger}
            delay={200}
          />
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="auto-awesome" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Insights Inteligentes
            </Text>
          </View>
          {aiInsights.map((insight, index) => (
            <AIInsightCard key={index} {...insight} />
          ))}
        </View>

        {/* Expense Breakdown */}
        <ExpenseBreakdown
          fixas={detalhamentoDespesas.fixas}
          variaveis={detalhamentoDespesas.variaveis}
          cartaoCredito={detalhamentoDespesas.cartaoCredito}
          total={resumoFinanceiro.despesas}
        />

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Transações Recentes
            </Text>
            <Pressable>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                Ver todas
              </Text>
            </Pressable>
          </View>
          {feedTransacoes.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </View>

        {/* Bottom Spacing for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Navigation FAB */}
      <NavigationFAB
        onPress={() => setMenuVisible(!menuVisible)}
        isMenuOpen={menuVisible}
      />

      {/* Navigation Menu */}
      <NavigationMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onLogout={handleLogout}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.size.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  retryButton: {
    marginTop: spacing.sm,
  },
  retryText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.size.md,
  },
  userName: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    flex: 1,
  },
  seeAll: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
});