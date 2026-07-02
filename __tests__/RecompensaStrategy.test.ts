import { crearRecompensaPorPrioridad } from "../patterns/strategy/RecompensaStrategy";

describe("RecompensaStrategy", () => {
  it("devuelve BajaRecompensa para prioridad Baja", () => {
    const r = crearRecompensaPorPrioridad("Baja");
    expect(r.obtenerXP()).toBe(20);
    expect(r.obtenerFelicidad()).toBe(3);
  });

  it("devuelve MediaRecompensa para prioridad Media", () => {
    const r = crearRecompensaPorPrioridad("Media");
    expect(r.obtenerXP()).toBe(35);
    expect(r.obtenerFelicidad()).toBe(7);
  });

  it("devuelve AltaRecompensa para prioridad Alta", () => {
    const r = crearRecompensaPorPrioridad("Alta");
    expect(r.obtenerXP()).toBe(50);
    expect(r.obtenerFelicidad()).toBe(15);
  });

  it("devuelve BajaRecompensa para prioridad desconocida", () => {
    const r = crearRecompensaPorPrioridad("Unknown");
    expect(r.obtenerXP()).toBe(20);
    expect(r.obtenerFelicidad()).toBe(3);
  });
});
