import { FactoryProvider } from "../patterns/factory/FactoryProvider";

describe("FactoryProvider", () => {
  it("crea KirbyFactory para Kirby", () => {
    const f = FactoryProvider.crear("Kirby");
    expect(f.getSpriteFolder()).toBe("kirby");
    expect(f.getNombre()).toBe("Kirby");
    expect(f.getNivelDesbloqueo()).toBe(1);
  });

  it("crea AyakaFactory para Ayaka", () => {
    const f = FactoryProvider.crear("Ayaka");
    expect(f.getSpriteFolder()).toBe("ayaka");
    expect(f.getNombre()).toBe("Ayaka");
    expect(f.getNivelDesbloqueo()).toBe(5);
  });

  it("crea MikuFactory para Miku", () => {
    const f = FactoryProvider.crear("Miku");
    expect(f.getSpriteFolder()).toBe("miku");
    expect(f.getNombre()).toBe("Miku");
    expect(f.getNivelDesbloqueo()).toBe(10);
  });

  it("crea CaineFactory para Caine", () => {
    const f = FactoryProvider.crear("Caine");
    expect(f.getSpriteFolder()).toBe("caine");
    expect(f.getNombre()).toBe("Caine");
    expect(f.getNivelDesbloqueo()).toBe(15);
  });

  it("devuelve KirbyFactory para nombre desconocido", () => {
    const f = FactoryProvider.crear("unknown");
    expect(f.getSpriteFolder()).toBe("kirby");
    expect(f.getNombre()).toBe("Kirby");
  });
});
