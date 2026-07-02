import { IMascotaFactory } from "./IMascotaFactory";

export class KirbyFactory implements IMascotaFactory {
  getId(): number {
    return 1;
  }

  getNombre(): string {
    return "Kirby";
  }

  getDescripcion(): string {
    return "Mascota inicial.";
  }

  getNivelDesbloqueo(): number {
    return 1;
  }

  getSpriteFolder(): string {
    return "kirby";
  }
}
