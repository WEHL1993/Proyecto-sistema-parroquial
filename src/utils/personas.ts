import { Persona } from '../types/persona';
import { nombreCompleto } from '../types/persona';

export function generarIdPersona(): string {
  return `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function buscarPersonas(personas: Persona[], consulta: string): Persona[] {
  const q = consulta.trim().toLowerCase();
  if (!q) return personas;
  return personas.filter((p) => {
    const nombre = nombreCompleto(p).toLowerCase();
    const documento = p.numeroDocumento.toLowerCase();
    return nombre.includes(q) || documento.includes(q);
  });
}

export interface GrupoRelacion {
  id: number;
  tipo: string;
  personas: Persona[];
}

const ORDEN_RELACION: {id: number;tipo: string;}[] = [
{ id: 1, tipo: 'Padres' },
{ id: 2, tipo: 'Hijos' },
{ id: 3, tipo: 'Hermanos' },
{ id: 4, tipo: 'Tíos' },
{ id: 5, tipo: 'Sobrinos' },
{ id: 6, tipo: 'Abuelos' },
{ id: 7, tipo: 'Nietos' }];


function unicos(personas: Persona[]): Persona[] {
  return Array.from(new Map(personas.map((p) => [p.id, p])).values());
}

/**
 * Replica en memoria la lógica de peBuscarRelacionesFamiliares (UNION ALL sobre pePadres):
 * deriva los 7 parentescos a partir de idPadre/idMadre, sin tablas de relación propias.
 */
export function calcularRelacionesFamiliares(idPersona: string, personas: Persona[]): GrupoRelacion[] {
  const porId = new Map(personas.map((p) => [p.id, p]));
  const persona = porId.get(idPersona);
  if (!persona) return ORDEN_RELACION.map((r) => ({ ...r, personas: [] }));

  const padres = [persona.idPadre, persona.idMadre].
  filter((id): id is string => Boolean(id)).
  map((id) => porId.get(id)).
  filter((p): p is Persona => Boolean(p));

  const hijos = personas.filter((p) => p.idPadre === idPersona || p.idMadre === idPersona);

  const hermanos = unicos(
    personas.filter(
      (p) =>
      p.id !== idPersona && (
      persona.idPadre && p.idPadre === persona.idPadre ||
      persona.idMadre && p.idMadre === persona.idMadre)

    )
  );

  const abuelos = unicos(
    padres.flatMap((padre) =>
    [padre.idPadre, padre.idMadre].
    filter((id): id is string => Boolean(id)).
    map((id) => porId.get(id)).
    filter((p): p is Persona => Boolean(p))
    )
  );

  const nietos = unicos(hijos.flatMap((hijo) => personas.filter((p) => p.idPadre === hijo.id || p.idMadre === hijo.id)));

  const tios = unicos(
    padres.flatMap((padre) =>
    personas.filter(
      (p) =>
      p.id !== padre.id && (
      padre.idPadre && p.idPadre === padre.idPadre ||
      padre.idMadre && p.idMadre === padre.idMadre)

    )
    )
  );

  const sobrinos = unicos(
    hermanos.flatMap((hermano) => personas.filter((p) => p.idPadre === hermano.id || p.idMadre === hermano.id))
  );

  const porTipo: Record<number, Persona[]> = {
    1: padres,
    2: hijos,
    3: hermanos,
    4: tios,
    5: sobrinos,
    6: abuelos,
    7: nietos
  };

  return ORDEN_RELACION.map((r) => ({ ...r, personas: porTipo[r.id] }));
}
