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
import { useMascota } from "../../context/MascotaContext";
import { Prioridad } from "../../types/Enums";

export default function EditarHabitoScreen() {
  const { habitos, actualizar, eliminar } = useHabitos();
  const { setAnimacion, cambiarFelicidad, mascota, subirXP } = useMascota();

  // Estado para rastrear el hábito seleccionado
  const [selectedHabito, setSelectedHabito] = useState<any | null>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<Prioridad>(Prioridad.BAJA);

  const colorPrioridad = (p: string) =>
    p === "Alta" ? "#E25C80" : p === "Media" ? "#F4A261" : "#5A4341";

  // Seleccionar un hábito para editar
  const selectHabito = (habito: any) => {
    setSelectedHabito(habito);
    setNombre(habito.titulo);
    setDescripcion(habito.descripcion || "");
    setPrioridad(habito.prioridad || Prioridad.BAJA);
  };

  const handleUpdate = async () => {
    if (!selectedHabito) return;
    if (!nombre) {
      Alert.alert("Campo requerido", "El nombre del hábito es obligatorio.");
      return;
    }
    try {
      await actualizar(selectedHabito.id, {
        titulo: nombre,
        descripcion,
        prioridad,
      });
      Alert.alert(
        "Hábito Actualizado",
        "Los cambios han sido guardados correctamente.",
      );
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar el hábito.");
    }
  };

  const handleDelete = () => {
    if (!selectedHabito) return;
    Alert.alert(
      "Eliminar Hábito",
      "¿Estás seguro de que deseas eliminar este hábito?\nTu mascota se pondrá triste 😢",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminar(selectedHabito.id);
              // Animación triste de la mascota al borrar un hábito
              setAnimacion("CRY", 4000);
              if (mascota) {
                const felicidadActual = mascota.felicidad ?? 100;
                await cambiarFelicidad(Math.max(0, felicidadActual - 10));
                await subirXP(-50);
              }
              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "No se pudo eliminar el hábito.");
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView className="flex-1 bg-[#FFFF] px-6 pt-12">
      {/* Cabecera del Modal */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-[#311917]">
          {selectedHabito ? "Editar Hábito" : "Tus Hábitos"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-[#FFEBEB] rounded-full"
        >
          <Ionicons name="close" size={20} color="#4A3E3D" />
        </TouchableOpacity>
      </View>

      {!selectedHabito ? (
        // Pantalla 1: Listado de hábitos para seleccionar
        <View className="mb-12">
          <Text className="text-sm text-[#5A4341] mb-4">
            Selecciona el hábito que deseas modificar o eliminar:
          </Text>

          {habitos && habitos.length > 0 ? (
            habitos.map((habito) => (
              <TouchableOpacity
                key={habito.id}
                onPress={() => selectHabito(habito)}
                className="bg-white p-4 rounded-2xl mb-3 border border-[#FFEBEB] flex-row justify-between items-center shadow-sm"
              >
                <View className="flex-1 pr-4">
                  <Text
                    className="text-[10px] font-bold mb-0.5"
                    style={{
                      color: colorPrioridad(habito.prioridad ?? "Baja"),
                    }}
                  >
                    {habito.prioridad || "Normal"}
                  </Text>
                  <Text className="text-sm font-bold text-[#4A3E3D]">
                    {habito.titulo}
                  </Text>
                  {habito.descripcion ? (
                    <Text className="text-xs text-[#7A6F62] mt-0.5">
                      {habito.descripcion}
                    </Text>
                  ) : null}
                </View>
                <Ionicons name="chevron-forward" size={18} color="#A39A90" />
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-white p-8 rounded-2xl border border-[#F3ECE0] items-center">
              <Text className="text-xs text-[#7A6F62] text-center">
                No tienes hábitos creados todavía. ¡Agrega uno nuevo en el botón
                principal!
              </Text>
            </View>
          )}
        </View>
      ) : (
        // Pantalla 2: Formulario de edición del hábito seleccionado
        <View className="mb-12">
          {/* Botón Volver al Listado */}
          <TouchableOpacity
            onPress={() => setSelectedHabito(null)}
            className="flex-row items-center mb-4"
          >
            <Ionicons
              name="arrow-back"
              size={16}
              color="#F297A0"
              className="mr-1"
            />
            <Text className="text-xs font-bold text-[#F297A0]">
              Volver al listado
            </Text>
          </TouchableOpacity>

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

          {/* Botones de Acción */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleUpdate}
              className="bg-[#F297A0] py-4 rounded-2xl items-center shadow-sm"
            >
              <Text className="text-white font-bold text-base">
                Guardar Cambios
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="border border-[#F297A0] py-4 rounded-2xl items-center"
            >
              <Text className="text-[#F297A0] font-bold text-base">
                Eliminar Hábito
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
