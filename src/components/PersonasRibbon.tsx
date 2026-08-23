import {
  EraserIcon,
  FileSearchIcon,
  FolderOpenIcon,
  ListFilterIcon,
  PencilIcon,
  RefreshCwIcon,
  ArrowLeftIcon,
  UserPlusIcon,
  UserRoundXIcon,
  UsersIcon
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PersonasRibbonProps {
  modo: 'padron' | 'nuevo' | 'editar' | 'consultar';
  onAbrir: () => void;
  onNuevo: () => void;
  onEditar: () => void;
  onDesactivar: () => void;
  onActualizar: () => void;
  onBuscar: () => void;
  onFiltros: () => void;
  onLimpiar: () => void;
  onGuardar: () => void;
  onCancelar: () => void;
  onCargarFoto: () => void;
  onQuitarFoto: () => void;
  onCerrarConsulta: () => void;
  puedeAbrir: boolean;
  puedeEditar: boolean;
  puedeDesactivar: boolean;
  etiquetaEstado: 'Desactivar' | 'Reactivar';
}

interface BotonGrandeProps {
  icono: LucideIcon;
  etiqueta: string;
  onClick: () => void;
  deshabilitado?: boolean;
}

function BotonGrande({
  icono: Icono,
  etiqueta,
  onClick,
  deshabilitado = false
}: BotonGrandeProps) {
  return <button
    type="button"
    onClick={onClick}
    disabled={deshabilitado}
    className={['flex w-[68px] flex-col items-center gap-1 rounded-[3px] border px-1 pb-1 pt-1.5 text-center text-[11px] leading-tight transition-colors duration-150 ease-out', deshabilitado ? 'cursor-not-allowed border-transparent text-navy-900/35' : 'border-transparent text-navy-900 hover:border-sky-400 hover:bg-sky-100/70'].join(' ')}>
    <Icono className={['h-6 w-6', deshabilitado ? 'text-navy-900/30' : 'text-navy-700'].join(' ')} strokeWidth={1.6} />
    <span className="w-full break-words">{etiqueta}</span>
  </button>;
}

function Grupo({
  titulo,
  children
}: { titulo: string; children: React.ReactNode }) {
  return <div className="flex h-full flex-col justify-between border-r border-sky-400/70 px-2 pb-0.5">
    <div className="flex items-start gap-0.5">{children}</div>
    <div className="pt-0.5 text-center text-2xs text-navy-800/70">{titulo}</div>
  </div>;
}

export function PersonasRibbon({
  modo,
  onAbrir,
  onNuevo,
  onEditar,
  onDesactivar,
  onActualizar,
  onBuscar,
  onFiltros,
  onLimpiar,
  onGuardar,
  onCancelar,
  onCargarFoto,
  onQuitarFoto,
  onCerrarConsulta,
  puedeAbrir,
  puedeEditar,
  puedeDesactivar,
  etiquetaEstado
}: PersonasRibbonProps) {
  return <header className="shrink-0 border-b border-navy-700/40 bg-sky-200">
    <div className="flex items-center justify-between bg-navy-800 px-3 py-1.5">
      <div className="flex items-center gap-2">
        <UsersIcon className="h-4 w-4 text-amber-accent" strokeWidth={2} />
        <h1 className="text-[13px] font-semibold tracking-wide text-white">Padrón general de personas</h1>
      </div>
      <span className="text-[11px] text-sky-300">Parroquia Santa Cruz · Chiquimulilla</span>
    </div>

    <div role="tablist" aria-label="Cinta de opciones" className="flex items-end gap-0.5 border-b border-sky-400 bg-navy-700 px-2 pt-1">
      <button role="tab" aria-selected="true" type="button" className="rounded-t-[3px] border border-b-0 border-sky-400 bg-sky-100 px-4 py-1 text-[12px] font-semibold text-navy-900">
        Inicio
      </button>
    </div>

    <div className="flex h-[92px] items-stretch bg-gradient-to-b from-sky-100 to-sky-200 px-1 pt-1">
      {modo === 'padron' ? <>
        <Grupo titulo="Acciones">
          <BotonGrande icono={FolderOpenIcon} etiqueta="Abrir" onClick={onAbrir} deshabilitado={!puedeAbrir} />
          <BotonGrande icono={UserPlusIcon} etiqueta="Nuevo" onClick={onNuevo} />
          <BotonGrande icono={PencilIcon} etiqueta="Editar" onClick={onEditar} deshabilitado={!puedeEditar} />
          <BotonGrande icono={UserRoundXIcon} etiqueta={etiquetaEstado} onClick={onDesactivar} deshabilitado={!puedeDesactivar} />
          <BotonGrande icono={RefreshCwIcon} etiqueta="Actualizar" onClick={onActualizar} />
        </Grupo>
        <Grupo titulo="Consulta">
          <BotonGrande icono={FileSearchIcon} etiqueta="Buscar" onClick={onBuscar} />
          <BotonGrande icono={ListFilterIcon} etiqueta="Filtros" onClick={onFiltros} />
          <BotonGrande icono={EraserIcon} etiqueta="Limpiar" onClick={onLimpiar} />
        </Grupo>
      </> : modo === 'consultar' ? <Grupo titulo="Consulta">
        <BotonGrande icono={ArrowLeftIcon} etiqueta="Regresar" onClick={onCerrarConsulta} />
      </Grupo> : <>
        <Grupo titulo="Registro">
          <BotonGrande icono={FolderOpenIcon} etiqueta="Guardar" onClick={onGuardar} />
          <BotonGrande icono={EraserIcon} etiqueta="Limpiar" onClick={onLimpiar} />
          <BotonGrande icono={UserRoundXIcon} etiqueta="Cancelar" onClick={onCancelar} />
        </Grupo>
        <Grupo titulo="Fotografía">
          <BotonGrande icono={UserPlusIcon} etiqueta="Cargar foto" onClick={onCargarFoto} />
          <BotonGrande icono={UserRoundXIcon} etiqueta="Quitar foto" onClick={onQuitarFoto} />
        </Grupo>
      </>}
    </div>
  </header>;
}