import React from 'react';
import { LogOutIcon, HardHatIcon } from 'lucide-react';
import { ModulosNav } from '../components/ModulosNav';
import { modulos } from '../data/modulos';

interface ModuloEnConstruccionProps {
  moduloId: string;
  usuario: string;
  onCerrarSesion: () => void;
  onSeleccionarModulo: (id: string) => void;
}

export function ModuloEnConstruccion({
  moduloId,
  usuario,
  onCerrarSesion,
  onSeleccionarModulo
}: ModuloEnConstruccionProps) {
  const nombre = modulos.find((m) => m.id === moduloId)?.nombre ?? moduloId;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-sky-100 font-sans text-navy-900">
      <div className="flex items-center justify-between bg-navy-800 px-3 py-1.5">
        <h1 className="text-[13px] font-semibold tracking-wide text-white">{nombre}</h1>
        <span className="text-[11px] text-sky-300">Parroquia Santa Cruz · Chiquimulilla</span>
      </div>

      <div className="flex min-h-0 flex-1">
        <nav aria-label="Panel lateral" className="flex w-[212px] shrink-0 flex-col border-r border-navy-700/40 bg-sky-50">
          <ModulosNav moduloActivo={moduloId} onSeleccionarModulo={onSeleccionarModulo} />
          <div className="shrink-0 border-t border-sky-400 p-2">
            <button
              type="button"
              onClick={onCerrarSesion}
              className="flex w-full items-center gap-2 rounded-[2px] border border-navy-600/30 bg-sky-100 px-2 py-1.5 text-[12px] font-semibold text-navy-800 transition-colors duration-150 ease-out hover:bg-sky-100">

              <LogOutIcon className="h-4 w-4 text-navy-600" strokeWidth={1.7} />
              Cerrar sesión
            </button>
          </div>
        </nav>

        <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <HardHatIcon className="h-10 w-10 text-navy-600/50" strokeWidth={1.5} />
          <h2 className="text-[16px] font-semibold text-navy-900">Módulo «{nombre}» en construcción</h2>
          <p className="max-w-[380px] text-[12px] text-navy-800/70">
            Este módulo todavía no está disponible en la versión de prueba. Estamos trabajando para
            incorporarlo próximamente.
          </p>
        </main>
      </div>

      <footer className="flex shrink-0 items-center justify-end border-t border-navy-700/40 bg-gradient-to-b from-sky-100 to-sky-200 px-3 py-1 text-[11px] font-semibold text-navy-900">
        {usuario}
      </footer>
    </div>);

}
