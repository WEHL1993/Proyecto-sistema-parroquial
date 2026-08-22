import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDownIcon,
  LayersIcon,
  Trash2Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExpandIcon,
  XIcon } from
'lucide-react';
import { CampoFamilia } from '../types/familia';
import { CAMPOS_FILTRO, ETIQUETA_CAMPO } from '../utils/familias';

interface FamiliaGroupByDialogProps {
  valorInicial: CampoFamilia[];
  onAceptar: (campos: CampoFamilia[]) => void;
  onCancelar: () => void;
}

export function FamiliaGroupByDialog({ valorInicial, onAceptar, onCancelar }: FamiliaGroupByDialogProps) {
  const [niveles, setNiveles] = useState<CampoFamilia[]>(valorInicial);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  function agregarNivel(campo: CampoFamilia) {
    if (!niveles.includes(campo)) setNiveles((prev) => [...prev, campo]);
    setMenuAbierto(false);
  }

  function quitarNivel() {
    if (seleccionado === null) return;
    setNiveles((prev) => prev.filter((_, i) => i !== seleccionado));
    setSeleccionado(null);
  }

  function moverNivel(direccion: -1 | 1) {
    if (seleccionado === null) return;
    const destino = seleccionado + direccion;
    if (destino < 0 || destino >= niveles.length) return;
    setNiveles((prev) => {
      const copia = [...prev];
      [copia[seleccionado], copia[destino]] = [copia[destino], copia[seleccionado]];
      return copia;
    });
    setSeleccionado(destino);
  }

  const disponibles = CAMPOS_FILTRO.filter((c) => !niveles.includes(c));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Agrupar por">

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
        className="flex w-full max-w-[620px] flex-col overflow-hidden rounded-[3px] border border-navy-700 bg-sky-50 shadow-dialog">

        <div className="flex items-center justify-between bg-navy-800 px-3 py-1.5">
          <span className="text-[12px] font-semibold text-white">Agrupar Por</span>
          <button
            type="button"
            onClick={onCancelar}
            aria-label="Cerrar"
            className="rounded-[2px] p-0.5 text-sky-200 transition-colors duration-150 ease-out hover:bg-[#B33A2B] hover:text-white">

            <XIcon className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center gap-1 border-b border-sky-300 bg-sky-100 px-2 py-1.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
              className="flex items-center gap-1.5 rounded-[2px] border border-navy-600/30 bg-white px-2 py-1 text-[11px] text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-50">

              <LayersIcon className="h-3.5 w-3.5 text-navy-700" strokeWidth={1.8} />
              Nuevo agrupamiento
              <ChevronDownIcon className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            {menuAbierto &&
            <div className="absolute left-0 top-full z-10 mt-1 w-[220px] rounded-[2px] border border-navy-600/30 bg-white shadow-dialog">
                <div className="border-b border-sky-200 px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-navy-800/60">
                  Nuevo agrupamiento por campo
                </div>
                {disponibles.length === 0 ?
              <p className="px-2 py-2 text-[11px] italic text-navy-800/50">
                    Todos los campos ya están agrupados.
                  </p> :

              disponibles.map((campo) =>
              <button
                key={campo}
                type="button"
                onClick={() => agregarNivel(campo)}
                className="block w-full px-2 py-1 text-left text-[11px] text-navy-900 hover:bg-sky-100">

                      {ETIQUETA_CAMPO[campo]}
                    </button>
              )
              }
              </div>
            }
          </div>
          <button
            type="button"
            onClick={quitarNivel}
            disabled={seleccionado === null}
            className="flex items-center gap-1.5 rounded-[2px] border border-navy-600/30 bg-white px-2 py-1 text-[11px] text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-navy-900/30">

            <Trash2Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
            Quitar agrupamiento
          </button>
          <button
            type="button"
            onClick={() => moverNivel(-1)}
            disabled={seleccionado === null || seleccionado === 0}
            className="flex items-center gap-1.5 rounded-[2px] border border-navy-600/30 bg-white px-2 py-1 text-[11px] text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-navy-900/30">

            <ArrowUpIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
            Subir
          </button>
          <button
            type="button"
            onClick={() => moverNivel(1)}
            disabled={seleccionado === null || seleccionado === niveles.length - 1}
            className="flex items-center gap-1.5 rounded-[2px] border border-navy-600/30 bg-white px-2 py-1 text-[11px] text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-navy-900/30">

            <ArrowDownIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
            Bajar
          </button>
        </div>

        <div className="flex h-[260px]">
          <div className="w-[220px] shrink-0 overflow-y-auto border-r border-sky-300 bg-white p-1.5">
            {niveles.length === 0 ?
            <p className="p-2 text-[11px] italic text-navy-800/50">Sin niveles de agrupamiento.</p> :

            niveles.map((campo, i) =>
            <button
              key={campo}
              type="button"
              onClick={() => setSeleccionado(i)}
              className={[
              'flex w-full items-center justify-between gap-2 rounded-[2px] px-2 py-1 text-left text-[11px] transition-colors duration-150 ease-out',
              seleccionado === i ? 'bg-amber-soft font-semibold text-navy-900' : 'text-navy-900 hover:bg-sky-100'].
              join(' ')}>

                  <span>
                    {i + 1}. {ETIQUETA_CAMPO[campo]}
                  </span>
                </button>
            )
            }
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-sky-100 p-4 text-center">
            <ExpandIcon className="h-6 w-6 text-navy-700/40" strokeWidth={1.5} />
            {niveles.length === 0 ?
            <p className="text-[11px] text-navy-800/60">
                Seleccione «Nuevo agrupamiento» para elegir el campo por el cual desea agrupar la lista de familias.
              </p> :

            <p className="text-[11px] text-navy-800/70">
                La lista se agrupará por:{' '}
                <span className="font-semibold text-navy-900">
                  {niveles.map((c) => ETIQUETA_CAMPO[c]).join(' → ')}
                </span>
              </p>
            }
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-sky-400 bg-sky-100 px-3 py-2">
          <button
            type="button"
            onClick={onCancelar}
            className="min-w-[92px] rounded-[2px] border border-navy-600/50 bg-sky-100 px-3 py-1 text-[12px] text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-100">

            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onAceptar(niveles)}
            className="min-w-[92px] rounded-[2px] border border-amber-deep bg-amber-accent px-3 py-1 text-[12px] font-semibold text-navy-900 transition-colors duration-150 ease-out hover:bg-amber-deep hover:text-white">

            Aceptar
          </button>
        </div>
      </motion.div>
    </div>);

}
