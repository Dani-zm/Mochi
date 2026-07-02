import { IMascotaFactory } from "./IMascotaFactory";

export class CaineFactory implements IMascotaFactory {
  getId(): number {
    return 4;
  }

  getNombre(): string {
    return "Caine";
  }

  getDescripcion(): string {
    return "IA del Circo Digital.";
  }

  getNivelDesbloqueo(): number {
    return 15;
  }

  getSpriteFolder(): string {
    return "caine";
  }
}
