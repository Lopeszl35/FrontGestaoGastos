import { StyleSheet } from "react-native";
import { spacing } from "../../../shared/theme";

export const styles = StyleSheet.create({
  container: { position: "relative" },
  eyeButton: {
    position: "absolute",
    right: spacing.md,
    top: 34,
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
