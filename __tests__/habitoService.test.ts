import {
  crearHabito,
  completarHabito,
  descompletarHabito,
  eliminarHabito,
  actualizarHabito,
} from "../services/habito.service";

const mockFrom = jest.fn();
const mockQuery: any = {
  insert: jest.fn(() => mockQuery),
  select: jest.fn(() => mockQuery),
  update: jest.fn(() => mockQuery),
  delete: jest.fn(() => mockQuery),
  eq: jest.fn(() => mockQuery),
  in: jest.fn(() => mockQuery),
  gte: jest.fn(() => mockQuery),
  lte: jest.fn(() => mockQuery),
  single: jest.fn(() => Promise.resolve({ data: { id: "hab-1" }, error: null })),
  maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
};

jest.mock("../supabase/client", () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
  },
}));

describe("habito.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReturnValue(mockQuery);
  });

  describe("crearHabito", () => {
    it("crea un hábito y retorna los datos", async () => {
      const result = await crearHabito("user-1", {
        titulo: "Test",
        prioridad: "Media",
        frecuencia: "Diario",
      } as any);
      expect(mockFrom).toHaveBeenCalledWith("habito");
      expect(result.id).toBe("hab-1");
    });
  });

  describe("completarHabito", () => {
    it("inserta en historial", async () => {
      await completarHabito("hab-1");
      expect(mockFrom).toHaveBeenCalledWith("historial");
      expect(mockQuery.insert).toHaveBeenCalledWith({
        habito_id: "hab-1",
        completado: true,
      });
    });
  });

  describe("descompletarHabito", () => {
    it("borra el historial de hoy", async () => {
      await descompletarHabito("hab-1");
      expect(mockFrom).toHaveBeenCalledWith("historial");
      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith("habito_id", "hab-1");
    });
  });

  describe("eliminarHabito", () => {
    it("marca como inactivo", async () => {
      await eliminarHabito("hab-1");
      expect(mockFrom).toHaveBeenCalledWith("habito");
      expect(mockQuery.update).toHaveBeenCalledWith({ activo: false });
      expect(mockQuery.eq).toHaveBeenCalledWith("id", "hab-1");
    });
  });

  describe("actualizarHabito", () => {
    it("actualiza título y prioridad", async () => {
      await actualizarHabito("hab-1", {
        titulo: "Nuevo título",
        prioridad: "Alta",
      } as any);
      expect(mockQuery.update).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith("id", "hab-1");
    });
  });
});
