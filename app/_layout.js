// app/_layout.js
import { Stack } from "expo-router";
import { AuthProvider } from "./authContext";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6200ee",
    accent: "#03dac4",
  },
};

export default function Layout() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <Stack />
      </PaperProvider>
    </AuthProvider>
  );
}
