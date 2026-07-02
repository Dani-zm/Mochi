import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Alert } from "../../utils/Alert";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMascota } from "../../context/MascotaContext";
import { useAuth } from "../../context/AuthContext";
import { obtenerTodasMascotas } from "../../services/mascota.service";
import { FactoryProvider } from "../../patterns/factory/FactoryProvider";

const PREVIEW: Record<string, any> = {
  kirby: require("../../assets/mascotas/kirby/shime1.png"),
  ayaka: require("../../assets/mascotas/ayaka/shime1.png"),
  miku: require("../../assets/mascotas/miku/shime1.png"),
  caine: require("../../assets/mascotas/caine/shime1.png"),
};
const hora = new Date().getHours();
const saludo =
  hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
export default function MascotasScreen() {
  const { user } = useAuth();
  const { mascota, seleccionarMascota, cargarMascota } = useMascota();
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const usuarioNombre =
    user?.user_metadata?.nombre || user?.email?.split("@")[0] || "Usuario";
  const mascotaActivaId = mascota?.mascota_id ?? mascota?.mascota?.id;

  useEffect(() => {
    if (user) cargar();
  }, [user]);

  async function cargar() {
    setCargando(true);
    try {
      const data = await obtenerTodasMascotas(user!.id);
      setMascotas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }

  async function handleSeleccionar(m: any) {
    if (m.id === mascotaActivaId) return; 
    Alert.alert(
      `Elegir a ${m.nombre}`,
      `¿Quieres que ${m.nombre} sea tu mascota activa?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "¡Sí, elegir!",
          onPress: async () => {
            try {
              await seleccionarMascota(m.id);
              await cargarMascota();
              await cargar();
              Alert.alert(
                "¡Mascota cambiada!",
                `Ahora ${m.nombre} es tu mascota activa`,
              );
            } catch (e: any) {
              Alert.alert(
                "Error",
                e.message ?? "No se pudo cambiar la mascota",
              );
            }
          },
        },
      ],
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#FFFF]">
      {/* Cabecera */}
      <View className="bg-[#F297A0] flex-row justify-between items-center px-6 pt-4 pb-4 mb-6">
        <View>
          <Text className="text-2xl font-bold text-[#ffffff]">⋆˖ Mochi ˖⋆</Text>
          <Text className="text-sm text-[#ffffff]">
            {saludo}, {usuarioNombre}!
          </Text>
        </View>
        <View className="p-2 bg-[#c7787f7e] rounded-full opacity-40">
          <Ionicons name="sunny-outline" size={20} color="#F3EBD8" />
        </View>
      </View>

      {/* Info de mascota activa */}
      {mascota?.mascota && (
        <View className="mx-6 mb-4  bg-[#FFEBEB] rounded-2xl p-4 flex-row items-center gap-3">
          <Ionicons name="heart" size={18} color="#F297A0" />
          <Text className="text-sm text-[#8B5E5E] font-semibold">
            Activa: {mascota.mascota.nombre}
          </Text>
        </View>
      )}

      {cargando ? (
        <ActivityIndicator color="#F297A0" className="mt-10" />
      ) : (
        <View className="flex-row flex-wrap justify-between px-6 gap-y-4 pb-10">
          {mascotas.map((m) => {
            const factory = FactoryProvider.crear(m.nombre);
            const folder = factory.getSpriteFolder();
            const imagen = PREVIEW[folder] ?? PREVIEW["kirby"];
            const esActiva = m.id === mascotaActivaId;

            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => handleSeleccionar(m)}
                className={`w-[47%] rounded-3xl p-4 border items-center ${
                  esActiva
                    ? "bg-white border-3 border-[#FFB7B7]"
                    : "bg-white border-3 border-[#FFEBEB]"
                }`}
              >
                {/* Badge de activa */}
                {esActiva && (
                  <View className="absolute top-1 right-2 bg-[#F297A0] rounded-full px-2 py-0.5">
                    <Text className="text-white text-[10px] font-bold">
                      Activa ♥
                    </Text>
                  </View>
                )}

                <Text className="text-lg font-bold text-[#F297A0] mb-2 mt-2 ">
                  {m.nombre}
                </Text>
                <Image
                  source={imagen}
                  style={{ width: 90, height: 90 }}
                  resizeMode="contain"
                />
                {m.descripcion && (
                  <Text
                    className="text-[12px] font-semibold text-[#5A4341] text-center mt-2"
                    numberOfLines={2}
                  >
                    {m.descripcion}
                  </Text>
                )}
                <View
                  className={`mt-3 px-4 py-1.5 rounded-full ${
                    esActiva ? "bg-[#F297A0]" : "bg-[#B6BB79]"
                  }`}
                >
                  <Text className="text-white text-xs font-bold">
                    {esActiva ? "Seleccionada" : "Elegir"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
