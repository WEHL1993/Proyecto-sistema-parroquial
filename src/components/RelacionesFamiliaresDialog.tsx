import React from 'react';
import { motion } from 'framer-motion';
import { XIcon, NetworkIcon } from 'lucide-react';
import { Persona, nombreCompleto } from '../types/persona';
import { calcularRelacionesFamiliares } from '../utils/personas';
import { PersonaAvatar } from './PersonaAvatar';

interface RelacionesFamiliaresDialogProps {
  persona: Persona;
  personas: Persona[];
  onCerrar: () => void;
}

export function RelacionesFamiliaresDialog({ persona, personas, onCerrar }: RelacionesFamiliaresDialogProps) {
  const grupos = calcularRelacionesFamiliares(persona.id, personas);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Relaciones familiares de ${nombreCompleto(persona)}`}>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
        className="flex max-h-[88vh] w-full max-w-[640px] flex-col overflow-hidden rounded-[3px] border border-navy-700 bg-sky-50 shadow-dialog">

        <div className="flex shrink-0 items-center justify-between bg-navy-800 px-3 py-1.5">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-white">
            <NetworkIcon className="h-3.5 w-3.5 text-amber-accent" strokeWidth={1.8} />
            Relaciones familiares
          </span>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-[2px] p-0.5 text-sky-200 transition-colors duration-150 ease-out hover:bg-[#B33A2B] hover:text-white">

            <XIcon className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <p className="shrink-0 border-b border-sky-300 bg-sky-100 px-3 py-1.5 text-[11px] text-navy-800/70">
          {nombreCompleto(persona)}
          {persona.numeroDocumento ? ` · ${persona.tipoDocumento} ${persona.numeroDocumento}` : ''}
        </p>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {grupos.map((g) =>
          <div key={g.id} className="grid grid-cols-[100px_1fr] gap-2">
              <div className="flex items-start gap-1.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-800 text-[10px] font-semibold text-white">
                  {g.id}
                </span>
                <span className="pt-[1px] text-[11px] font-semibold uppercase tracking-wide text-navy-800">
                  {g.tipo}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.personas.length === 0 ?
              <span className="rounded-[2px] border border-dashed border-navy-600/30 bg-sky-100 px-2 py-1 text-[11px] italic text-navy-800/50">
                    Sin registros para esta persona
                  </span> :

              g.personas.map((p) =>
              <span
                key={p.id}
                className="flex items-center gap-1.5 rounded-[2px] border border-navy-600/20 bg-white px-2 py-1">

                      <PersonaAvatar persona={p} tamano="sm" />
                      <span className="text-[11px] text-navy-900">{nombreCompleto(p)}</span>
                    </span>
              )
              }
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-sky-400 bg-sky-100 px-3 py-2">
          <p className="text-[10.5px] leading-relaxed text-navy-800/60">
            Los siete parentescos se calculan a partir del padre y la madre registrados de cada persona; no se
            almacenan como datos independientes.
          </p>
        </div>
      </motion.div>
    </div>);

}
