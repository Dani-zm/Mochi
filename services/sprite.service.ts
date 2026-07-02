import { ImageSourcePropType } from "react-native";
import { FactoryProvider } from "../patterns/factory/FactoryProvider";

export type EstadoAnimacion =
  | "IDLE"
  | "HAPPY"
  | "CELEBRATE"
  | "CRY"
  | "SLEEP"
  | "TOUCH";

export interface SpriteFrame {
  source: ImageSourcePropType;
  sheet?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

type FramesMap = Record<string, Record<string, ImageSourcePropType[]>>;
type FrasesMap = Record<string, string[]>;

const FRAMES: FramesMap = {
  kirby: {
    IDLE: [
      require("../assets/mascotas/kirby/shime1.png"),
      require("../assets/mascotas/kirby/shime2.png"),
      require("../assets/mascotas/kirby/shime3.png"),
      require("../assets/mascotas/kirby/shime4.png"),
      require("../assets/mascotas/kirby/shime5.png"),
      require("../assets/mascotas/kirby/shime6.png"),
      require("../assets/mascotas/kirby/shime7.png"),
      require("../assets/mascotas/kirby/shime8.png"),
      require("../assets/mascotas/kirby/shime9.png"),
      require("../assets/mascotas/kirby/shime10.png"),
      require("../assets/mascotas/kirby/shime11.png"),
    ],
    HAPPY: [
      require("../assets/mascotas/kirby/shime38.png"),
      require("../assets/mascotas/kirby/shime39.png"),
      require("../assets/mascotas/kirby/shime40.png"),
      require("../assets/mascotas/kirby/shime41.png"),
    ],
    CELEBRATE: [
      require("../assets/mascotas/kirby/shime30.png"),
      require("../assets/mascotas/kirby/shime31.png"),
      require("../assets/mascotas/kirby/shime32.png"),
      require("../assets/mascotas/kirby/shime33.png"),
      require("../assets/mascotas/kirby/shime32.png"),
    ],
    CRY: [
      require("../assets/mascotas/kirby/shime38.png"),
      require("../assets/mascotas/kirby/shime22.png"),
      require("../assets/mascotas/kirby/shime18.png"),
      require("../assets/mascotas/kirby/shime20.png"),
      require("../assets/mascotas/kirby/shime21.png"),
      require("../assets/mascotas/kirby/shime20.png"),
    ],
    SLEEP: [
      require("../assets/mascotas/kirby/shime12.png"),
      require("../assets/mascotas/kirby/shime13.png"),
      require("../assets/mascotas/kirby/shime14.png"),
      require("../assets/mascotas/kirby/shime13.png"),
      require("../assets/mascotas/kirby/shime14.png"),
    ],
    TOUCH: [
      require("../assets/mascotas/kirby/shime42.png"),
      require("../assets/mascotas/kirby/shime43.png"),
      require("../assets/mascotas/kirby/shime44.png"),
      require("../assets/mascotas/kirby/shime45.png"),
      require("../assets/mascotas/kirby/shime46.png"),
      require("../assets/mascotas/kirby/shime45.png"),
    ],
  },
  ayaka: {
    IDLE: [
      require("../assets/mascotas/ayaka/shime30.png"),
      require("../assets/mascotas/ayaka/shime31.png"),
      require("../assets/mascotas/ayaka/shime32.png"),
      require("../assets/mascotas/ayaka/shime33.png"),
      require("../assets/mascotas/ayaka/shime32.png"),
      require("../assets/mascotas/ayaka/shime31.png"),
    ],
    HAPPY: [
      require("../assets/mascotas/ayaka/shime1.png"),
      require("../assets/mascotas/ayaka/shime2.png"),
      require("../assets/mascotas/ayaka/shime3.png"),
      require("../assets/mascotas/ayaka/shime42.png"),
      require("../assets/mascotas/ayaka/shime43.png"),
      require("../assets/mascotas/ayaka/shime44.png"),
      require("../assets/mascotas/ayaka/shime45.png"),
      require("../assets/mascotas/ayaka/shime46.png"),
    ],
    CELEBRATE: [
      require("../assets/mascotas/ayaka/shime15.png"),
      require("../assets/mascotas/ayaka/shime16.png"),
      require("../assets/mascotas/ayaka/shime17.png"),
      require("../assets/mascotas/ayaka/shime29.png"),
      require("../assets/mascotas/ayaka/shime28.png"),
      require("../assets/mascotas/ayaka/shime27.png"),
      require("../assets/mascotas/ayaka/shime26.png"),
    ],
    CRY: [
      require("../assets/mascotas/ayaka/shime22.png"),
      require("../assets/mascotas/ayaka/shime4.png"),
      require("../assets/mascotas/ayaka/shime18.png"),
      require("../assets/mascotas/ayaka/shime19.png"),
      require("../assets/mascotas/ayaka/shime19.png"),
    ],
    SLEEP: [
      require("../assets/mascotas/ayaka/shime20.png"),
      require("../assets/mascotas/ayaka/shime21.png"),
      require("../assets/mascotas/ayaka/shime20.png"),
      require("../assets/mascotas/ayaka/shime21.png"),
    ],
    TOUCH: [
      require("../assets/mascotas/ayaka/shime38.png"),
      require("../assets/mascotas/ayaka/shime39.png"),
      require("../assets/mascotas/ayaka/shime11.png"),
    ],
  },
  miku: {
    IDLE: [
      require("../assets/mascotas/miku/shime1.png"),
      require("../assets/mascotas/miku/shime2.png"),
      require("../assets/mascotas/miku/shime3.png"),
      require("../assets/mascotas/miku/shime2.png"),
      require("../assets/mascotas/miku/shime3.png"),
    ],
    HAPPY: [
      require("../assets/mascotas/miku/shime17.png"),
      require("../assets/mascotas/miku/shime18.png"),
      require("../assets/mascotas/miku/shime19.png"),
    ],
    CELEBRATE: [
      require("../assets/mascotas/miku/shime42.png"),
      require("../assets/mascotas/miku/shime43.png"),
      require("../assets/mascotas/miku/shime42.png"),
      require("../assets/mascotas/miku/shime43.png"),
    ],
    CRY: [
      require("../assets/mascotas/miku/shime8.png"),
      require("../assets/mascotas/miku/shime4.png"),
      require("../assets/mascotas/miku/shime18.png"),
      require("../assets/mascotas/miku/shime20.png"),
      require("../assets/mascotas/miku/shime21.png"),
      require("../assets/mascotas/miku/shime20.png"),
      require("../assets/mascotas/miku/shime21.png"),
    ],
    SLEEP: [
      require("../assets/mascotas/miku/shime26.png"),
      require("../assets/mascotas/miku/shime27.png"),
      require("../assets/mascotas/miku/shime28.png"),
      require("../assets/mascotas/miku/shime29.png"),
      require("../assets/mascotas/miku/shime28.png"),
      require("../assets/mascotas/miku/shime27.png"),
    ],
    TOUCH: [
      require("../assets/mascotas/miku/shime31.png"),
      require("../assets/mascotas/miku/shime32.png"),
      require("../assets/mascotas/miku/shime33.png"),
      require("../assets/mascotas/miku/shime32.png"),
      require("../assets/mascotas/miku/shime33.png"),
    ],
  },
  caine: {
    IDLE: [
      require("../assets/mascotas/caine/shime1.png"),
      require("../assets/mascotas/caine/shime2.png"),
      require("../assets/mascotas/caine/shime3.png"),
      require("../assets/mascotas/caine/shime2.png"),
      require("../assets/mascotas/caine/shime1.png"),
    ],
    HAPPY: [
      require("../assets/mascotas/caine/shime26.png"),
      require("../assets/mascotas/caine/shime27.png"),
      require("../assets/mascotas/caine/shime28.png"),
      require("../assets/mascotas/caine/shime29.png"),
      require("../assets/mascotas/caine/shime31.png"),
      require("../assets/mascotas/caine/shime32.png"),
      require("../assets/mascotas/caine/shime33.png"),
    ],
    CELEBRATE: [
      require("../assets/mascotas/caine/shime37.png"),
      require("../assets/mascotas/caine/shime38.png"),
      require("../assets/mascotas/caine/shime39.png"),
      require("../assets/mascotas/caine/shime40.png"),
      require("../assets/mascotas/caine/shime41.png"),
      require("../assets/mascotas/caine/shime40.png"),
    ],
    CRY: [
 require("../assets/mascotas/caine/shime42.png"),
      require("../assets/mascotas/caine/shime43.png"),
      require("../assets/mascotas/caine/shime44.png"),
      require("../assets/mascotas/caine/shime45.png"),
      require("../assets/mascotas/caine/shime46.png"),
    ],
    SLEEP: [
      require("../assets/mascotas/caine/shime18.png"),
      require("../assets/mascotas/caine/shime19.png"),
      require("../assets/mascotas/caine/shime22.png"),
      require("../assets/mascotas/caine/shime20.png"),
    ],
    TOUCH: [
      require("../assets/mascotas/caine/shime5.png"),
      require("../assets/mascotas/caine/shime6.png"),
      require("../assets/mascotas/caine/shime7.png"),
      require("../assets/mascotas/caine/shime8.png"),
      require("../assets/mascotas/caine/shime9.png"),
      require("../assets/mascotas/caine/shime10.png"),
    ],
  },
};

const FRASES: FrasesMap = {
  kirby: [
    "¡Poooyooo, poyo!ദ്ദി (ᵔᗜᵔ)",
    "¡Poyo poyo! ¡Vamos!.·°՞(¯□¯)՞°·.",
    "¡Kirby te apoya hoy, poyo! (•ᴗ•,, )✧",
  ],
  ayaka: [
    "¡Que florezca tu día! ( • ᴗ - ) ✧",
    "¡Adelante, viajero! (⸝⸝ᵕᴗᵕ⸝⸝)",
    "¡El viento te acompaña hoy! •𐃷•",
  ],
  miku: [
    "¡Miku miku~! ¡Tú puedes!( •̀ - •́ )",
    "¡Que suene el éxito hoy!(˶ᵔ ᵕ ᵔ˶)",
    "¡Vocaloid power, ganbatte!(๑•̀ᗝ•́)૭",
  ],
  caine: [
    "¡Bienvenido al show!( ꩜ ᯅ ꩜;)⁭ ⁭",
    "¡Tú eres la estrella hoy!•⩊•",
    "¡El show debe continuar!(˶ˆᗜˆ˵)",
  ],
};

const TOUCH_ANIMS: EstadoAnimacion[] = ["HAPPY", "CELEBRATE", "TOUCH"];

export function obtenerFrames(
  mascotaNombre: string,
  estado: string,
): ImageSourcePropType[] {
  const factory = FactoryProvider.crear(mascotaNombre);
  const petKey = factory.getSpriteFolder() as keyof typeof FRAMES;
  return (FRAMES[petKey]?.[estado] ??
    FRAMES["kirby"]["IDLE"]) as ImageSourcePropType[];
}

export function obtenerClavePersonaje(mascotaNombre: string): string {
  const factory = FactoryProvider.crear(mascotaNombre);
  return factory.getSpriteFolder() as string;
}

export function obtenerFrase(mascotaNombre: string): string {
  const key = obtenerClavePersonaje(mascotaNombre) as keyof typeof FRASES;
  const frases = FRASES[key] ?? FRASES["kirby"];
  return frases[Math.floor(Math.random() * frases.length)];
}

export function obtenerAnimacionAleatoria(): EstadoAnimacion {
  return TOUCH_ANIMS[Math.floor(Math.random() * TOUCH_ANIMS.length)];
}

export function obtenerVelocidadFrame(estado: EstadoAnimacion): number {
  if (estado === "IDLE") return 1800;
  if (estado === "CELEBRATE") return 500;
  return 650;
}

export function obtenerEstadoEfectivo(
  estadoAnimacion: EstadoAnimacion,
  felicidad: number,
  vida: number,
): EstadoAnimacion {
  if (vida <= 0) return "CRY";
  if (estadoAnimacion === "IDLE" && felicidad < 30) return "CRY";
  return estadoAnimacion;
}

export function obtenerMensajeEstado(
  estadoEfectivo: EstadoAnimacion,
  vida: number,
  felicidad: number,
): string {
  if (vida <= 0) return "Casi se muere... está muy triste... (´•︵•`)";
  if (felicidad < 30) return "Está un poco triste... ( • ᴖ • ｡)";
  switch (estadoEfectivo) {
    case "HAPPY":
    case "CELEBRATE":
      return "¡Está muy feliz de ti! (˶˃ ᵕ ˂˶)";
    case "TOUCH":
      return "¡Te saluda!◝(ᵔᵕᵔ)◜";
    default:
      return "Holi! •⩊•";
  }
}
