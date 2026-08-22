import React from 'react';
import { LogOutIcon, HomeIcon } from 'lucide-react';
import { VistaFamilias } from '../types/familia';
import { ModulosNav } from './ModulosNav';

interface FamiliaSidebarProps {
  vistaActual: VistaFamilias;
  onCambiarVista: (v: VistaFamilias) => void;
  onCerrarSesion: () => void;
  onSeleccionarModulo: (id: string) => void;
}

const OPCIONES_VISTA: {id: VistaFamilias;etiqueta: string;}[] = [
{ id: 'sencilla', etiqueta: 'Lista sencilla' },
{ id: 'detallada', etiqueta: 'Lista detallada' },
{ id: 'integrantes', etiqueta: 'Lista de integrantes' }];


export function FamiliaSidebar({
  vistaActual,
  onCambiarVista,
  onCerrarSesion,
  onSeleccionarModulo
}: FamiliaSidebarProps) {
  return (
    <nav aria-label="Panel lateral" className="flex w-[212px] shrink-0 flex-col border-r border-navy-700/40 bg-sky-50">
      <section aria-label="Lista de familias" className="border-b border-sky-400 px-2 py-2">
        <h2 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy-800/70">
          Lista de Familias
        </h2>
        <button
          type="button"
          aria-current="page"
          className="flex w-full items-center gap-2 rounded-[2px] border-l-[3px] border-amber-accent bg-sky-100 px-2 py-[6px] text-left text-[12px] font-semibold text-navy-900">

          <HomeIcon className="h-4 w-4 text-amber-deep" strokeWidth={1.7} />
          Familias
        </button>
      </section>

      <section aria-label="Vista actual" className="border-b border-sky-400 px-2 py-2">
        <h2 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy-800/70">
          Vista Actual
        </h2>
        <ul className="space-y-1">
          {OPCIONES_VISTA.map((o) =>
          <li key={o.id}>
              <label className="flex cursor-pointer items-center gap-2 text-[12px] text-navy-900">
                <input
                type="radio"
                name="vista-familias"
                checked={vistaActual === o.id}
                onChange={() => onCambiarVista(o.id)}
                className="h-3.5 w-3.5 accent-navy-700" />

                {o.etiqueta}
              </label>
            </li>
          )}
        </ul>
      </section>

      <ModulosNav moduloActivo="familias" onSeleccionarModulo={onSeleccionarModulo} />

      <div className="shrink-0 border-t border-sky-400 p-2">
        <button
          type="button"
          onClick={onCerrarSesion}
          className="flex w-full items-center gap-2 rounded-[2px] border border-navy-600/30 bg-sky-100 px-2 py-1.5 text-[12px] font-semibold text-navy-800 transition-colors duration-150 ease-out hover:bg-sky-100">

          <LogOutIcon className="h-4 w-4 text-navy-600" strokeWidth={1.7} />
          Cerrar sesión
        </button>
      </div>
    </nav>);

}
