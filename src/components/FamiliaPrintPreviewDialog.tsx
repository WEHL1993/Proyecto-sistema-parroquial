import React from 'react';
import { PrinterIcon, XIcon } from 'lucide-react';
import { FamiliaVista } from '../types/familia';
import { formatoFechaCorta } from '../utils/fecha';

interface FamiliaPrintPreviewDialogProps {
  familias: FamiliaVista[];
  onCerrar: () => void;
}

export function FamiliaPrintPreviewDialog({ familias, onCerrar }: FamiliaPrintPreviewDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-navy-900/60"
      role="dialog"
      aria-modal="true"
      aria-label="Vista previa de impresión — Familias">

      <div className="flex shrink-0 items-center justify-between border-b border-navy-700 bg-navy-800 px-4 py-2">
        <div className="flex items-center gap-3">
          <h2 className="text-[13px] font-semibold text-white">Vista previa de impresión</h2>
          <span className="rounded-[2px] border border-sky-400/50 bg-navy-700 px-2 py-[1px] text-[11px] text-sky-200">
            Listado de familias
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
        <div className="mx-auto w-full max-w-[820px] rounded-[2px] bg-sky-100 p-8 shadow-dialog">
          <div className="mb-4 border-b-2 border-navy-800 pb-2">
            <p className="text-[11px] text-navy-800/70">Office Eclesial — Familias</p>
            <h1 className="text-[20px] font-bold text-navy-900">Listado de familias</h1>
            <p className="text-[11px] text-navy-800/60">{familias.length} familias</p>
          </div>

          <table className="w-full border-collapse text-[10.5px]">
            <thead>
              <tr className="border-b border-navy-300 text-left text-navy-800">
                <th className="py-1 pr-2 font-semibold">Nombre</th>
                <th className="py-1 pr-2 font-semibold">Padre</th>
                <th className="py-1 pr-2 font-semibold">Madre</th>
                <th className="py-1 pr-2 font-semibold">Unión</th>
                <th className="py-1 pr-2 font-semibold">Fecha</th>
                <th className="py-1 pr-2 font-semibold">Domicilio</th>
                <th className="py-1 font-semibold">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {familias.map((f) =>
              <tr key={f.id} className="border-b border-navy-200 text-navy-900">
                  <td className="py-1 pr-2">{f.nombre}</td>
                  <td className="py-1 pr-2">{f.padre || '—'}</td>
                  <td className="py-1 pr-2">{f.madre || '—'}</td>
                  <td className="py-1 pr-2">{f.union}</td>
                  <td className="py-1 pr-2">{f.fecha ? formatoFechaCorta(f.fecha) : '—'}</td>
                  <td className="py-1 pr-2">{f.domicilio}</td>
                  <td className="py-1">{f.telefono}</td>
                </tr>
              )}
            </tbody>
          </table>
          {familias.length === 0 &&
          <p className="py-4 text-center text-[11px] italic text-navy-800/50">No se encontró informacion.</p>
          }
        </div>
      </div>
    </div>);

}
