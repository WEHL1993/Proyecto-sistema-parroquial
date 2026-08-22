import React from 'react';
import { PrinterIcon, XIcon, ChurchIcon } from 'lucide-react';
import { Familia } from '../types/familia';
import { Persona, nombreCompleto } from '../types/persona';
import { formatoFechaCorta } from '../utils/fecha';

interface FamiliaFichaDialogProps {
  familia: Familia;
  personas: Persona[];
  onCerrar: () => void;
}

export function FamiliaFichaDialog({ familia, personas, onCerrar }: FamiliaFichaDialogProps) {
  const porId = new Map(personas.map((p) => [p.id, p]));
  const padre = familia.idPadre ? porId.get(familia.idPadre) : null;
  const madre = familia.idMadre ? porId.get(familia.idMadre) : null;

  const filas: [string, string][] = [
  ['Familia', familia.nombre],
  ['Tipo de unión', familia.union],
  ['Padre', padre ? nombreCompleto(padre) : '—'],
  ['Fecha de unión', familia.fecha ? formatoFechaCorta(familia.fecha) : '—'],
  ['Madre', madre ? nombreCompleto(madre) : '—'],
  ['Teléfono', familia.telefono || '—'],
  ['Domicilio', familia.domicilio || '—'],
  ['País', familia.pais || '—'],
  ['Localidad', familia.localidad || '—'],
  ['Departamento', familia.provincia || '—']];


  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-navy-900/60"
      role="dialog"
      aria-modal="true"
      aria-label={`Ficha familiar — ${familia.nombre}`}>

      <div className="flex shrink-0 items-center justify-between border-b border-navy-700 bg-navy-800 px-4 py-2">
        <div className="flex items-center gap-3">
          <h2 className="text-[13px] font-semibold text-white">Ficha familiar</h2>
          <span className="rounded-[2px] border border-sky-400/50 bg-navy-700 px-2 py-[1px] text-[11px] text-sky-200">
            {familia.nombre}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-[2px] border border-sky-400/40 bg-navy-700 px-3 py-1 text-[12px] text-white transition-colors duration-150 ease-out hover:bg-navy-600">

            <PrinterIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
            Imprimir
          </button>
          <button
            type="button"
            onClick={onCerrar}
            className="flex items-center gap-1.5 rounded-[2px] border border-sky-400/40 bg-sky-100 px-3 py-1 text-[12px] font-semibold text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-100">

            <XIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
            Cerrar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto w-full max-w-[680px] rounded-[2px] bg-sky-100 p-8 shadow-dialog">
          <div className="mb-6 flex items-start justify-between border-b-2 border-navy-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-800">
                <ChurchIcon className="h-6 w-6 text-amber-accent" strokeWidth={1.5} />
              </span>
              <div>
                <h1 className="text-[18px] font-bold text-navy-900">Parroquia Santa Cruz</h1>
                <p className="text-[11px] text-navy-800/60">Chiquimulilla, Santa Rosa · Guatemala</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-semibold text-navy-900">Ficha familiar</p>
              <p className="text-[11px] text-navy-800/60">
                Emitida el {formatoFechaCorta(new Date().toISOString().slice(0, 10))}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {filas.map(([k, v]) =>
            <div key={k}>
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-navy-800/60">{k}</p>
                <p className="mt-0.5 text-[13px] text-navy-900">{v}</p>
              </div>
            )}
          </div>

          {familia.integrantes.length > 0 &&
          <div className="mt-6 border-t border-sky-300 pt-4">
              <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-navy-800/60">
                Integrantes
              </p>
              <ul className="space-y-1">
                {familia.integrantes.map((i) => {
                const persona = porId.get(i.idPersona);
                return (
                  <li key={i.id} className="text-[12px] text-navy-900">
                      {persona ? nombreCompleto(persona) : 'Persona no encontrada'}
                      <span className="text-navy-800/60"> — {i.tipoIntegrante}</span>
                    </li>);

              })}
              </ul>
            </div>
          }

          <div className="mt-8 flex items-end justify-between border-t border-sky-300 pt-4">
            <p className="max-w-sm text-[11px] leading-relaxed text-navy-800/60">
              Documento generado por el sistema parroquial. La autenticidad de este folio puede verificarse
              escaneando el código adjunto.
            </p>
            <div className="text-center">
              <div className="h-16 w-16 bg-charcoal" />
              <p className="mt-1 text-[10px] tracking-wide text-navy-800/60">VERIFICACIÓN</p>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
