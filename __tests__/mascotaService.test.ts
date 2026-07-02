import { actualizarVida, actualizarFelicidad, actualizarXP } from "../services/mascota.service";

jest.mock("../supabase/client", () => ({
  supabase: {
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: { id: "test-id", vida: 80, felicidad: 90, xp: 100 }, error: null })),
          })),
        })),
      })),
    })),
  },
}));

describe("mascota.service", () => {
  describe("actualizarVida", () => {
    it("actualiza y retorna la vida", async () => {
      const result = await actualizarVida("test-id", 80);
      expect(result).toBeDefined();
    });
  });

  describe("actualizarFelicidad", () => {
    it("actualiza y retorna la felicidad", async () => {
      const result = await actualizarFelicidad("test-id", 90);
      expect(result).toBeDefined();
    });
  });

  describe("actualizarXP", () => {
    it("actualiza y retorna el XP", async () => {
      const result = await actualizarXP("test-id", 100);
      expect(result).toBeDefined();
    });
  });
});
