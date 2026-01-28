// src/shared/navigation/drawer/AppDrawerContent.tsx
import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import type { AppTabsParamList } from "../../../types/navigation";
import { useTheme } from "../../theme/ThemeProvider";
import { useAuthSession } from "../../auth/AuthSessionContext";

type Props = DrawerContentComponentProps;

export default function AppDrawerContent(props: Props) {
  const { theme } = useTheme();
  const { user, logout } = useAuthSession();

  const goTab = useCallback(
    (screen: keyof AppTabsParamList) => {
      props.navigation.closeDrawer();

      // ✅ Nesta versão do drawer, navigation é DrawerNavigationHelpers (genérico)
      // então fazemos cast só aqui, sem contaminar o componente.
      (props.navigation.navigate as any)("Tabs", { screen });
    },
    [props.navigation]
  );

  const onLogout = useCallback(() => {
    props.navigation.closeDrawer();
    logout();
  }, [logout, props.navigation]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.container, { paddingBottom: 20 }]}
    >
      <View style={styles.header}>
        <Text style={[styles.appName, { color: theme.colors.text }]}>Konta</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          {user?.nome ? `Olá, ${user.nome}` : "Fintech Premium"}
        </Text>
      </View>

      <View style={styles.section}>
        <DrawerItem
          label="Home"
          onPress={() => goTab("Home")}
          icon={({ size }) => (
            <Ionicons name="home-outline" size={size} color={theme.colors.text} />
          )}
          labelStyle={[styles.itemLabel, { color: theme.colors.text }]}
          style={[styles.item, { backgroundColor: theme.colors.surfaceAlt }]}
        />

        <DrawerItem
          label="Cartões"
          onPress={() => goTab("CreditCards")}
          icon={({ size }) => (
            <Ionicons name="card-outline" size={size} color={theme.colors.text} />
          )}
          labelStyle={[styles.itemLabel, { color: theme.colors.text }]}
          style={[styles.item, { backgroundColor: theme.colors.surfaceAlt }]}
        />

        <DrawerItem
          label="Perfil"
          onPress={() => goTab("Profile")}
          icon={({ size }) => (
            <Ionicons name="person-outline" size={size} color={theme.colors.text} />
          )}
          labelStyle={[styles.itemLabel, { color: theme.colors.text }]}
          style={[styles.item, { backgroundColor: theme.colors.surfaceAlt }]}
        />
      </View>

      <View style={styles.footer}>
        <DrawerItem
          label="Sair"
          onPress={onLogout}
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} color={theme.colors.danger} />
          )}
          labelStyle={[styles.itemLabel, { color: theme.colors.danger }]}
          style={[styles.item, { backgroundColor: theme.colors.surfaceAlt }]}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10 },
  header: { paddingHorizontal: 18, paddingVertical: 16 },
  appName: { fontSize: 22, fontWeight: "800", letterSpacing: 0.2 },
  subtitle: { marginTop: 6, fontSize: 13, fontWeight: "600" },
  section: { paddingHorizontal: 12, gap: 8 },
  footer: { marginTop: 18, paddingHorizontal: 12 },
  item: { borderRadius: 14, marginVertical: 0 },
  itemLabel: { fontSize: 14, fontWeight: "700" },
});
