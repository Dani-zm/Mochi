import { IMascotaFactory } from "./IMascotaFactory";

export class AyakaFactory implements IMascotaFactory {
  getId(): number {
    return 2;
  }

  getNombre(): string {
    return "Ayaka";
  }

  getDescripcion(): string {
    return "Personaje desbloqueable.";
  }

  getSpriteFolder(): string {
    return "ayaka";
  }
}
