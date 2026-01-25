// src/shared/navigation/AppNavigator.tsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../types/navigation";

import HomeScreen from "../../screens/app/HomeScreen";
import CreditCardsScreen from "../../screens/app/CreditCardsScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreditCards" component={CreditCardsScreen} />
      {/* Outras telas serão adicionadas aqui */}
    </Stack.Navigator>
  );
}