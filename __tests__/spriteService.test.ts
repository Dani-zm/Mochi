import {
  obtenerVelocidadFrame,
  obtenerEstadoEfectivo,
  obtenerMensajeEstado,
  obtenerAnimacionAleatoria,
} from "../services/sprite.service";

describe("sprite.service", () => {
  describe("obtenerVelocidadFrame", () => {
    it("retorna 1800 para IDLE", () => {
      expect(obtenerVelocidadFrame("IDLE")).toBe(1800);
    });

    it("retorna 350 para CELEBRATE", () => {
      expect(obtenerVelocidadFrame("CELEBRATE")).toBe(350);
    });

    it("retorna 400 para otros estados", () => {
      expect(obtenerVelocidadFrame("HAPPY")).toBe(400);
      expect(obtenerVelocidadFrame("CRY")).toBe(400);
      expect(obtenerVelocidadFrame("SLEEP")).toBe(400);
      expect(obtenerVelocidadFrame("TOUCH")).toBe(400);
    });
  });

  describe("obtenerEstadoEfectivo", () => {
    it("retorna CRY si vida <= 0", () => {
      expect(obtenerEstadoEfectivo("IDLE", 100, 0)).toBe("CRY");
      expect(obtenerEstadoEfectivo("HAPPY", 100, 0)).toBe("CRY");
    });

    it("retorna CRY si IDLE y felicidad < 30", () => {
      expect(obtenerEstadoEfectivo("IDLE", 20, 100)).toBe("CRY");
    });

    it("retorna el estado original si no hay condición especial", () => {
      expect(obtenerEstadoEfectivo("HAPPY", 100, 100)).toBe("HAPPY");
      expect(obtenerEstadoEfectivo("IDLE", 50, 100)).toBe("IDLE");
      expect(obtenerEstadoEfectivo("CELEBRATE", 100, 100)).toBe("CELEBRATE");
    });

    it("prioriza vida <= 0 sobre felicidad < 30", () => {
      expect(obtenerEstadoEfectivo("IDLE", 20, 0)).toBe("CRY");
    });
  });

  describe("obtenerMensajeEstado", () => {
    it("muestra mensaje de muerte si vida <= 0", () => {
      expect(obtenerMensajeEstado("CRY", 0, 50)).toContain("muere");
    });

    it("muestra mensaje triste si felicidad < 30 y no está muerto", () => {
      expect(obtenerMensajeEstado("CRY", 50, 20)).toContain("triste");
    });

    it("muestra mensaje feliz para HAPPY", () => {
      expect(obtenerMensajeEstado("HAPPY", 100, 100)).toContain("feliz");
    });

    it("muestra mensaje feliz para CELEBRATE", () => {
      expect(obtenerMensajeEstado("CELEBRATE", 100, 100)).toContain("feliz");
    });

    it("muestra mensaje de saludo para TOUCH", () => {
      expect(obtenerMensajeEstado("TOUCH", 100, 100)).toContain("saluda");
    });

    it("muestra mensaje default para IDLE", () => {
      expect(obtenerMensajeEstado("IDLE", 100, 100)).toContain("Holi");
    });
  });

  describe("obtenerAnimacionAleatoria", () => {
    it("retorna una animación válida", () => {
      const validas = ["HAPPY", "CELEBRATE", "TOUCH"];
      for (let i = 0; i < 20; i++) {
        expect(validas).toContain(obtenerAnimacionAleatoria());
      }
    });
  });
});
