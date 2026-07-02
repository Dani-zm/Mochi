import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useHabitos } from "../../context/HabitosContext";
import { useMascota } from "../../context/MascotaContext";
import { useAuth } from "../../context/AuthContext";
import {
  HabitoSujeto,
  ObservadorXP,
  ObservadorFelicidad,
  ObservadorAnimacion,
} from "../../patterns/observer/HabitoObserver";
import { crearRecompensaPorPrioridad } from "../../patterns/strategy/RecompensaStrategy";
import {
  obtenerFrames,
  obtenerClavePersonaje,
  obtenerFrase,
  obtenerAnimacionAleatoria,
  obtenerVelocidadFrame,
  obtenerEstadoEfectivo,
  obtenerMensajeEstado,
  obtenerDuracionAnimacion,
} from "../../services/sprite.service";

// Sujeto Observer (singleton de la pantalla)
const habitoSujeto = new HabitoSujeto();
habitoSujeto.suscribir(new ObservadorXP());
habitoSujeto.suscribir(new ObservadorFelicidad());
habitoSujeto.suscribir(new ObservadorAnimacion());

export default function HomeScreen() {
  const { user } = useAuth();
  const { habitos, completar, descompletar } = useHabitos();
  const {
    mascota,
    estadoAnimacion,
    subirXP,
    cambiarFelicidad,
    cambiarVida,
    setAnimacion,
    rachaActual,
    habitosCompletados,
  } = useMascota();
  const scrollRef = useRef<ScrollView>(null);

  // ── Subir al tope cuando volvemos de un modal (Agregar/Editar) ───────────
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, []),
  );

  // ── Datos del usuario ─────────────────────────────────────────────────────
  const usuarioNombre =
    user?.user_metadata?.nombre || user?.email?.split("@")[0] || "Usuario";

  // ── Sprite service ────────────────────────────────────────────────────────
  const mascotaNombre: string = mascota?.mascota?.nombre ?? "Kirby";
  const petKey = obtenerClavePersonaje(mascotaNombre);

  const nivel = mascota?.nivel ?? 1;
  const xp = mascota?.xp ?? 0;
  const maxXP = nivel * 1000;
  const felicidad = mascota?.felicidad ?? 100;
  const vida = mascota?.vida ?? 100;
  const rachaDias = rachaActual;
  const habitosCompletadosTotal = habitosCompletados;

  // ── Animación sin parpadeo ────────────────────────────────────────────────
  const [frameIdx, setFrameIdx] = useState(0);

  const frameSpeed = obtenerVelocidadFrame(estadoAnimacion);

  useEffect(() => {
    if (estadoAnimacion !== "IDLE") {
      setFrameIdx(0);
    }
  }, [estadoAnimacion, petKey]);

  // Frames efectivos: si vida <= 0 o felicidad baja → CRY
  const estadoEfectivo = obtenerEstadoEfectivo(
    estadoAnimacion,
    felicidad,
    vida,
  );
  const currentFrames = obtenerFrames(mascotaNombre, estadoEfectivo);

  useEffect(() => {
    if (currentFrames.length <= 1) return;
    const interval = setInterval(() => {
      setFrameIdx((i) => (i + 1) % currentFrames.length);
    }, frameSpeed);
    return () => clearInterval(interval);
  }, [currentFrames, frameSpeed]);

  // ── Frase aleatoria del personaje ─────────────────────────────────────────
  const [fraseActual, setFraseActual] = useState(() =>
    obtenerFrase(mascotaNombre),
  );

  useEffect(() => {
    setFraseActual(obtenerFrase(mascotaNombre));
  }, [petKey]);

  // ── Saludo según hora ─────────────────────────────────────────────────────
  const hora = new Date().getHours();
  const saludo =
    hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  // ── Tocar mascota → animación aleatoria ──────────────────────────────────
  const handleTocarMascota = () => {
    const anim = obtenerAnimacionAleatoria();
    setAnimacion(anim, obtenerDuracionAnimacion(mascotaNombre, anim));
  };

  // ── Toggle de hábito: si ya está completado → desmarcar con CRY ──────────
  const handleToggleHabito = async (habito: any) => {
    if (habito.completado_hoy) {
      // Desmarcar: quitar del historial, bajar xp/felicidad
      try {
        await descompletar(habito.id);
      } catch (e) {
        console.error(e);
      }
      try {
        if (mascota) {
          const recompensa = crearRecompensaPorPrioridad(
            habito.prioridad ?? "Baja",
          );
          await subirXP(-recompensa.obtenerXP());
          await cambiarFelicidad(
            Math.max(0, felicidad - recompensa.obtenerFelicidad()),
          );
        }
      } catch (e) {
        console.error(e);
      }
      setAnimacion("CRY", obtenerDuracionAnimacion(mascotaNombre, "CRY"));
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      // Completar: Patrón Estrategia
      const recompensa = crearRecompensaPorPrioridad(
        habito.prioridad ?? "Baja",
      );
      const xpGanado = recompensa.obtenerXP();
      const felicidadGanada = recompensa.obtenerFelicidad();

      try {
        await completar(habito.id);
      } catch (e) {
        console.error("Error al guardar en historial:", e);
      }

      try {
        if (mascota) {
          await subirXP(xpGanado);
          await cambiarFelicidad(Math.min(100, felicidad + felicidadGanada));
        }
      } catch (e) {
        console.error("Error al actualizar mascota:", e);
      }

      // Patrón Observer
      habitoSujeto.completarHabito(habito.id, habito.prioridad ?? "Baja");
      setAnimacion("HAPPY", obtenerDuracionAnimacion(mascotaNombre, "HAPPY"));
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  // ── Ordenar hábitos: sin completar primero ────────────────────────────────
  const habitosOrdenados = [...habitos].sort((a, b) => {
    if (a.completado_hoy === b.completado_hoy) return 0;
    return a.completado_hoy ? 1 : -1;
  });

  const colorPrioridad = (p: string) =>
    p === "Alta" ? "#F297A0" : p === "Media" ? "#eeafbd" : "#eeafbd92";

  const totalHoy = habitos.length;
  const completadosHoy = habitos.filter((h) => h.completado_hoy).length;
  const progresoHoy = totalHoy > 0 ? (completadosHoy / totalHoy) * 100 : 0;

  return (
    <ScrollView ref={scrollRef} className="flex-1 bg-[#ffff]">
      <StatusBar
        barStyle="dark-content" 
        backgroundColor="#fff" 
        translucent={true} 
      />
      {/* ─── Cabecera ─────────────────────────────────────────────────── */}
      <View className="bg-[#F297A0] flex-row justify-between items-center px-6 pt-4 pb-4 ">
        <View>
          <Text className="text-2xl font-bold text-[#ffffff]">⋆˖ Mochi ˖⋆</Text>
          <Text className="text-sm text-[#ffff]">
            {saludo}, {usuarioNombre}!
          </Text>
        </View>
        <View className="p-2 bg-[#c7787f7e] rounded-full opacity-40">
          <Ionicons name="sunny-outline" size={20} color="#F3EBD8" />
        </View>
      </View>

      {/* ─── Caja de Mascota ───────────────────────────────────────────── */}
      <TouchableOpacity
        onPress={handleTocarMascota}
        activeOpacity={0.92}
        className="mx-6 mt-5 bg-white rounded-4xl p-6 border-3 border-[#FFB7B7] items-center shadow-sm"
      >
        <Text className="text-2xl font-black text-[#F297A0]">
          {mascotaNombre}
        </Text>
        <Text className="text-[16px] font-semibold text-[#FFB7B7] mb-3">
          {obtenerMensajeEstado(estadoEfectivo, vida, felicidad)}
        </Text>

        {/* Sprite sin fade */}
        <Image
          key={`${petKey}-${estadoEfectivo}-${frameIdx}`}
          source={currentFrames[frameIdx]}
          style={{ width: 140, height: 140 }}
          resizeMode="contain"
        />

        {/* ── Vida y Felicidad dentro de la tarjeta ── */}
        <View className="w-full mt-4 gap-2">
          <View>
            <View className="flex-row justify-between mb-0.5">
              <Text className="text-[12px] text-[#F297A0] font-semibold">
                ♡ Vida
              </Text>
              <Text className="text-[12px] text-[#F297A0] font-bold">
                {vida}%
              </Text>
            </View>
            <View className="h-1.5 bg-[#f297a080] rounded-full overflow-hidden">
              <View
                className="h-full"
                style={{
                  width: `${vida}%`,
                  backgroundColor: vida < 30 ? "#F297A0" : "#F297A0",
                }}
              />
            </View>
          </View>
          <View>
            <View className="flex-row justify-between mb-0.5">
              <Text className="text-[12px] text-[#B6BB79] font-semibold">
                •ᴗ• Felicidad
              </Text>
              <Text className="text-[12px] text-[#B6BB79] font-bold">
                {felicidad}%
              </Text>
            </View>
            <View className="h-1.5 bg-[#b5bb798c] rounded-full overflow-hidden">
              <View
                className="h-full"
                style={{
                  width: `${felicidad}%`,
                  backgroundColor: felicidad < 50 ? "#FFC48C" : "#B6BB79",
                }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* ─── Bocadillo de frase ─────────────────────────────────────────── */}
      <View
        className="
      flex-row  mx-6 mt-3 bg-[#FFF] rounded-full px-4 py-2.5 items-center border-2 border-[#FFEBEB]"
      >
        <View className="bg-[#FFEBEB] px-3 py-1 rounded-full mr-2">
          <Text className="text-[#5A4341] text-xs font-bold">
            {mascotaNombre}
          </Text>
        </View>
        <Text className="text-[#5A4341] text-[12px] font-semibold flex-1">
          {fraseActual} (¡Suerte {usuarioNombre}!)
        </Text>
      </View>

      {/* ─── XP + Barra de Progreso Diario ─────────────────────────────── */}
      <View className="flex-row mx-6 mt-3 gap-2">
        <View className="flex-1 bg-[#FFF] border-3 border-[#FFEBEB] p-4 rounded-2xl">
          <View className="flex-row justify-between mb-1">
            <Text className="text-xs font-bold text-[#5A4341]">
              Nivel {nivel}
            </Text>
            <Text className="text-[12px] text-[#5A4341] font-bold">XP</Text>
          </View>
          <View className="h-2 bg-[#E2D6C5] rounded-full overflow-hidden">
            <View
              className="h-full bg-[#B6BB79] "
              style={{ width: `${Math.min((xp / maxXP) * 100, 100)}%` }}
            />
          </View>
          <Text className="text-right text-[12px] text-[#5A4341] font-bold mt-1">
            {xp}/{maxXP}
          </Text>
        </View>

        <View className="flex-1 bg-[#FFF] border-3 border-[#FFEBEB] p-4 rounded-2xl">
          <View className="flex-row justify-between mb-1">
            <Text className="text-xs font-bold text-[#5A4341]">Hoy</Text>
            <Text className="text-[12px] text-[#5A4341] font-bold">
              {completadosHoy}/{totalHoy}
            </Text>
          </View>
          <View className="h-2 bg-[#f297a069] rounded-full overflow-hidden">
            <View
              className="h-full bg-[#F297A0] "
              style={{ width: `${progresoHoy}%` }}
            />
          </View>
          <Text className="text-right text-[12px] text-[#5A4341] mt-1 font-bold">
            {progresoHoy >= 100
              ? "¡Todo hecho!"
              : `${Math.round(progresoHoy)}%`}
          </Text>
        </View>
      </View>

      {/* ─── Rachas ────────────────────────────────────────────────────── */}
      <View className="flex-row mx-6 mt-2 bg-[#FFF] border-3 border-[#FFEBEB] p-4 rounded-2xl justify-around">
        <View className="items-center">
          <Text className="text-xl font-bold text-[#311917]">{rachaDias}</Text>
          <Text className="text-[12px] text-[#5A4341]">Día Racha</Text>
        </View>
        <View className="items-center">
          <Text className="text-xl font-bold text-[#311917]">
            {habitosCompletadosTotal}
          </Text>
          <Text className="text-[12px] text-[#5A4341]">Hábitos Cumplidos</Text>
        </View>
      </View>

      {/* ─── Lista de Hábitos ───────────────────────────────────────────── */}
      <View className="flex-row  justify-between items-center mx-6 mt-6">
        <Text className="text-[16px] font-bold text-[#4A3E3D]">
          Hábitos hoy
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/modal/editarHabito" as any)}
          className="flex-row items-center"
        >
          <Text className="text-xs text-[#5A4341] mr-1">Editar</Text>
          <Ionicons name="pencil" size={14} color="#5A4341" />
        </TouchableOpacity>
      </View>
      <View className="mx-6">
        <View className="flex-row justify-between items-center mb-3"></View>

        {habitosOrdenados.length > 0 ? (
          <ScrollView
            style={{ maxHeight: 320 }}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            className="pr-1 "
          >
            {habitosOrdenados.map((habito) => {
              const hecho = !!habito.completado_hoy;
              return (
                <View
                  key={habito.id}
                  className={`pl-3 pb-4 pr-4 pt-2 rounded-2xl mb-3 flex-row justify-between items-center ${
                    hecho
                      ? "bg-white border-3 border-[#b5bb7971]"
                      : "bg-white border-3 border-[#FFEBEB]"
                  }`}
                >
                  <View className="flex-1 pr-3 ">
                    <Text
                      className="text-[12px] font-bold mb-1"
                      style={{
                        color: colorPrioridad(habito.prioridad ?? "Baja"),
                      }}
                    >
                      {habito.prioridad || "Baja"}
                    </Text>
                    <View className="pl-5">
                      <Text
                        className={`text-sm font-bold ${
                          hecho
                            ? "text-[#B6BB79] line-through"
                            : "text-[#311917]"
                        }`}
                      >
                        {habito.titulo}
                      </Text>
                      <Text className="text-xs text-[#5A4341] mt-0.5">
                        {habito.descripcion || "Sin descripción"}
                      </Text>
                      {hecho && (
                        <Text className="text-[12px] text-[#B6BB79] mt-1 font-semibold">
                          ✓ Completado hoy (toca para desmarcar)
                        </Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleToggleHabito(habito)}
                    className={`w-11 h-11 rounded-full justify-center items-center ${
                      hecho ? "bg-[#B6BB79] " : "border-3 border-[#f8c7cc7e]"
                    }`}
                  >
                    <Ionicons
                      name="checkmark"
                      size={22}
                      color={hecho ? "white" : "#F8C7CC"}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View className="bg-white p-8 rounded-2xl border-3 border-[#FFEBEB] items-center">
            <Text className="text-[#5A4341] text-xs mt-2 text-center">
              • ᴖ •
            </Text>
            <Text className="text-[#5A4341] text-xs mt-2 text-center">
              No tienes hábitos para hoy{"\n"}¡Agrega uno nuevo abajo!
            </Text>
          </View>
        )}
      </View>

      {/* ─── Botón Agregar ──────────────────────────────────────────────── */}
      <View className="mx-6 mt-4 mb-10">
        <TouchableOpacity
          onPress={() => router.push("/modal/agregarHabito" as any)}
          className="bg-[#F297A0] py-4 rounded-2xl items-center shadow-sm"
        >
          <Text className="text-white font-bold text-[18px]">
            Agregar hábitos
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
