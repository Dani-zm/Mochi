import { Prioridad, Frecuencia } from "./Enums";

export type HabitoForm = {
  titulo: string;

  descripcion?: string;

  prioridad: Prioridad;

  frecuencia: Frecuencia;

  hora_recordatorio?: string;
};

export type HabitoFiltro = {
  activos?: boolean;

  prioridad?: Prioridad;
};
