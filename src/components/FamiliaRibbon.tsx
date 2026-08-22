import React from 'react';
import {
  UserPlusIcon,
  Trash2Icon,
  RefreshCwIcon,
  PrinterIcon,
  FileSearchIcon,
  LayersIcon,
  ColumnsIcon,
  RotateCcwIcon,
  FilterIcon,
  FileSpreadsheetIcon,
  HomeIcon,
  BoxIcon,
  PanelBottomIcon,
  PanelRightIcon,
  EyeOffIcon,
  ListIcon } from
'lucide-react';
import { PosicionVistaPrevia, VistaFamilias } from '../types/familia';

type PestanaRibbon = 'inicio' | 'impresion';

interface FamiliaRibbonProps {
  pestana: PestanaRibbon;
  onPestanaChange: (p: PestanaRibbon) => void;
  onNuevo: () => void;
  onEliminar: () => void;
  onActualizar: () => void;
  onVistaPrevia: () => void;
  haySeleccion: boolean;
  panelVistaPrevia: PosicionVistaPrevia;
  onCambiarPanelVistaPrevia: (p: PosicionVistaPrevia) => void;
  onAgrupar: () => void;
  onSelectorCampos: () => void;
  vistaActual: VistaFamilias;
  onCambiarVista: (v: VistaFamilias) => void;
  onRestaurar: () => void;
  panelFiltroVisible: boolean;
  onTogglePanelFiltro: () => void;
  onExportarExcel: () => void;
}

function BotonGrande({
  icono: Icono,
  etiqueta,
  onClick,
  activo = false,
  deshabilitado = false



}: {icono: BoxIcon;etiqueta: string;onClick?: () => void;activo?: boolean;deshabilitado?: boolean;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deshabilitado}
      aria-pressed={activo || undefined}
      className={[
      'flex w-[68px] flex-col items-center gap-1 rounded-[3px] border px-1 pb-1 pt-1.5 text-center text-[11px] leading-tight transition-colors duration-150 ease-out',
      deshabilitado ?
      'cursor-not-allowed border-transparent text-navy-900/35' :
      activo ?
      'border-amber-deep/60 bg-amber-soft text-navy-900 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]' :
      'border-transparent text-navy-900 hover:border-sky-400 hover:bg-sky-100/70'].
      join(' ')}>

      <Icono
        className={['h-6 w-6', deshabilitado ? 'text-navy-900/30' : activo ? 'text-amber-deep' : 'text-navy-700'].join(' ')}
        strokeWidth={1.6} />

      <span className="w-full break-words">{etiqueta}</span>
    </button>);

}

function BotonPequeno({
  icono: Icono,
  etiqueta,
  onClick,
  activo = false



}: {icono: BoxIcon;etiqueta: string;onClick?: () => void;activo?: boolean;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo || undefined}
      className={[
      'flex items-center gap-1.5 rounded-[2px] border px-1.5 py-0.5 text-left text-[11px] transition-colors duration-150 ease-out',
      activo ?
      'border-amber-deep/60 bg-amber-soft font-semibold text-navy-900' :
      'border-transparent text-navy-900 hover:bg-sky-100/70'].
      join(' ')}>

      <Icono className={activo ? 'h-3.5 w-3.5 shrink-0 text-amber-deep' : 'h-3.5 w-3.5 shrink-0 text-navy-700'} strokeWidth={1.8} />
      {etiqueta}
    </button>);

}

function Grupo({
  titulo,
  children



}: {titulo: string;children: React.ReactNode;}) {
  return (
    <div className="flex h-full flex-col justify-between border-r border-sky-400/70 px-2 pb-0.5">
      <div className="flex items-start gap-0.5">{children}</div>
      <div className="pt-0.5 text-center text-2xs text-navy-800/70">{titulo}</div>
    </div>);

}

const ETIQUETA_VISTA: Record<VistaFamilias, string> = {
  sencilla: 'Lista sencilla',
  detallada: 'Lista detallada',
  integrantes: 'Lista de integrantes'
};

