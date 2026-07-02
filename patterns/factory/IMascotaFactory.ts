export interface IMascotaFactory {
  getId(): number;

  getNombre(): string;

  getDescripcion(): string;

  getNivelDesbloqueo(): number;

  getSpriteFolder(): string;
}
