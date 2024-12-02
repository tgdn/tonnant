import { Pressable } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Ionicons from "@expo/vector-icons/Ionicons";

export function ModalCloseButton(props: { onPress: () => void }) {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Pressable onPress={props.onPress} style={styles.container}>
      <Ionicons size={18} color={theme.colors.systemGray} name="close" />
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.systemGray5,
    width: theme.spacing.l,
    height: theme.spacing.l,
    borderRadius: theme.spacing.l,
    alignItems: "center",
    justifyContent: "center",
  },
}));
