import React from 'react';
import { UserIcon, HomeIcon, WifiIcon, LogOutIcon } from 'lucide-react';

interface FamiliaStatusBarProps {
  totalFamilias: number;
  totalVisibles: number;
  mensaje: string;
  usuario: string;
  onCerrarSesion: () => void;
}

export function FamiliaStatusBar({
  totalFamilias,
  totalVisibles,
  mensaje,
  usuario,
  onCerrarSesion
}: FamiliaStatusBarProps) {
  return (
    <footer className="flex shrink-0 items-center justify-between border-t border-navy-700/40 bg-gradient-to-b from-sky-100 to-sky-200 px-3 py-1 text-[11px] text-navy-900">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <HomeIcon className="h-3.5 w-3.5 text-navy-600" />
          {totalVisibles} de {totalFamilias} familias
        </span>
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
