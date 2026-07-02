import { IMascotaFactory } from "./IMascotaFactory";

export class MikuFactory implements IMascotaFactory {
  getSpriteFolder(): string {
    return "miku";
  }
}