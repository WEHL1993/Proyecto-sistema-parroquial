import React from 'react';
import { UserIcon, CalendarIcon, WifiIcon, LogOutIcon } from 'lucide-react';
import { formatoFechaLarga } from '../utils/agenda';

interface StatusBarProps {
  totalCitas: number;
  mensaje: string;
  usuario: string;
  onCerrarSesion: () => void;
}

export function StatusBar({
  totalCitas,
  mensaje,
  usuario,
  onCerrarSesion
}: StatusBarProps) {
  return (
    <footer className="flex shrink-0 items-center justify-between border-t border-navy-700/40 bg-gradient-to-b from-sky-100 to-sky-200 px-3 py-1 text-[11px] text-navy-900">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="h-3.5 w-3.5 text-navy-600" />
          <span className="capitalize">{formatoFechaLarga(new Date())}</span>
        </span>
        <span className="text-navy-800/80">{totalCitas} citas en la agenda</span>
        {mensaje && <span className="text-amber-deep">{mensaje}</span>}
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-navy-800/80">
          <WifiIcon className="h-3.5 w-3.5 text-navy-600" />
          Conectado al servidor parroquial
        </span>
        <span className="flex items-center gap-1.5 font-semibold">
          <UserIcon className="h-3.5 w-3.5 text-navy-600" />
          {usuario}
        </span>
        <button
          type="button"
          onClick={onCerrarSesion}
          className="flex items-center gap-1.5 rounded-[2px] border border-navy-600/40 bg-sky-100 px-2 py-[2px] font-semibold text-navy-800 transition-colors duration-150 ease-out hover:bg-sky-100">
          
          <LogOutIcon className="h-3.5 w-3.5 text-navy-600" />
          Cerrar sesión
        </button>
      </div>
    </footer>);

}