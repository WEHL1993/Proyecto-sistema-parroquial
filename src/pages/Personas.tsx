import { PersonasSidebar } from '../components/PersonasSidebar';

interface PersonasProps {
  usuario: string;
  onVolverAgenda: () => void;
  onCerrarSesion: () => void;
}

export function Personas({ onVolverAgenda, onCerrarSesion }: PersonasProps) {
  return <div className="flex h-screen w-full flex-col overflow-hidden bg-sky-100 font-sans text-navy-900">
    <header className="shrink-0 border-b border-navy-700/40 bg-sky-200">
      <div className="flex items-center justify-between bg-navy-800 px-3 py-1.5">
        <h1 className="text-[13px] font-semibold tracking-wide text-white">Padrón general de personas</h1>
        <span className="text-[11px] text-sky-300">Parroquia Santa Cruz · Chiquimulilla</span>
      </div>

      <div role="tablist" aria-label="Cinta de opciones" className="flex items-end gap-0.5 border-b border-sky-400 bg-navy-700 px-2 pt-1">
        <button role="tab" aria-selected="true" type="button" className="rounded-t-[3px] border border-b-0 border-sky-400 bg-sky-100 px-4 py-1 text-[12px] font-semibold text-navy-900">
          Inicio
        </button>
      </div>
    </header>

    <div className="flex min-h-0 flex-1">
      <PersonasSidebar onVolverAgenda={onVolverAgenda} onCerrarSesion={onCerrarSesion} />
      <main className="flex min-w-0 flex-1 flex-col bg-sky-100 px-6 py-6">
        <h2 className="text-[22px] font-semibold text-navy-900">Padrón general de personas</h2>
        <p className="mt-1 text-[13px] text-navy-800/70">Administración de personas registradas en la parroquia</p>
      </main>
    </div>
  </div>;
}