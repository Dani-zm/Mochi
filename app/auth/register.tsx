import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Alert } from "../../utils/Alert";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AuthService from "../../services/auth.service";

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !password || !confirmPassword) {
      Alert.alert("Campos incompletos o.o", "Por favor llena todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error de contraseña unu", "Las contraseñas no coinciden :c");
      return;
    }

    setLoading(true);
    try {
      await AuthService.register(nombre.trim(), email.trim(), password.trim());

      Alert.alert(
        "Registro exitoso",
        "Tu cuenta ha sido creada! Ahora puedes iniciar sesión uvu",
        [{ text: "OK", onPress: () => router.replace("/auth/login" as any) }],
      );
    } catch (error: any) {
      console.error("SIGNUP ERROR DETAILED:", error);
      Alert.alert(
        "Error",
        error.message || "Ocurrió un error al registrarte unu",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-[#ffffff]"
    >
      <View className="flex-1 justify-center px-8 py-12">
        <View className="bg-[#ffffff] p-6 rounded-3xl border border-[#F297A0] shadow-2xl">
          <Text className="text-4xl font-black text-center text-[#311917] mb-2">
            ⋆˖ Mochi ˖⋆
          </Text>
          <Text className="text-[#5A4341] text-center mb-8">
            Crea tu cuenta para cuidar a tu mascota
          </Text>

          <TextInput
            placeholder="Nombre de usuario"
            placeholderTextColor="#988281"
            value={nombre}
            onChangeText={setNombre}
            className="bg-[#ffffff] text-[#5A4341] px-4 py-3 rounded-xl mb-4 border border-[#F7B9BE] focus:border-[#F297A0]"
          />

          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#988281"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="bg-[#ffffff] text-[#5A4341] px-4 py-3 rounded-xl mb-4 border border-[#F7B9BE] focus:border-[#F297A0]"
          />

          <View className="relative mb-4">
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

          <View className="relative mb-6">
            <TextInput
              placeholder="Confirmar contraseña"
              placeholderTextColor="#988281"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
              className="bg-[#ffffff] text-[#5A4341] px-4 py-3 rounded-xl border border-[#F7B9BE] focus:border-[#F297A0]"
            />
            <TouchableOpacity
              onPress={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3"
            >
              <Ionicons
                name={showConfirm ? "eye-off" : "eye"}
                size={20}
                color="#5A4341"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-[#B6BB79] py-3.5 rounded-xl items-center shadow-lg active:opacity-90"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-[#311917] font-semibold text-lg">
                Registrarse
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-[#5A4341]">¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login" as any)}>
              <Text className="text-[#F297A0] font-semibold">
                Inicia Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
