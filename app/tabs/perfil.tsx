import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AuthService from "../../services/auth.service";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useMascota } from "../../context/MascotaContext";

export default function PerfilScreen() {
  const { user } = useAuth();
  const { mascota, rachaActual, mejorRacha, habitosCompletados } = useMascota();
  const hora = new Date().getHours();
  const saludo =
    hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  const usuarioNombre =
    user?.user_metadata?.nombre || user?.email?.split("@")[0] || "Usuario";
  const rachaDias = rachaActual;

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.replace("/auth/login" as any);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#FFFF]">
      <View className="bg-[#F297A0] flex-row justify-between items-center px-6 pt-14 pb-4 ">
        <View>
          <Text className="text-2xl font-bold text-[#ffffff]">⋆˖ Mochi ˖⋆</Text>
          <Text className="text-sm text-[#F3EBD8]">
            {saludo}, {usuarioNombre}!
          </Text>
        </View>
        <View className="p-2 bg-[#5A4341] rounded-full opacity-40">
          <Ionicons name="sunny-outline" size={20} color="#F3EBD8" />
        </View>
      </View>
      <View className="px-6 mt-5">
        {/* Tarjeta de Usuario */}
        <View className="bg-[#f297a060] p-6 rounded-3xl items-center mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-2xl font-bold text-[#5A4341] mr-2">
              {usuarioNombre}
            </Text>
          </View>
          <Text className="text-[#5A4341] text-xs">
            {user?.email || "usuario@mochi.com"}
          </Text>
        </View>

        {/* Hábito Stats */}
        <View className="border-4 border-[#FFEBEB]  p-6 rounded-3xl items-center mb-4">
          <Text className="text-xs text-[#988281] mb-1 font-semibold">
            Hábitos Cumplidos
          </Text>
          <Text className="text-3xl font-bold text-[#7A6F62]">
            {habitosCompletados}
          </Text>
        </View>

        {/* Rachas */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 border-4 border-[#FFEBEB]  p-4 rounded-2xl items-center">
            <Text className="text-xs text-[#7A6F62] font-semibold">
              Actual Racha
            </Text>
            <Text className="text-xl font-bold text-[#4A3E3D] mt-1">
              {rachaDias}
            </Text>
            <Text className="text-[12px] text-[#7A6F62] font-semibold">
              Días
            </Text>
          </View>

          <View className="flex-1 border-4 border-[#FFEBEB]  p-4 rounded-2xl items-center">
            <Text className="text-xs text-[#7A6F62] font-semibold">
              Mejor Racha
            </Text>
            <Text className="text-xl font-bold text-[#4A3E3D] mt-1">
              {mejorRacha}
            </Text>
            <Text className="text-[12px] text-[#7A6F62] font-semibold">
              Días
            </Text>
          </View>
        </View>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-[#B6BB79]  py-3 rounded-2xl items-center mb-8"
        >
          <Text className="text-[#7A6F62] font-bold text-base">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
      {/* Cabecera */}
    </ScrollView>
  );
}
