import { StyleSheet } from "react-native";
import type { AppTheme } from "../../../shared/theme";

export function makeScreenBackgroundStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1 },
  });
}
