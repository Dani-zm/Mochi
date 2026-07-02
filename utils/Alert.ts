import { Alert as RNAlert, Platform } from "react-native";

export const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: Array<{
      text?: string;
      onPress?: () => void;
      style?: "default" | "cancel" | "destructive";
    }>
  ) => {
    if (Platform.OS === "web") {
      if (buttons && buttons.length > 0) {
        if (buttons.length === 1) {
          window.alert(`${title}\n\n${message || ""}`);
          if (buttons[0].onPress) buttons[0].onPress();
        } else {
          // Buscar botón de confirmar y cancelar
          const acceptButton =
            buttons.find((b) => b.style !== "cancel") || buttons[buttons.length - 1];
          const cancelButton =
            buttons.find((b) => b.style === "cancel") || buttons[0];

          const result = window.confirm(`${title}\n\n${message || ""}`);
          if (result) {
            if (acceptButton.onPress) acceptButton.onPress();
          } else {
            if (cancelButton.onPress) cancelButton.onPress();
          }
        }
      } else {
        window.alert(`${title}\n\n${message || ""}`);
      }
    } else {
      RNAlert.alert(title, message, buttons);
    }
  },
};
