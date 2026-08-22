import React from 'react';
import { HomeIcon, MapPinIcon, PhoneIcon, MailIcon, UsersIcon, RadioIcon } from 'lucide-react';
import { FamiliaVista } from '../types/familia';
import { Persona, nombreCompleto } from '../types/persona';
import { formatoFechaCorta } from '../utils/fecha';

interface FamiliaPreviewPanelProps {
  familia: FamiliaVista | null;
  personas: Persona[];
}

function Dato({ icono: Icono, etiqueta, valor }: {icono: typeof HomeIcon;etiqueta: string;valor: string;}) {
  if (!valor) return null;
  return (
    <div className="flex items-start gap-1.5 text-[11px] text-navy-900">
      <Icono className="mt-[1px] h-3.5 w-3.5 shrink-0 text-navy-600" strokeWidth={1.7} />
      <span>
        <span className="text-navy-800/60">{etiqueta}: </span>
        {valor}
      </span>
    </div>);

}

export function FamiliaPreviewPanel({ familia, personas }: FamiliaPreviewPanelProps) {
  if (!familia) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-[11px] text-navy-800/50">
        Seleccione una familia para ver la vista previa.
      </div>);

  }

  const porId = new Map(personas.map((p) => [p.id, p]));

  return (
    <div className="h-full overflow-y-auto p-3">
      <h3 className="mb-0.5 text-[13px] font-semibold text-navy-900">{familia.nombre}</h3>
      <p className="mb-2 text-[11px] text-navy-800/60">
        {familia.union}
        {familia.fecha ? ` · ${formatoFechaCorta(familia.fecha)}` : ''}
      </p>
      <div className="space-y-1 border-t border-sky-300 pt-2">
        <Dato icono={HomeIcon} etiqueta="Padre" valor={familia.padre || '—'} />
        <Dato icono={HomeIcon} etiqueta="Madre" valor={familia.madre || '—'} />
        <Dato icono={MapPinIcon} etiqueta="Domicilio" valor={[familia.domicilio, familia.localidad].filter(Boolean).join(', ')} />
        <Dato icono={PhoneIcon} etiqueta="Teléfono" valor={familia.telefono} />
        <Dato icono={MailIcon} etiqueta="E-mail" valor={familia.email} />
        <Dato icono={RadioIcon} etiqueta="En radio parroquial" valor={familia.enRadioParroquial ? 'Sí' : 'No'} />
      </div>

      <div className="mt-3 border-t border-sky-300 pt-2">
        <h4 className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy-800/70">
          <UsersIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
          Integrantes ({familia.integrantes.length})
        </h4>
        {familia.integrantes.length === 0 ?
        <p className="text-[11px] italic text-navy-800/50">Sin integrantes registrados.</p> :

        <ul className="space-y-1">
            {familia.integrantes.map((i) => {
            const persona = porId.get(i.idPersona);
            return (
              <li key={i.id} className="rounded-[2px] border border-sky-200 bg-sky-50 px-2 py-1 text-[11px] text-navy-900">
                  <span className="font-semibold">{persona ? nombreCompleto(persona) : 'Persona no encontrada'}</span>
                  <span className="text-navy-800/60"> — {i.tipoIntegrante}</span>
                  {persona?.fechaNacimiento &&
                <span className="block text-navy-800/60">Nace: {formatoFechaCorta(persona.fechaNacimiento)}</span>
                }
                </li>);

          })}
          </ul>
        }
      </div>

      {familia.observaciones &&
      <div className="mt-3 border-t border-sky-300 pt-2">
          <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-navy-800/70">
            Observaciones
          </h4>
          <p className="text-[11px] leading-relaxed text-navy-900">{familia.observaciones}</p>
        </div>
      }
    </div>);

}
