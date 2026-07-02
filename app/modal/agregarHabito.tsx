import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Alert } from "../../utils/Alert";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useHabitos } from "../../context/HabitosContext";
import { Prioridad, Frecuencia } from "../../types/Enums";

export default function AgregarHabitoScreen() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<Prioridad>(Prioridad.BAJA); // Baja por defecto (Normal)
  const { agregarHabito } = useHabitos();

  const handleSave = async () => {
    if (!nombre) {
      Alert.alert("Campo requerido", "El nombre del hábito es obligatorio.");
      return;
    }
    try {
      await agregarHabito({
        titulo: nombre,
        descripcion,
        prioridad,
        frecuencia: Frecuencia.DIARIO,
      });
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar el hábito. Inténtalo de nuevo.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#FFFF] px-6 pt-12">
      {/* Cabecera del Modal */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-2xl font-bold text-[#311917]">Crear Hábito</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-[#FFEBEB] rounded-full"
        >
          <Ionicons name="close" size={20} color="#311917" />
        </TouchableOpacity>
      </View>

      {/* Formulario */}
      <View className="bg-white p-6 rounded-4xl border-3 border-[#FFEBEB] shadow-sm mb-6">
        <Text className="text-xs font-bold text-[#5A4341] mb-2">
          Nombre del Hábito
        </Text>
        <TextInput
          placeholder="Ej. Tomar Agua"
          placeholderTextColor="#988281"
          value={nombre}
          onChangeText={setNombre}
          className="bg-[#FFFF] px-4 py-3 rounded-xl mb-4 border-3 border-[#FFEBEB] text-[#4A3E3D]"
        />

        <Text className="text-xs font-bold text-[#5A4341] mb-2">
          Descripción
        </Text>
        <TextInput
          placeholder="Ej. Beber 2 litros de agua diariamente"
          placeholderTextColor="#988281"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={3}
          className="bg-[#FFFF] px-4 py-3 rounded-xl mb-4 border-3 border-[#FFEBEB] text-[#4A3E3D] h-20 text-top"
        />

        <Text className="text-xs font-bold text-[#5A4341] mb-3">
          Prioridad / Recompensa
        </Text>
        <View className="flex-row gap-2">
          {[
            { label: "Normal", value: Prioridad.BAJA },
            { label: "Medio", value: Prioridad.MEDIA },
            { label: "Importante", value: Prioridad.ALTA },
          ].map((item) => {
            const isActive = prioridad === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => setPrioridad(item.value)}
                className={`flex-1 py-2.5 rounded-full items-center border ${
                  isActive
                    ? "bg-[#B4C287] border-[#B4C287]"
                    : "bg-[#ffffff] border-[#FFEBEB] border-3"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isActive ? "text-white" : "text-[#7A6F62]"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Botón de Guardar */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-[#F297A0] py-4 rounded-2xl items-center shadow-sm mb-12"
      >
        <Text className="text-white font-bold text-base">Guardar Hábito</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
