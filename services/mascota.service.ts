import { supabase } from "../supabase/client";

// Obtener mascota seleccionada del usuario
export async function obtenerMascota(usuarioId: string) {
  const { data, error } = await supabase
    .from("mascota_usuario")
    .select(`*, mascota(*)`)
    .eq("usuario_id", usuarioId)
    .eq("seleccionada", true)
    .single();
  if (error) throw error;
  return data;
}

// Obtener catálogo completo de mascotas (con flag seleccionada)
export async function obtenerTodasMascotas(usuarioId: string) {
  const { data: catalogo, error } = await supabase.from("mascota").select("*");
  if (error) throw error;

  const { data: misMascotas } = await supabase
    .from("mascota_usuario")
    .select("mascota_id, seleccionada")
    .eq("usuario_id", usuarioId);

  const mapaSeleccion = new Map(
    (misMascotas ?? []).map((m: any) => [m.mascota_id, m.seleccionada])
  );

  return (catalogo ?? []).map((m: any) => ({
    ...m,
    seleccionada: mapaSeleccion.get(m.id) === true,
  }));
}

// Seleccionar mascota activa — todas comparten el mismo registro de stats
export async function seleccionarMascota(usuarioId: string, mascotaId: number) {
  // 1. Deseleccionar todas (por si hay registros legacy)
  const { error: errDeselect } = await supabase
    .from("mascota_usuario")
    .update({ seleccionada: false })
    .eq("usuario_id", usuarioId);
  if (errDeselect) throw errDeselect;

  // 2. Buscar si ya existe un registro principal para este usuario
  const { data: existing } = await supabase
    .from("mascota_usuario")
    .select("id")
    .eq("usuario_id", usuarioId)
    .maybeSingle();

  if (existing?.id) {
    // Ya existe → solo cambiamos mascota_id (stats compartidos)
    const { data, error } = await supabase
      .from("mascota_usuario")
      .update({ mascota_id: mascotaId, seleccionada: true })
      .eq("id", existing.id)
      .select(`*, mascota(*)`)
      .single();
    if (error) throw error;
    return data;
  } else {
    // Primera vez → crear registro con stats iniciales
    const { data, error } = await supabase
      .from("mascota_usuario")
      .insert({
        usuario_id: usuarioId,
        mascota_id: mascotaId,
        seleccionada: true,
        xp: 0,
        nivel: 1,
        felicidad: 100,
        vida: 100,
      })
      .select(`*, mascota(*)`)
      .single();
    if (error) throw error;
    return data;
  }
}

// Actualizar XP y nivel (ambas columnas existen en DB)
export async function actualizarXPyNivel(id: string, xp: number, nivel: number) {
  const { data, error } = await supabase
    .from("mascota_usuario")
    .update({ xp, nivel })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Actualizar solo XP
export async function actualizarXP(id: string, xp: number) {
  const { data, error } = await supabase
    .from("mascota_usuario")
    .update({ xp })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Actualizar vida
export async function actualizarVida(id: string, vida: number) {
  const { data, error } = await supabase
    .from("mascota_usuario")
    .update({ vida })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Actualizar felicidad
export async function actualizarFelicidad(id: string, felicidad: number) {
  const { data, error } = await supabase
    .from("mascota_usuario")
    .update({ felicidad })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Contar cuántos hábitos completó el usuario en total (desde historial)
export async function contarHabitosCompletados(usuarioId: string): Promise<number> {
  // Obtener IDs de hábitos del usuario
  const { data: habitos } = await supabase
    .from("habito")
    .select("id")
    .eq("usuario_id", usuarioId);

  if (!habitos || habitos.length === 0) return 0;

  const ids = habitos.map((h: any) => h.id);
  const { count } = await supabase
    .from("historial")
    .select("*", { count: "exact", head: true })
    .in("habito_id", ids)
    .eq("completado", true);

  return count ?? 0;
}

// Calcular racha actual y mejor racha de días consecutivos basados en el historial
export async function calcularRachas(usuarioId: string): Promise<{ rachaActual: number; mejorRacha: number }> {
  // Obtener IDs de hábitos del usuario
  const { data: habitos } = await supabase
    .from("habito")
    .select("id")
    .eq("usuario_id", usuarioId);

  if (!habitos || habitos.length === 0) return { rachaActual: 0, mejorRacha: 0 };

  const ids = habitos.map((h: any) => h.id);
  const { data: historial } = await supabase
    .from("historial")
    .select("created_at")
    .in("habito_id", ids)
    .eq("completado", true);

  if (!historial || historial.length === 0) return { rachaActual: 0, mejorRacha: 0 };

  // Obtener lista de fechas únicas en formato local YYYY-MM-DD
  const fechasSet = new Set<string>();
  historial.forEach((item: any) => {
    if (item.created_at) {
      // Ajustamos a huso horario local quitando la parte de la hora después de convertir a fecha
      const dateObj = new Date(item.created_at);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      fechasSet.add(`${year}-${month}-${day}`);
    }
  });

  const fechasOrdenadas = Array.from(fechasSet).sort((a, b) => b.localeCompare(a));

  if (fechasOrdenadas.length === 0) return { rachaActual: 0, mejorRacha: 0 };

  // Obtener fecha de hoy y ayer
  const hoyObj = new Date();
  const hoyStr = `${hoyObj.getFullYear()}-${String(hoyObj.getMonth() + 1).padStart(2, '0')}-${String(hoyObj.getDate()).padStart(2, '0')}`;
  
  const ayerObj = new Date();
  ayerObj.setDate(ayerObj.getDate() - 1);
  const ayerStr = `${ayerObj.getFullYear()}-${String(ayerObj.getMonth() + 1).padStart(2, '0')}-${String(ayerObj.getDate()).padStart(2, '0')}`;

  let rachaActual = 0;
  let ultimaFechaVerificada = hoyStr;

  if (!fechasSet.has(hoyStr)) {
    if (fechasSet.has(ayerStr)) {
      ultimaFechaVerificada = ayerStr;
    } else {
      rachaActual = 0;
    }
  }

  if (fechasSet.has(ultimaFechaVerificada)) {
    rachaActual = 1;
    let fechaVerificar = new Date();
    if (ultimaFechaVerificada === ayerStr) {
      fechaVerificar.setDate(fechaVerificar.getDate() - 1);
    }
    
    while (true) {
      fechaVerificar.setDate(fechaVerificar.getDate() - 1);
      const strFecha = `${fechaVerificar.getFullYear()}-${String(fechaVerificar.getMonth() + 1).padStart(2, '0')}-${String(fechaVerificar.getDate()).padStart(2, '0')}`;
      if (fechasSet.has(strFecha)) {
        rachaActual++;
      } else {
        break;
      }
    }
  }

  // Calcular mejor racha (histórica)
  let mejorRacha = 0;
  let rachaTemporal = 0;
  
  const fechasAsc = Array.from(fechasSet).sort((a, b) => a.localeCompare(b));
  let ultimaFechaStr: string | null = null;

  for (const strF of fechasAsc) {
    if (!ultimaFechaStr) {
      rachaTemporal = 1;
    } else {
      // Calcular diferencia de días entre fechas consecutivas
      const d1 = new Date(ultimaFechaStr);
      const d2 = new Date(strF);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        if (diffDays === 1) {
          rachaTemporal++;
        }
      } else {
        rachaTemporal = 1;
      }
    }
    if (rachaTemporal > mejorRacha) {
      mejorRacha = rachaTemporal;
    }
    ultimaFechaStr = strF;
  }

  return { rachaActual, mejorRacha: Math.max(mejorRacha, rachaActual) };
}
