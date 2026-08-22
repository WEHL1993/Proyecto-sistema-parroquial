import React from 'react';
import { CalendarCheckIcon, UsersIcon, HomeIcon, BookOpenIcon, DropletsIcon, CoinsIcon, ChurchIcon, BoxIcon } from 'lucide-react';
import { modulos } from '../data/modulos';

export const ICONOS_MODULO: Record<string, BoxIcon> = {
  agenda: CalendarCheckIcon,
  personas: UsersIcon,
  familias: HomeIcon,
  catequesis: BookOpenIcon,
  sacramental: DropletsIcon,
  economico: CoinsIcon,
  celebraciones: ChurchIcon
};

interface ModulosNavProps {
  moduloActivo: string;
  onSeleccionarModulo: (id: string) => void;
}

export function ModulosNav({ moduloActivo, onSeleccionarModulo }: ModulosNavProps) {
  return (
    <div className="flex-1 overflow-y-auto py-1">
      <h2 className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy-800/70">
        Módulos
      </h2>
      <ul>
        {modulos.map((m) => {
          const Icono = ICONOS_MODULO[m.id];
          const activo = m.id === moduloActivo;
          return (
            <li key={m.id}>
              <button
                type="button"
                aria-current={activo ? 'page' : undefined}
                onClick={() => onSeleccionarModulo(m.id)}
                className={[
                'flex w-full items-center gap-2.5 border-l-[3px] px-2 py-[7px] text-left text-[12px] transition-colors duration-150 ease-out',
                activo ?
                'border-amber-accent bg-sky-100 font-semibold text-navy-900' :
                'border-transparent text-navy-800 hover:bg-sky-100'].
                join(' ')}>

                <Icono
                  className={['h-[18px] w-[18px]', activo ? 'text-amber-deep' : 'text-navy-600'].join(' ')}
                  strokeWidth={1.7} />

                {m.nombre}
              </button>
            </li>);

        })}
      </ul>
    </div>);

}
