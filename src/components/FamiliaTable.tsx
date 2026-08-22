import React, { useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { CampoFamilia, FamiliaVista, VistaFamilias } from '../types/familia';
import { ETIQUETA_CAMPO, agruparFamilias, ordenarFamilias, valorCampo, GrupoFamilias } from '../utils/familias';

interface FamiliaTableProps {
  familias: FamiliaVista[];
  vistaActual: VistaFamilias;
  camposVisibles: CampoFamilia[];
  groupFields: CampoFamilia[];
  seleccionadaId: string | null;
  onSeleccionar: (f: FamiliaVista) => void;
  onAbrirEdicion: (f: FamiliaVista) => void;
}

const COLUMNAS_SENCILLA: CampoFamilia[] = ['nombre', 'padre', 'madre', 'union', 'fecha', 'totalIntegrantes'];
const COLUMNAS_DETALLADA_BASE: CampoFamilia[] = [
'nombre',
'domicilio',
'localidad',
'codigoPostal',
'provincia',
'telefono'];

const COLUMNAS_INTEGRANTES: CampoFamilia[] = ['nombre', 'totalIntegrantes', 'enRadioParroquial', 'union'];

function formatoCelda(f: FamiliaVista, campo: CampoFamilia): string {
  const v = valorCampo(f, campo);
  if (!v && (campo === 'padre' || campo === 'madre' || campo === 'fecha')) return '—';
  return v;
}

function Encabezado({
  columnas,
  ordenarPor,
  ordenAsc,
  onOrdenar



}: {columnas: CampoFamilia[];ordenarPor: CampoFamilia | null;ordenAsc: boolean;onOrdenar: (c: CampoFamilia) => void;}) {
  return (
    <thead className="sticky top-0 z-10 bg-sky-200 text-navy-900">
      <tr>
        {columnas.map((c) =>
        <th key={c} scope="col" className="border-b border-r border-sky-400/70 px-2 py-1 text-left font-semibold last:border-r-0">
            <button
            type="button"
            onClick={() => onOrdenar(c)}
            className="flex w-full items-center gap-1 whitespace-nowrap hover:text-navy-700">

              {ETIQUETA_CAMPO[c]}
              {ordenarPor === c &&
            (ordenAsc ?
            <ArrowUpIcon className="h-3 w-3" strokeWidth={2} /> :
            <ArrowDownIcon className="h-3 w-3" strokeWidth={2} />)
            }
            </button>
          </th>
        )}
      </tr>
    </thead>);

}

function FilaFamilia({
  familia,
  columnas,
  seleccionada,
  onSeleccionar,
  onAbrirEdicion



}: {familia: FamiliaVista;columnas: CampoFamilia[];seleccionada: boolean;onSeleccionar: () => void;onAbrirEdicion: () => void;}) {
  return (
    <tr
      onClick={onSeleccionar}
      onDoubleClick={onAbrirEdicion}
      aria-selected={seleccionada}
      className={[
      'cursor-pointer border-b border-sky-200 text-navy-900 transition-colors duration-100 ease-out',
      seleccionada ? 'bg-amber-soft' : 'bg-white hover:bg-sky-50'].
      join(' ')}>

      {columnas.map((c, i) =>
      <td
        key={c}
        className={[
        'whitespace-nowrap border-r border-sky-100 px-2 py-1 last:border-r-0',
        i === 0 ? 'font-semibold' : ''].
        join(' ')}>

          {formatoCelda(familia, c)}
        </td>
      )}
    </tr>);

}

function FilasAgrupadas({
  grupos,
  columnas,
  nivel,
  seleccionadaId,
  onSeleccionar,
  onAbrirEdicion,
  colapsados,
  onToggleColapso



}: {
  grupos: GrupoFamilias[];
  columnas: CampoFamilia[];
  nivel: number;
  seleccionadaId: string | null;
  onSeleccionar: (f: FamiliaVista) => void;
  onAbrirEdicion: (f: FamiliaVista) => void;
  colapsados: Set<string>;
  onToggleColapso: (clave: string) => void;
}) {
  return (
    <>
      {grupos.map((g) => {
        const clave = `${nivel}-${g.valor}`;
        const colapsado = colapsados.has(clave);
        return (
          <React.Fragment key={clave}>
            <tr className="bg-sky-100">
              <td
                colSpan={columnas.length}
                style={{ paddingLeft: `${8 + nivel * 16}px` }}
                className="border-b border-sky-300 py-1 pr-2 font-semibold text-navy-900">

                <button
                  type="button"
                  onClick={() => onToggleColapso(clave)}
                  className="flex items-center gap-1.5 hover:text-navy-700">

                  {colapsado ?
                  <ChevronRightIcon className="h-3.5 w-3.5" strokeWidth={2} /> :

                  <ChevronDownIcon className="h-3.5 w-3.5" strokeWidth={2} />
                  }
                  {g.valor}
                  <span className="font-normal text-navy-800/60">({g.familias.length})</span>
                </button>
              </td>
            </tr>
            {!colapsado && g.subgrupos.length > 0 &&
            <FilasAgrupadas
              grupos={g.subgrupos}
              columnas={columnas}
              nivel={nivel + 1}
              seleccionadaId={seleccionadaId}
              onSeleccionar={onSeleccionar}
              onAbrirEdicion={onAbrirEdicion}
              colapsados={colapsados}
              onToggleColapso={onToggleColapso} />

            }
            {!colapsado && g.subgrupos.length === 0 &&
            g.familias.map((f) =>
            <FilaFamilia
              key={f.id}
              familia={f}
              columnas={columnas}
              seleccionada={f.id === seleccionadaId}
              onSeleccionar={() => onSeleccionar(f)}
              onAbrirEdicion={() => onAbrirEdicion(f)} />

            )
            }
          </React.Fragment>);

      })}
    </>);

}

export function FamiliaTable({
  familias,
  vistaActual,
  camposVisibles,
  groupFields,
  seleccionadaId,
  onSeleccionar,
  onAbrirEdicion
}: FamiliaTableProps) {
  const [ordenarPor, setOrdenarPor] = useState<CampoFamilia | null>(null);
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [colapsados, setColapsados] = useState<Set<string>>(new Set());

  const columnas = useMemo(() => {
    if (vistaActual === 'detallada') {
      return [...COLUMNAS_DETALLADA_BASE, ...camposVisibles.filter((c) => !COLUMNAS_DETALLADA_BASE.includes(c))];
    }
    if (vistaActual === 'integrantes') return COLUMNAS_INTEGRANTES;
    return COLUMNAS_SENCILLA;
  }, [vistaActual, camposVisibles]);

  function onOrdenar(campo: CampoFamilia) {
    if (ordenarPor === campo) {
      setOrdenAsc((v) => !v);
    } else {
      setOrdenarPor(campo);
      setOrdenAsc(true);
    }
  }

  function onToggleColapso(clave: string) {
    setColapsados((prev) => {
      const copia = new Set(prev);
      if (copia.has(clave)) copia.delete(clave);else copia.add(clave);
      return copia;
    });
  }

  if (familias.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[12px] text-navy-800/50">
        No se encontró informacion.
      </div>);

  }

  const ordenadas = ordenarFamilias(familias, ordenarPor, ordenAsc);
  const grupos = groupFields.length > 0 ? agruparFamilias(ordenadas, groupFields) : [];

  return (
    <div className="h-full overflow-auto">
      <table className="w-full border-collapse text-[12px]">
        <Encabezado columnas={columnas} ordenarPor={ordenarPor} ordenAsc={ordenAsc} onOrdenar={onOrdenar} />
        <tbody>
          {grupos.length > 0 ?
          <FilasAgrupadas
            grupos={grupos}
            columnas={columnas}
            nivel={0}
            seleccionadaId={seleccionadaId}
            onSeleccionar={onSeleccionar}
            onAbrirEdicion={onAbrirEdicion}
            colapsados={colapsados}
            onToggleColapso={onToggleColapso} /> :


          ordenadas.map((f) =>
          <FilaFamilia
            key={f.id}
            familia={f}
            columnas={columnas}
            seleccionada={f.id === seleccionadaId}
            onSeleccionar={() => onSeleccionar(f)}
            onAbrirEdicion={() => onAbrirEdicion(f)} />

          )
          }
        </tbody>
      </table>
    </div>);

}
