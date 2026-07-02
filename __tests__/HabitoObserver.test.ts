import {
  HabitoSujeto,
  ObservadorXP,
  ObservadorFelicidad,
  ObservadorAnimacion,
} from "../patterns/observer/HabitoObserver";

describe("HabitoObserver", () => {
  it("notifica a todos los observadores al completar hábito", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    const sujeto = new HabitoSujeto();

    sujeto.suscribir(new ObservadorXP());
    sujeto.suscribir(new ObservadorFelicidad());
    sujeto.suscribir(new ObservadorAnimacion());

    sujeto.completarHabito("hab-123", "Alta");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Hábito"),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("XP"),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Felicidad"),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Animación"),
    );

    consoleSpy.mockRestore();
  });

  it("notifica con XP correcta según prioridad", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    const sujeto = new HabitoSujeto();
    sujeto.suscribir(new ObservadorXP());

    sujeto.completarHabito("hab-1", "Media");
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("35"),
    );

    consoleSpy.mockRestore();
  });

  it("no notifica después de desuscribir", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    const sujeto = new HabitoSujeto();
    const obs = new ObservadorXP();
    sujeto.suscribir(obs);
    sujeto.desuscribir(obs);

    sujeto.completarHabito("hab-1", "Alta");
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("XP"),
    );

    consoleSpy.mockRestore();
  });

  it("soporta múltiples suscripciones del mismo tipo", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    const sujeto = new HabitoSujeto();
    sujeto.suscribir(new ObservadorXP());
    sujeto.suscribir(new ObservadorXP());

    sujeto.completarHabito("hab-1", "Baja");
    const xpCalls = consoleSpy.mock.calls.filter(
      (call) => call[0].includes("XP"),
    );
    expect(xpCalls).toHaveLength(2);

    consoleSpy.mockRestore();
  });
});
