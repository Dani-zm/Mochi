import { FactoryProvider } from "../patterns/factory/FactoryProvider";

describe("FactoryProvider", () => {
  it("crea KirbyFactory para Kirby", () => {
    const f = FactoryProvider.crear("Kirby");
    expect(f.getSpriteFolder()).toBe("kirby");
  });

  it("crea AyakaFactory para Ayaka", () => {
    const f = FactoryProvider.crear("Ayaka");
    expect(f.getSpriteFolder()).toBe("ayaka");
  });

  it("crea MikuFactory para Miku", () => {
    const f = FactoryProvider.crear("Miku");
    expect(f.getSpriteFolder()).toBe("miku");
  });

  it("crea CaineFactory para Caine", () => {
    const f = FactoryProvider.crear("Caine");
    expect(f.getSpriteFolder()).toBe("caine");
  });

  it("devuelve KirbyFactory para nombre desconocido", () => {
    const f = FactoryProvider.crear("unknown");
    expect(f.getSpriteFolder()).toBe("kirby");
  });
});