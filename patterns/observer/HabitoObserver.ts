// =============================================================
// PATRÓN OBSERVADOR aplicado a Mochi
// Cuando el usuario completa un hábito, el "sujeto" notifica
// a todos sus observadores: la mascota sube XP, sube felicidad
// y puede cambiar de animación automáticamente
// =============================================================

export interface IObservador {
  actualizar(evento: string, datos: any): void;
}

// -------- Sujeto (quien notifica) --------

export class HabitoSujeto {
  private observadores: IObservador[] = [];

  suscribir(obs: IObservador) {
    this.observadores.push(obs);
  }

  desuscribir(obs: IObservador) {
    this.observadores = this.observadores.filter((o) => o !== obs);
  }

  notificar(evento: string, datos: any) {
    for (const obs of this.observadores) {
      obs.actualizar(evento, datos);
    }
  }

  completarHabito(habitoId: string, prioridad: string) {
    console.log(`[Sujeto] Hábito "${habitoId}" completado.`);
    this.notificar("HABITO_COMPLETADO", { habitoId, prioridad });
  }
}

// -------- Observadores concretos --------

export class ObservadorXP implements IObservador {
  actualizar(evento: string, datos: any) {
    if (evento === "HABITO_COMPLETADO") {
      const xp =
        datos.prioridad === "Alta" ? 50 : datos.prioridad === "Media" ? 35 : 20;
      console.log(`[XP] La mascota ganó +${xp} XP`);
    }
  }
}

export class ObservadorFelicidad implements IObservador {
  actualizar(evento: string, datos: any) {
    if (evento === "HABITO_COMPLETADO") {
      const fel =
        datos.prioridad === "Alta" ? 15 : datos.prioridad === "Media" ? 7 : 3;
      console.log(`[Felicidad] La mascota ganó +${fel} de felicidad`);
    }
  }
}

export class ObservadorAnimacion implements IObservador {
  actualizar(evento: string, _datos: any) {
    if (evento === "HABITO_COMPLETADO") {
      console.log(`[Animación] La mascota muestra animación: HAPPY`);
    }
  }
}
