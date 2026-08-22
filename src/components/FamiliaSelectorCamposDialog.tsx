import React from 'react';
import { motion } from 'framer-motion';
import { XIcon, ColumnsIcon } from 'lucide-react';
import { CampoFamilia } from '../types/familia';
import { CAMPOS_OPCIONALES, ETIQUETA_CAMPO } from '../utils/familias';

interface FamiliaSelectorCamposDialogProps {
  camposVisibles: CampoFamilia[];
  onCambiar: (campos: CampoFamilia[]) => void;
  onCerrar: () => void;
}

export function FamiliaSelectorCamposDialog({
  camposVisibles,
  onCambiar,
  onCerrar
}: FamiliaSelectorCamposDialogProps) {
  function alternar(campo: CampoFamilia) {
    onCambiar(
      camposVisibles.includes(campo) ?
      camposVisibles.filter((c) => c !== campo) :
      [...camposVisibles, campo]
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Selector de campos">

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[320px] overflow-hidden rounded-[3px] border border-navy-700 bg-sky-50 shadow-dialog">

        <div className="flex items-center justify-between bg-navy-800 px-3 py-1.5">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-white">
            <ColumnsIcon className="h-3.5 w-3.5 text-amber-accent" strokeWidth={1.8} />
            Selector de campos
          </span>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-[2px] p-0.5 text-sky-200 transition-colors duration-150 ease-out hover:bg-[#B33A2B] hover:text-white">

            <XIcon className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <p className="border-b border-sky-300 bg-sky-100 px-3 py-1.5 text-[11px] text-navy-800/70">
          Elija las columnas adicionales que desea mostrar en la lista detallada.
        </p>
        <ul className="max-h-[280px] space-y-0.5 overflow-y-auto p-2">
          {CAMPOS_OPCIONALES.map((campo) =>
          <li key={campo}>
              <label className="flex cursor-pointer items-center gap-2 rounded-[2px] px-1.5 py-1 text-[12px] text-navy-900 hover:bg-sky-100">
                <input
                type="checkbox"
                checked={camposVisibles.includes(campo)}
                onChange={() => alternar(campo)}
                className="h-3.5 w-3.5 accent-navy-700" />

                {ETIQUETA_CAMPO[campo]}
              </label>
            </li>
          )}
        </ul>
        <div className="flex justify-end border-t border-sky-400 bg-sky-100 px-3 py-2">
          <button
            type="button"
            onClick={onCerrar}
            className="min-w-[92px] rounded-[2px] border border-amber-deep bg-amber-accent px-3 py-1 text-[12px] font-semibold text-navy-900 transition-colors duration-150 ease-out hover:bg-amber-deep hover:text-white">

            Cerrar
          </button>
        </div>
      </motion.div>
    </div>);

}
