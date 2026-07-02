import { supabase } from "../supabase/client";
import { HabitoForm } from "../types/Habito";

// crear hábito

export async function crearHabito(usuarioId: string, habito: HabitoForm) {
  const { data, error } = await supabase
    .from("habito")
    .insert({
      usuario_id: usuarioId,

      titulo: habito.titulo,

      descripcion: habito.descripcion,

      prioridad: habito.prioridad,

      frecuencia: habito.frecuencia,

      hora_recordatorio: habito.hora_recordatorio,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// obtener hábitos con flag "completado_hoy"
// Obtiene los hábitos activos del usuario y marca cuáles ya fueron
// completados hoy revisando el historial de esa fecha.

export async function obtenerHabitos(usuarioId: string) {
  const hoy = new Date().toISOString().split("T")[0]; // "2025-07-01"

  // 1. Traer hábitos activos
  const { data: habitos, error: errorHabitos } = await supabase
    .from("habito")
    .select("*")
    .eq("usuario_id", usuarioId)
    .eq("activo", true);

  if (errorHabitos) throw errorHabitos;
  if (!habitos) return [];

  // 2. Traer historial de HOY para este usuario
  const habitoIds = habitos.map((h) => h.id);
  const { data: historialHoy } = await supabase
    .from("historial")
    .select("habito_id")
    .in("habito_id", habitoIds)
    .gte("created_at", `${hoy}T00:00:00`)
    .lte("created_at", `${hoy}T23:59:59`);

  const completadosHoy = new Set((historialHoy ?? []).map((h: any) => h.habito_id));

  // 3. Mezclar el flag completado_hoy
  return habitos.map((h) => ({
    ...h,
    completado_hoy: completadosHoy.has(h.id),
  }));
}

// completar hábito

export async function completarHabito(habitoId: string) {
  const { data, error } = await supabase
    .from("historial")
    .insert({
      habito_id: habitoId,

      completado: true,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// descompletar hábito (borrar el historial de hoy para este hábito)
export async function descompletarHabito(habitoId: string) {
  const hoy = new Date().toISOString().split("T")[0];
  const { error } = await supabase
    .from("historial")
    .delete()
    .eq("habito_id", habitoId)
    .gte("created_at", `${hoy}T00:00:00`)
    .lte("created_at", `${hoy}T23:59:59`);

  if (error) throw error;
}

// eliminar

export async function eliminarHabito(id: string) {
  const { error } = await supabase
    .from("habito")
    .update({
      activo: false,
    })
    .eq("id", id);

  if (error) throw error;
}

// actualizar

export async function actualizarHabito(id: string, updates: Partial<HabitoForm>) {
  const { data, error } = await supabase
    .from("habito")
    .update({
      titulo: updates.titulo,
      descripcion: updates.descripcion,
      prioridad: updates.prioridad,
      frecuencia: updates.frecuencia,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
