import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import "@/global.css";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      // Redirigir a login si no hay usuario y no estamos en auth
      router.replace("/auth/login" as any);
    } else if (user && inAuthGroup) {
      // Redirigir a pestañas principales si hay usuario y estamos en auth
      router.replace("/tabs/home" as any);
    } else if (user && segments.length === 0) {
      // Si estamos en la raíz y hay usuario, ir a home
      router.replace("/tabs/home" as any);
    } else if (!user && segments.length === 0) {
      // Si estamos en la raíz y no hay usuario, ir a login
      router.replace("/auth/login" as any);
    }
  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="tabs" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

import { MascotaProvider } from "../context/MascotaContext";
import { HabitosProvider } from "../context/HabitosContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MascotaProvider>
        <HabitosProvider>
          <RootLayoutNav />
        </HabitosProvider>
      </MascotaProvider>
    </AuthProvider>
  );
}