export function FamiliaRibbon({
  pestana,
  onPestanaChange,
  onNuevo,
  onEliminar,
  onActualizar,
  onVistaPrevia,
  haySeleccion,
  panelVistaPrevia,
  onCambiarPanelVistaPrevia,
  onAgrupar,
  onSelectorCampos,
  vistaActual,
  onCambiarVista,
  onRestaurar,
  panelFiltroVisible,
  onTogglePanelFiltro,
  onExportarExcel
}: FamiliaRibbonProps) {
  const pestanas: {id: PestanaRibbon;nombre: string;}[] = [
  { id: 'inicio', nombre: 'Inicio' },
  { id: 'impresion', nombre: 'Impresión' }];


  return (
    <header className="shrink-0 border-b border-navy-700/40 bg-sky-200">
      <div className="flex items-center justify-between bg-navy-800 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <HomeIcon className="h-4 w-4 text-amber-accent" strokeWidth={2} />
          <h1 className="text-[13px] font-semibold tracking-wide text-white">Familias</h1>
        </div>
        <span className="text-[11px] text-sky-300">Parroquia Santa Cruz · Chiquimulilla</span>
      </div>

      <div role="tablist" aria-label="Cinta de opciones" className="flex items-end gap-0.5 border-b border-sky-400 bg-navy-700 px-2 pt-1">
        {pestanas.map((p) => {
          const activa = p.id === pestana;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={activa}
              type="button"
              onClick={() => onPestanaChange(p.id)}
              className={[
              'rounded-t-[3px] border border-b-0 px-4 py-1 text-[12px] transition-colors duration-150 ease-out',
              activa ?
              'border-sky-400 bg-sky-100 font-semibold text-navy-900' :
              'text-sky-200 hover:bg-navy-600 border-transparent'].
              join(' ')}>

              {p.nombre}
            </button>);

        })}
      </div>

      <div className="flex h-[92px] items-stretch bg-gradient-to-b from-sky-100 to-sky-200 px-1 pt-1">
        {pestana === 'inicio' ?
        <>
            <Grupo titulo="Registros">
              <BotonGrande icono={UserPlusIcon} etiqueta="Nuevo..." onClick={onNuevo} />
              <BotonGrande icono={Trash2Icon} etiqueta="Eliminar" onClick={onEliminar} deshabilitado={!haySeleccion} />
            </Grupo>
            <Grupo titulo="Imprimir">
              <BotonGrande icono={RefreshCwIcon} etiqueta="Actualizar" onClick={onActualizar} />
              <BotonGrande icono={PrinterIcon} etiqueta="Imprimir" onClick={() => window.print()} />
              <BotonGrande icono={FileSearchIcon} etiqueta="Vista previa" onClick={onVistaPrevia} />
            </Grupo>
            <Grupo titulo="Panel de vista previa">
              <BotonGrande
              icono={EyeOffIcon}
              etiqueta="Desactivado"
              activo={panelVistaPrevia === 'desactivado'}
              onClick={() => onCambiarPanelVistaPrevia('desactivado')} />

              <BotonGrande
              icono={PanelBottomIcon}
              etiqueta="Abajo"
              activo={panelVistaPrevia === 'abajo'}
              onClick={() => onCambiarPanelVistaPrevia('abajo')} />

              <BotonGrande
              icono={PanelRightIcon}
              etiqueta="Derecha"
              activo={panelVistaPrevia === 'derecha'}
              onClick={() => onCambiarPanelVistaPrevia('derecha')} />

            </Grupo>
            <Grupo titulo="Configuración">
              <BotonGrande icono={LayersIcon} etiqueta="Agrupar" onClick={onAgrupar} />
              <div className="flex flex-col items-start gap-0.5">
                <BotonPequeno icono={ColumnsIcon} etiqueta="Selector de campos..." onClick={onSelectorCampos} />
                <BotonPequeno icono={FilterIcon} etiqueta="Panel de filtro" activo={panelFiltroVisible} onClick={onTogglePanelFiltro} />
                <label className="flex items-center gap-1.5 px-1.5 py-0.5 text-[11px] text-navy-900">
                  <ListIcon className="h-3.5 w-3.5 shrink-0 text-navy-700" strokeWidth={1.8} />
                  <select
                    value={vistaActual}
                    onChange={(e) => onCambiarVista(e.target.value as VistaFamilias)}
                    className="rounded-[2px] border border-navy-600/30 bg-sky-100 px-1 py-0.5 text-[11px] text-navy-900 outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent">

                    {(Object.keys(ETIQUETA_VISTA) as VistaFamilias[]).map((v) =>
                    <option key={v} value={v}>
                        {ETIQUETA_VISTA[v]}
                      </option>
                    )}
                  </select>
                </label>
              </div>
              <BotonGrande icono={RotateCcwIcon} etiqueta="Restaurar valores predeterminados" onClick={onRestaurar} />
            </Grupo>
            <Grupo titulo="Exportar">
              <BotonGrande icono={FileSpreadsheetIcon} etiqueta="A MS Excel" onClick={onExportarExcel} />
            </Grupo>
          </> :

        <Grupo titulo="Impresión">
            <BotonGrande icono={PrinterIcon} etiqueta="Imprimir" onClick={() => window.print()} />
            <BotonGrande icono={FileSearchIcon} etiqueta="Vista previa" onClick={onVistaPrevia} />
          </Grupo>
        }
      </div>
    </header>);

}
