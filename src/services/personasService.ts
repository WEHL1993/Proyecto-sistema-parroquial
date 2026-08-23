import { PersonaRegistro } from '../types/personas';

export async function obtenerPersonas(): Promise<PersonaRegistro[]> {
  return [];
}

export async function guardarPersona(persona: PersonaRegistro): Promise<PersonaRegistro> {
  return persona;
}

export async function cambiarEstadoPersona(id: number, activo: boolean): Promise<void> {
  void id;
  void activo;
}
