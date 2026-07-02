import { IMascotaFactory } from "./IMascotaFactory";

export class KirbyFactory implements IMascotaFactory {
  getSpriteFolder(): string {
    return "kirby";
  }
}