import { IMascotaFactory } from "./IMascotaFactory";

export class MikuFactory implements IMascotaFactory {
  getId(): number {
    return 3;
  }

  getNombre(): string {
    return "Miku";
  }

  getDescripcion(): string {
    return "Cantante virtual";
  }

  getSpriteFolder(): string {
    return "miku";
  }
}
