import { CampoFamilia, CriterioFiltro, Familia, FamiliaVista, OperadorFiltro } from '../types/familia';
import { Persona, nombreCompleto } from '../types/persona';
import { formatoFechaCorta } from './fecha';

export { formatoFechaCorta };

export const ETIQUETA_CAMPO: Record<CampoFamilia, string> = {
  nombre: 'Familia',
  padre: 'Padre',
  madre: 'Madre',
  union: 'Tipo de unión',
  fecha: 'Fecha de unión',
  tipoResidencia: 'Tipo de residencia',
  domicilio: 'Domicilio',
  localidad: 'Localidad',
  codigoPostal: 'Código postal',
  provincia: 'Departamento',
  pais: 'País',
  telefono: 'Teléfono',
  email: 'Correo electrónico',
  enRadioParroquial: 'En radio parroquial',
  observaciones: 'Observaciones',
  totalIntegrantes: 'Integrantes',
  id: 'IdFamilia'
};

export const CAMPOS_OPCIONALES: CampoFamilia[] = [
'codigoPostal',
'provincia',
'pais',
'email',
'enRadioParroquial',
'observaciones'];


export const CAMPOS_FILTRO: CampoFamilia[] = [
'codigoPostal',
'domicilio',
'email',
'enRadioParroquial',
'fecha',
'id',
'localidad',
'madre',
'nombre',
'observaciones',
'padre',
'pais',
'provincia',
'telefono',
'tipoResidencia',
'totalIntegrantes',
'union'];


export const ETIQUETA_OPERADOR: Record<OperadorFiltro, string> = {
  igual: 'Igual',
  noEsIgual: 'No es igual',
  contiene: 'Contiene',
  mayorQue: 'Mayor que',
  mayorOIgualA: 'Mayor o igual a',
  menorQue: 'Menor que',
  menorOIgualA: 'Menor o igual a',
  esVacio: 'Es vacío',
  noEsVacio: 'No es vacío'
};

export const OPERADORES_FILTRO: OperadorFiltro[] = [
'igual',
'noEsIgual',
'contiene',
'mayorQue',
'mayorOIgualA',
'menorQue',
'menorOIgualA',
'esVacio',
'noEsVacio'];


export function enriquecerFamilia(familia: Familia, personas: Persona[]): FamiliaVista {
  const porId = new Map(personas.map((p) => [p.id, p]));
  const padre = familia.idPadre ? porId.get(familia.idPadre) : undefined;
  const madre = familia.idMadre ? porId.get(familia.idMadre) : undefined;
  const totalIntegrantes = (familia.idPadre ? 1 : 0) + (familia.idMadre ? 1 : 0) + familia.integrantes.length;
  return {
    ...familia,
    padre: padre ? nombreCompleto(padre) : '',
    madre: madre ? nombreCompleto(madre) : '',
    totalIntegrantes
  };
}

export function valorCampo(familia: FamiliaVista, campo: CampoFamilia): string {
  const v = familia[campo];
  if (typeof v === 'boolean') return v ? 'Sí' : 'No';
  return String(v ?? '');
}

export function cumpleCriterio(familia: FamiliaVista, criterio: CriterioFiltro): boolean {
  if (!criterio.campo) return true;
  const valorFamilia = valorCampo(familia, criterio.campo).toLowerCase();
  const valorBuscado = criterio.valor.trim().toLowerCase();

  switch (criterio.operador) {
    case 'esVacio':
      return valorFamilia.trim() === '';
    case 'noEsVacio':
      return valorFamilia.trim() !== '';
    case 'contiene':
      return valorFamilia.includes(valorBuscado);
    case 'igual':
      return valorFamilia === valorBuscado;
    case 'noEsIgual':
      return valorFamilia !== valorBuscado;
    case 'mayorQue':
      return valorFamilia > valorBuscado;
    case 'mayorOIgualA':
      return valorFamilia >= valorBuscado;
    case 'menorQue':
      return valorFamilia < valorBuscado;
    case 'menorOIgualA':
      return valorFamilia <= valorBuscado;
    default:
      return true;
  }
}

export function aplicarFiltros(
familias: FamiliaVista[],
letra: string,
criterios: CriterioFiltro[])
: FamiliaVista[] {
  let resultado = familias;

  if (letra && letra !== '<>AZ') {
    resultado = resultado.filter((f) => f.nombre.trim().toUpperCase().startsWith(letra));
  }

  const activos = criterios.filter((c) => c.campo && (c.operador === 'esVacio' || c.operador === 'noEsVacio' || c.valor.trim() !== ''));
  if (activos.length === 0) return resultado;

  return resultado.filter((f) => {
    let acumulado: boolean | null = null;
    for (const criterio of activos) {
      const pasa = cumpleCriterio(f, criterio);
      if (acumulado === null) {
        acumulado = pasa;
      } else if (criterio.conector === 'O') {
        acumulado = acumulado || pasa;
      } else {
        acumulado = acumulado && pasa;
      }
    }
    return acumulado ?? true;
  });
}

export interface GrupoFamilias {
  valor: string;
  familias: FamiliaVista[];
  subgrupos: GrupoFamilias[];
}

export function agruparFamilias(familias: FamiliaVista[], campos: CampoFamilia[]): GrupoFamilias[] {
  if (campos.length === 0) return [];
  const [campo, ...resto] = campos;
  const mapa = new Map<string, FamiliaVista[]>();
  for (const f of familias) {
    const valor = valorCampo(f, campo).trim() || '(vacío)';
    if (!mapa.has(valor)) mapa.set(valor, []);
    mapa.get(valor)!.push(f);
  }
  return Array.from(mapa.entries()).
  sort((a, b) => a[0].localeCompare(b[0])).
  map(([valor, items]) => ({
    valor,
    familias: items,
    subgrupos: resto.length ? agruparFamilias(items, resto) : []
  }));
}

export function ordenarFamilias(
familias: FamiliaVista[],
campo: CampoFamilia | null,
asc: boolean)
: FamiliaVista[] {
  if (!campo) return familias;
  const copia = [...familias];
  copia.sort((a, b) => {
    const va = valorCampo(a, campo);
    const vb = valorCampo(b, campo);
    return asc ? va.localeCompare(vb) : vb.localeCompare(va);
  });
  return copia;
}

export function generarIdFamilia(): string {
  return `f-${Date.now()}`;
}

export function generarIdIntegrante(): string {
  return `i-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

const COLUMNAS_EXPORTAR: CampoFamilia[] = [
'id',
'nombre',
'padre',
'madre',
'union',
'fecha',
'tipoResidencia',
'domicilio',
'localidad',
'codigoPostal',
'provincia',
'pais',
'telefono',
'email',
'enRadioParroquial',
'totalIntegrantes',
'observaciones'];


export function exportarAExcel(familias: FamiliaVista[], nombreArchivo = 'familias.csv'): void {
  const encabezado = COLUMNAS_EXPORTAR.map((c) => ETIQUETA_CAMPO[c]).join(';');
  const filas = familias.map((f) =>
  COLUMNAS_EXPORTAR.map((c) => {
    const valor = valorCampo(f, c).replace(/;/g, ',').replace(/\n/g, ' ');
    return valor;
  }).join(';')
  );
  const contenido = '﻿' + [encabezado, ...filas].join('\r\n');
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
