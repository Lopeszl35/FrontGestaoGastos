// src/types/navigation.ts
import type { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabsParamList = {
  Home: undefined;
  CreditCards: undefined;
  Profile: undefined;
};

/**
 * Drawer apenas controla a sidebar.
 * A navegação principal é o Tabs.
 */
export type AppDrawerParamList = {
  Tabs: NavigatorScreenParams<AppTabsParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppDrawerParamList>;
};
