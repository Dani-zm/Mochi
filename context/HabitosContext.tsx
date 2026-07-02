import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  obtenerHabitos,
  crearHabito,
  completarHabito,
  descompletarHabito,
  eliminarHabito,
  actualizarHabito,
} from "../services/habito.service";

import { HabitoForm } from "../types/Habito";

import { useAuth } from "./AuthContext";

interface HabitosContextType {
  habitos: any[];

  cargarHabitos: () => Promise<void>;

  agregarHabito: (data: HabitoForm) => Promise<void>;

  completar: (id: string) => Promise<void>;

  descompletar: (id: string) => Promise<void>;

  eliminar: (id: string) => Promise<void>;

  actualizar: (id: string, data: Partial<HabitoForm>) => Promise<void>;
}

const HabitosContext = createContext<HabitosContextType | undefined>(undefined);

export function HabitosProvider({ children }: { children: ReactNode }) {
  const [habitos, setHabitos] = useState<any[]>([]);

  const { user } = useAuth();

  async function cargarHabitos() {
    if (!user) return;

    const data = await obtenerHabitos(user.id);

    setHabitos(data);
  }

  useEffect(() => {
    cargarHabitos();
  }, [user]);

  async function agregarHabito(data: HabitoForm) {
    if (!user) return;

    const nuevo = await crearHabito(user.id, data);

    setHabitos((prev) => [...prev, nuevo]);
  }

  async function completar(id: string) {
    // Guard: si ya se completó hoy, no volver a insertar ni sumar XP
    const yaCompletado = habitos.find((h) => h.id === id)?.completado_hoy;
    if (yaCompletado) return;

    await completarHabito(id);

    // Marcar como completado_hoy en estado local (sin revertirse durante el día)
    setHabitos((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, completado_hoy: true }
          : h,
      ),
    );
  }

  async function descompletar(id: string) {
    const yaCompletado = habitos.find((h) => h.id === id)?.completado_hoy;
    if (!yaCompletado) return;

    await descompletarHabito(id);

    // Marcar como completado_hoy: false
    setHabitos((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, completado_hoy: false }
          : h,
      ),
    );
  }

  async function eliminar(id: string) {
    await eliminarHabito(id);
    setHabitos((prev) => prev.filter((h) => h.id !== id));
  }

  async function actualizar(id: string, updates: Partial<HabitoForm>) {
    const updated = await actualizarHabito(id, updates);
    setHabitos((prev) => prev.map((h) => (h.id === id ? { ...h, ...updated } : h)));
  }

  return (
    <HabitosContext.Provider
      value={{
        habitos,

        cargarHabitos,

        agregarHabito,

        completar,

        descompletar,

        eliminar,

        actualizar,
      }}
    >
      {children}
    </HabitosContext.Provider>
  );
}

export function useHabitos() {
  const context = useContext(HabitosContext);

  if (!context) throw new Error("HabitosContext fuera de Provider");

  return context;
}
