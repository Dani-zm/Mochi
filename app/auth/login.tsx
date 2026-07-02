import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Alert } from "../../utils/Alert";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AuthService from "../../services/auth.service";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Campos incompletos",
        "Por favor ingresa tu correo y contraseña.",
      );
      return;
    }
    setLoading(true);
    try {
      await AuthService.login(email.trim(), password.trim());
      router.replace("/tabs/home" as any);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-8 bg-[#ffffff]">
      <View className="bg-[#ffffff] p-6 rounded-3xl border border-[#F297A0] shadow-2xl">
        <Text className="text-4xl font-black text-center text-[#311917] mb-2">
          ⋆˖ Mochi ˖⋆
        </Text>
        <Text className="text-[#5A4341] text-center mb-8 font-bold">
          Inicia sesión para ver a tu mascota
        </Text>

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#988281"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="bg-[#ffffff] text-[#5A4341] px-4 py-3 rounded-xl mb-4 border border-[#F7B9BE] focus:border-[#F297A0]"
        />

        <View className="relative mb-6">
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#988281"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            className="bg-[#ffffff] text-[#5A4341] px-4 py-3 rounded-xl border border-[#F7B9BE] focus:border-[#F297A0]"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#5A4341"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-[#B6BB79] py-3.5 rounded-xl items-center shadow-lg active:opacity-90"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-[#311917] font-semibold text-lg">
              Iniciar Sesión
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-[#5A4341]">¿No tienes cuenta? </Text>
          <TouchableOpacity
            onPress={() => router.push("/auth/register" as any)}
          >
            <Text className="text-[#F297A0] font-semibold">Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
