import { Familia } from '../types/familia';
import { Persona, nombreCompleto } from '../types/persona';

export type NivelValidacion = 'error' | 'aviso';

export interface Validacion {
  nivel: NivelValidacion;
  mensaje: string;
}

export function validarPadreMadre(idPadre: string | null, idMadre: string | null): Validacion | null {
  if (idPadre && idMadre && idPadre === idMadre) {
    return {
      nivel: 'error',
      mensaje: 'Una persona no puede figurar como padre y madre de la misma familia. Elija otra persona del padrón.'
    };
  }
  return null;
}

export function validarFechaUnion(fecha: string, padre: Persona | null, madre: Persona | null): Validacion | null {
  if (!fecha) return null;
  const nacimientos = [padre?.fechaNacimiento, madre?.fechaNacimiento].filter(Boolean) as string[];
  const anteriorAlNacimiento = nacimientos.some((n) => fecha < n);
  if (anteriorAlNacimiento) {
    return {
      nivel: 'aviso',
      mensaje: 'La fecha de unión es anterior al nacimiento de uno de los cónyuges. Corrija la fecha o revise el registro de la persona.'
    };
  }
  return null;
}

export function validarAsociarIntegrante(
idPersona: string,
familia: Familia,
personas: Persona[])
: Validacion | null {
  if (idPersona === familia.idPadre || idPersona === familia.idMadre) {
    return {
      nivel: 'error',
      mensaje: 'Esa persona ya es padre o madre de esta familia; no puede asociarse también como integrante.'
    };
  }
  const yaAsociado = familia.integrantes.find((i) => i.idPersona === idPersona);
  if (yaAsociado) {
    const persona = personas.find((p) => p.id === idPersona);
    const nombre = persona ? nombreCompleto(persona) : 'Esta persona';
    return {
      nivel: 'error',
      mensaje: `${nombre} ya está asociada a la familia ${familia.nombre} como ${yaAsociado.tipoIntegrante.toLowerCase()}. Quite la relación anterior antes de crear una nueva.`
    };
  }
  return null;
}
