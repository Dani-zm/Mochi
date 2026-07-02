import { IMascotaFactory } from "./IMascotaFactory";

export class CaineFactory implements IMascotaFactory {
  getSpriteFolder(): string {
    return "caine";
  }
}