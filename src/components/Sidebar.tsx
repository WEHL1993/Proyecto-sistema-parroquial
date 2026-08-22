import React from "react";
import { LogOutIcon } from "lucide-react";
import { Appointment, VistaAgenda } from "../types/agenda";
import { MiniCalendar } from "./MiniCalendar";
import { ModulosNav } from "./ModulosNav";
interface SidebarProps {
  fechaSeleccionada: Date;
  vista: VistaAgenda;
  onSeleccionarFecha: (fecha: Date) => void;
  citas: Appointment[];
  calendarios: {
    id: string;
    nombre: string;
    visible: boolean;
    color: string;
  }[];
  onToggleCalendario: (id: string) => void;
  onCerrarSesion: () => void;
  onSeleccionarModulo: (id: string) => void;
}
export function Sidebar({
  fechaSeleccionada,
  vista,
  onSeleccionarFecha,
  citas,
  calendarios,
  onToggleCalendario,
  onCerrarSesion,
  onSeleccionarModulo
}: SidebarProps) {
  return <nav aria-label="Panel lateral" className="flex w-[212px] shrink-0 flex-col border-r border-navy-700/40 bg-sky-50">
      <MiniCalendar fechaSeleccionada={fechaSeleccionada} vista={vista} onSeleccionar={onSeleccionarFecha} citas={citas} />

      <section aria-label="Calendarios" className="border-b border-sky-400 px-2 py-2">
        <h2 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy-800/70">
          Agenda
        </h2>
        <ul className="space-y-1">
          {calendarios.map((c) => <li key={c.id}>
              <label className="flex cursor-pointer items-center gap-2 text-[12px] text-navy-900">
                <input type="checkbox" checked={c.visible} onChange={() => onToggleCalendario(c.id)} className="h-3.5 w-3.5 accent-navy-700" />
                <span className="h-3 w-3 rounded-[2px] border border-navy-900/20" style={{
              backgroundColor: c.color
            }} aria-hidden="true" />
                {c.nombre}
              </label>
            </li>)}
        </ul>
      </section>

      <ModulosNav moduloActivo="agenda" onSeleccionarModulo={onSeleccionarModulo} />

      <div className="shrink-0 border-t border-sky-400 p-2">
        <button type="button" onClick={onCerrarSesion} className="flex w-full items-center gap-2 rounded-[2px] border border-navy-600/30 bg-sky-100 px-2 py-1.5 text-[12px] font-semibold text-navy-800 transition-colors duration-150 ease-out hover:bg-sky-100">
          <LogOutIcon className="h-4 w-4 text-navy-600" strokeWidth={1.7} />
          Cerrar sesión
        </button>
      </div>
    </nav>;
}