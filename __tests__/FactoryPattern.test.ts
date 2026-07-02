import { FactoryProvider } from "../patterns/factory/FactoryProvider";

describe("FactoryProvider", () => {
  it("crea KirbyFactory para Kirby", () => {
    const f = FactoryProvider.crear("Kirby");
    expect(f.getSpriteFolder()).toBe("kirby");
    expect(f.getNombre()).toBe("Kirby");
  });

  it("crea AyakaFactory para Ayaka", () => {
    const f = FactoryProvider.crear("Ayaka");
    expect(f.getSpriteFolder()).toBe("ayaka");
    expect(f.getNombre()).toBe("Ayaka");
  });

  it("crea MikuFactory para Miku", () => {
    const f = FactoryProvider.crear("Miku");
    expect(f.getSpriteFolder()).toBe("miku");
    expect(f.getNombre()).toBe("Miku");
  });

  it("crea CaineFactory para Caine", () => {
    const f = FactoryProvider.crear("Caine");
    expect(f.getSpriteFolder()).toBe("caine");
    expect(f.getNombre()).toBe("Caine");
  });

  it("devuelve KirbyFactory para nombre desconocido", () => {
    const f = FactoryProvider.crear("unknown");
    expect(f.getSpriteFolder()).toBe("kirby");
    expect(f.getNombre()).toBe("Kirby");
  });
});
