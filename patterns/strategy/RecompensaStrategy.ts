// =============================================================
// PATRÓN ESTRATEGIA aplicado a Mochi
// Cada hábito tiene una prioridad. Según esa prioridad,
// se usa una estrategia distinta para calcular cuánto
// XP y felicidad le da a la mascota al completarlo.
// =============================================================


export interface IRecompensaStrategy {
  calcularXP(): number;
  calcularFelicidad(): number;
}

// -------- Estrategias concretas --------

export class BajaRecompensa implements IRecompensaStrategy {
  calcularXP() { return 20; }
  calcularFelicidad() { return 3; }
}

export class MediaRecompensa implements IRecompensaStrategy {
  calcularXP() { return 35; }
  calcularFelicidad() { return 7; }
}

export class AltaRecompensa implements IRecompensaStrategy {
  calcularXP() { return 50; }
  calcularFelicidad() { return 15; }
}

// -------- Contexto que usa la estrategia --------

export class RecompensaHabito {
  private strategy: IRecompensaStrategy;

  constructor(strategy: IRecompensaStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IRecompensaStrategy) {
    this.strategy = strategy;
  }

  obtenerXP() { return this.strategy.calcularXP(); }
  obtenerFelicidad() { return this.strategy.calcularFelicidad(); }
}

// -------- Función helper para usar en la app --------

export function crearRecompensaPorPrioridad(prioridad: string): RecompensaHabito {
  switch (prioridad) {
    case "Alta":  return new RecompensaHabito(new AltaRecompensa());
    case "Media": return new RecompensaHabito(new MediaRecompensa());
    default:      return new RecompensaHabito(new BajaRecompensa());
  }
}
