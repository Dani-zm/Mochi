import { IMascotaFactory } from "./IMascotaFactory";

export class AyakaFactory implements IMascotaFactory {
  getSpriteFolder(): string {
    return "ayaka";
  }
}