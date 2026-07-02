import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import {
  obtenerMascota,
  actualizarXP,
  actualizarXPyNivel,
  actualizarVida,
  actualizarFelicidad,
  seleccionarMascota as seleccionarMascotaService,
  contarHabitosCompletados,
  calcularRachas,
} from "../services/mascota.service";
import { useAuth } from "./AuthContext";
import { obtenerDuracionAnimacion } from "../services/sprite.service";

export type EstadoAnimacion =
  | "IDLE"
  | "HAPPY"
  | "CELEBRATE"
  | "CRY"
  | "SLEEP"
  | "TOUCH";

interface MascotaContextType {
  mascota: any;
  estadoAnimacion: EstadoAnimacion;
  habitosCompletados: number; 
  rachaActual: number; 
  mejorRacha: number; 
  cargarMascota: () => Promise<void>;
  subirXP: (cantidad: number) => Promise<void>;
  cambiarVida: (valor: number) => Promise<void>;
  cambiarFelicidad: (valor: number) => Promise<void>;
  seleccionarMascota: (mascotaId: number) => Promise<void>;
  setAnimacion: (estado: EstadoAnimacion, duracionMs?: number) => void;
}

const MascotaContext = createContext<MascotaContextType | undefined>(undefined);

export function MascotaProvider({ children }: { children: ReactNode }) {
  const [mascota, setMascota] = useState<any>(null);
  const [estadoAnimacion, setEstadoAnimacion] =
    useState<EstadoAnimacion>("IDLE");
  const [habitosCompletados, setHabitosCompletados] = useState(0);
  const [rachaActual, setRachaActual] = useState(0);
  const [mejorRacha, setMejorRacha] = useState(0);
  const { user } = useAuth();

  async function cargarMascota() {
    if (!user) return;
    try {
      const data = await obtenerMascota(user.id);
      setMascota(data);
    } catch (e) {
      console.log("No se pudo cargar mascota:", e);
    }
    // Contar habitos completados desde historial
    try {
      const total = await contarHabitosCompletados(user.id);
      setHabitosCompletados(total);
    } catch {
      // sin error visible
    }
    // Calcular rachas desde historial
    try {
      const stats = await calcularRachas(user.id);
      setRachaActual(stats.rachaActual);
      setMejorRacha(stats.mejorRacha);
    } catch {
      // sin error visible
    }
  }

  useEffect(() => {
    cargarMascota();
  }, [user]);

  // Subir XP con lógica de nivel automática (soporta subir y bajar)
  async function subirXP(cantidad: number) {
    if (!mascota) return;
    let nuevaXP = (mascota.xp ?? 0) + cantidad;
    let nuevoNivel = mascota.nivel ?? 1;
    const xpParaSiguiente = nuevoNivel * 1000;

    let levelUp = false;
    if (nuevaXP >= xpParaSiguiente) {
      nuevaXP = nuevaXP - xpParaSiguiente;
      nuevoNivel += 1;
      levelUp = true;
    } else if (nuevaXP < 0) {
      if (nuevoNivel > 1) {
        nuevoNivel -= 1;
        nuevaXP = nuevoNivel * 1000 + nuevaXP;
        if (nuevaXP < 0) nuevaXP = 0;
      } else {
        nuevaXP = 0;
      }
    }

    // Intentar guardar en DB
    let data: any = null;
    try {
      data = await actualizarXPyNivel(mascota.id, nuevaXP, nuevoNivel);
    } catch {
      try {
        data = await actualizarXP(mascota.id, nuevaXP);
      } catch {
        /* ignorar */
      }
    }

    // Actualizar estado local siempre
    setMascota((prev: any) => ({
      ...prev,
      ...(data ?? {}),
      xp: nuevaXP,
      nivel: nuevoNivel,
      mascota: prev?.mascota,
    }));

    // Contar habitos localmente
    setHabitosCompletados((n) => n + 1);

    if (levelUp) setAnimacion("CELEBRATE", obtenerDuracionAnimacion(mascota?.mascota?.nombre ?? "Kirby", "CELEBRATE"));
  }

  async function cambiarVida(valor: number) {
    if (!mascota) return;
    try {
      const data = await actualizarVida(
        mascota.id,
        Math.max(0, Math.min(100, valor)),
      );
      setMascota((prev: any) => ({ ...prev, ...data, mascota: prev?.mascota }));
    } catch (e) {
      console.error(e);
    }
  }

  async function cambiarFelicidad(valor: number) {
    if (!mascota) return;
    try {
      const data = await actualizarFelicidad(
        mascota.id,
        Math.max(0, Math.min(100, valor)),
      );
      setMascota((prev: any) => ({ ...prev, ...data, mascota: prev?.mascota }));
    } catch (e) {
      console.error(e);
    }
  }

  // ── Ciclo de vida cada 30s ──
  const mascotaRef = useRef(mascota);
  mascotaRef.current = mascota;

  useEffect(() => {
    if (!mascotaRef.current) return;
    const interval = setInterval(async () => {
      const m = mascotaRef.current;
      if (!m) return;
      const fel = m.felicidad ?? 100;
      const vid = m.vida ?? 100;

      if (fel >= 80) {
        if (vid < 100) {
          await cambiarVida(Math.min(100, vid + 10));
        }
      } else {
        if (vid < 50) {
          await cambiarVida(Math.max(0, vid - 2));
        } else {
          await cambiarVida(Math.max(0, vid - 1));
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [mascota?.id]);

  async function seleccionarMascota(mascotaId: number) {
    if (!user) return;
    const data = await seleccionarMascotaService(user.id, mascotaId);
    setMascota(data);
    await cargarMascota();
    const nombreMascota = data?.mascota?.nombre ?? "Kirby";
    setAnimacion("HAPPY", obtenerDuracionAnimacion(nombreMascota, "HAPPY"));
  }

  function setAnimacion(estado: EstadoAnimacion, duracionMs = 3000) {
    setEstadoAnimacion(estado);
    if (estado !== "IDLE") {
      setTimeout(() => setEstadoAnimacion("IDLE"), duracionMs);
    }
  }

  return (
    <MascotaContext.Provider
      value={{
        mascota,
        estadoAnimacion,
        habitosCompletados,
        rachaActual,
        mejorRacha,
        cargarMascota,
        subirXP,
        cambiarVida,
        cambiarFelicidad,
        seleccionarMascota,
        setAnimacion,
      }}
    >
      {children}
    </MascotaContext.Provider>
  );
}

export function useMascota() {
  const context = useContext(MascotaContext);
  if (!context) throw new Error("MascotaContext fuera del Provider");
  return context;
}
