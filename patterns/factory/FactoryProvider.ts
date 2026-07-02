import { IMascotaFactory } from "./IMascotaFactory";
import { KirbyFactory } from "./KirbyFactory";
import { AyakaFactory } from "./AyakaFactory";
import { MikuFactory } from "./MikuFactory";
import { CaineFactory } from "./CaineFactory";

export class FactoryProvider {
  static crear(nombre: string): IMascotaFactory {
    switch (nombre) {
      case "Kirby":
        return new KirbyFactory();

      case "Ayaka":
        return new AyakaFactory();

      case "Miku":
        return new MikuFactory();

      case "Caine":
        return new CaineFactory();

      default:
        return new KirbyFactory();
    }
  }
}
