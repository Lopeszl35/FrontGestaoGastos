import React from "react";
import { Text, View } from "react-native";
import ScreenBackground from "../../shared/ui/components/layout/ScreenBackground";
import Card from "../../shared/ui/components/layout/Card";
import PrimaryButton from "../../shared/ui/components/buttons/PrimaryButton";
import { useAuthSession } from "../../shared/auth/AuthSessionContext";
import { styles } from "../../styles/screens/app/homeStyles";

export default function HomeScreen() {
  const session = useAuthSession();

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Card>
          <Text style={styles.title}>Você está logado ✅</Text>
          <Text style={styles.subtitle}>Próximo: Dashboard, Gastos, Cartões, Relatórios.</Text>

          <View style={styles.spacer} />

          <PrimaryButton title="Sair" onPress={session.signOut} />
        </Card>
      </View>
    </ScreenBackground>
  );
}
