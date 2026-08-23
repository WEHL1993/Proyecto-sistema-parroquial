import { CalendarCheckIcon, UsersIcon, HomeIcon, BookOpenIcon, DropletsIcon, CoinsIcon, ChurchIcon, LogOutIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { modulos } from '../data/modulos';

const ICONOS_MODULO: Record<string, LucideIcon> = {
  agenda: CalendarCheckIcon,
  personas: UsersIcon,
  familias: HomeIcon,
  catequesis: BookOpenIcon,
  sacramental: DropletsIcon,
  economico: CoinsIcon,
  celebraciones: ChurchIcon
};

interface PersonasSidebarProps {
  onVolverAgenda: () => void;
  onCerrarSesion: () => void;
}

export function PersonasSidebar({ onVolverAgenda, onCerrarSesion }: PersonasSidebarProps) {
  return <nav aria-label="Panel lateral" className="flex w-[212px] shrink-0 flex-col border-r border-navy-700/40 bg-sky-50">
    <div className="flex-1 overflow-y-auto py-1">
      <h2 className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy-800/70">
        Módulos
      </h2>
      <ul>
        {modulos.map((m) => {
          const Icono = ICONOS_MODULO[m.id];
          const activo = m.id === 'personas';
          return <li key={m.id}>
            <button
              type="button"
              aria-current={activo ? 'page' : undefined}
              onClick={m.id === 'agenda' ? onVolverAgenda : undefined}
              className={['flex w-full items-center gap-2.5 border-l-[3px] px-2 py-[7px] text-left text-[12px] transition-colors duration-150 ease-out', activo ? 'border-amber-accent bg-sky-100 font-semibold text-navy-900' : 'border-transparent text-navy-800 hover:bg-sky-100'].join(' ')}>
              <Icono className={['h-[18px] w-[18px]', activo ? 'text-amber-deep' : 'text-navy-600'].join(' ')} strokeWidth={1.7} />
              {m.id === 'agenda' ? 'Agenda' : m.nombre}
            </button>
          </li>;
        })}
      </ul>
    </div>

    <div className="shrink-0 border-t border-sky-400 p-2">
      <button type="button" onClick={onCerrarSesion} className="flex w-full items-center gap-2 rounded-[2px] border border-navy-600/30 bg-sky-100 px-2 py-1.5 text-[12px] font-semibold text-navy-800 transition-colors duration-150 ease-out hover:bg-sky-100">
        <LogOutIcon className="h-4 w-4 text-navy-600" strokeWidth={1.7} />
        Cerrar sesión
      </button>
    </div>
  </nav>;
}