export type Sexo = 'M' | 'F';

export type TipoDocumento = 'DPI' | 'Partida de nacimiento' | 'Pasaporte' | 'Sin documento';

export interface Persona {
  id: string;
  nombres: string;
  apellidos: string;
  sexo: Sexo;
  fechaNacimiento: string;
  paisNacimiento: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  idPadre: string | null;
  idMadre: string | null;
}

export function nombreCompleto(p: Persona): string {
  return `${p.apellidos}, ${p.nombres}`;
}
