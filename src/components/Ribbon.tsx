import React, { useState } from "react";
import { CalendarPlusIcon, Trash2Icon, RefreshCwIcon, PrinterIcon, FileSearchIcon, SettingsIcon, CalendarDaysIcon, CalendarRangeIcon, CalendarIcon, BriefcaseBusinessIcon, CalendarCheckIcon, FolderOpenIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { VistaAgenda } from "../types/agenda";
import { PageSetupDialog } from "./PageSetupDialog";
type PestanaRibbon = 'inicio' | 'impresion';
interface RibbonProps {
  pestana: PestanaRibbon;
  onPestanaChange: (p: PestanaRibbon) => void;
  vista: VistaAgenda;
  onVistaChange: (v: VistaAgenda) => void;
  onAbrir: () => void;
  onNuevo: () => void;
  onEliminar: () => void;
  onActualizar: () => void;
  onHoy: () => void;
  onVistaPrevia: () => void;
  hayCitaSeleccionada: boolean;
}
interface BotonGrandeProps {
  icono: LucideIcon;
  etiqueta: string;
  onClick?: () => void;
  activo?: boolean;
  deshabilitado?: boolean;
}
function BotonGrande({
  icono: Icono,
  etiqueta,
  onClick,
  activo = false,
  deshabilitado = false
}: BotonGrandeProps) {
  return <button type="button" onClick={onClick} disabled={deshabilitado} aria-pressed={activo || undefined} className={['flex w-[68px] flex-col items-center gap-1 rounded-[3px] border px-1 pb-1 pt-1.5 text-center text-[11px] leading-tight transition-colors duration-150 ease-out', deshabilitado ? 'cursor-not-allowed border-transparent text-navy-900/35' : activo ? 'border-amber-deep/60 bg-amber-soft text-navy-900 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]' : 'border-transparent text-navy-900 hover:border-sky-400 hover:bg-sky-100/70'].join(' ')}>
      <Icono className={['h-6 w-6', deshabilitado ? 'text-navy-900/30' : activo ? 'text-amber-deep' : 'text-navy-700'].join(' ')} strokeWidth={1.6} />
      <span className="w-full break-words">{etiqueta}</span>
    </button>;
}
function Grupo({
  titulo,
  children



}: {titulo: string;children: React.ReactNode;}) {
  return <div className="flex h-full flex-col justify-between border-r border-sky-400/70 px-2 pb-0.5">
      <div className="flex items-start gap-0.5">{children}</div>
      <div className="pt-0.5 text-center text-2xs text-navy-800/70">{titulo}</div>
    </div>;
}
export function Ribbon({
  pestana,
  onPestanaChange,
  vista,
  onVistaChange,
  onAbrir,
  onNuevo,
  onEliminar,
  onActualizar,
  onHoy,
  onVistaPrevia,
  hayCitaSeleccionada
}: RibbonProps) {
  const [configuracionAbierta, setConfiguracionAbierta] = useState(false);
  const pestanas: {
    id: PestanaRibbon;
    nombre: string;
  }[] = [{
    id: 'inicio',
    nombre: 'Inicio'
  }, {
    id: 'impresion',
    nombre: 'Impresión'
  }];
  return <>
      <header className="shrink-0 border-b border-navy-700/40 bg-sky-200">
      <div className="flex items-center justify-between bg-navy-800 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <CalendarCheckIcon className="h-4 w-4 text-amber-accent" strokeWidth={2} />
          <h1 className="text-[13px] font-semibold tracking-wide text-white">
            Agenda parroquial
          </h1>
          
        </div>
        <span className="text-[11px] text-sky-300">
          Parroquia Santa Cruz · Chiquimulilla
        </span>
      </div>

      <div role="tablist" aria-label="Cinta de opciones" className="flex items-end gap-0.5 border-b border-sky-400 bg-navy-700 px-2 pt-1">
        {pestanas.map((p) => {
          const activa = p.id === pestana;
          return <button key={p.id} role="tab" aria-selected={activa} type="button" onClick={() => onPestanaChange(p.id)} className={['rounded-t-[3px] border border-b-0 px-4 py-1 text-[12px] transition-colors duration-150 ease-out', activa ? 'border-sky-400 bg-sky-100 font-semibold text-navy-900' : 'border-transparent text-sky-200 hover:bg-navy-600'].join(' ')}>
              {p.nombre}
            </button>;
        })}
      </div>

      <div className="flex h-[92px] items-stretch bg-gradient-to-b from-sky-100 to-sky-200 px-1 pt-1">
        {pestana === 'inicio' ? <>
            <Grupo titulo="Acciones">
              <BotonGrande icono={FolderOpenIcon} etiqueta="Abrir" onClick={onAbrir} deshabilitado={!hayCitaSeleccionada} />
              <BotonGrande icono={CalendarPlusIcon} etiqueta="Nuevo" onClick={onNuevo} />
              <BotonGrande icono={Trash2Icon} etiqueta="Eliminar" onClick={onEliminar} deshabilitado={!hayCitaSeleccionada} />
              <BotonGrande icono={RefreshCwIcon} etiqueta="Actualizar" onClick={onActualizar} />
            </Grupo>
            <Grupo titulo="Organizar vista">
              <BotonGrande icono={CalendarDaysIcon} etiqueta="Día" activo={vista === 'dia'} onClick={() => onVistaChange('dia')} />
              <BotonGrande icono={BriefcaseBusinessIcon} etiqueta="Laboral" activo={vista === 'laboral'} onClick={() => onVistaChange('laboral')} />
              <BotonGrande icono={CalendarRangeIcon} etiqueta="Semana" activo={vista === 'semana'} onClick={() => onVistaChange('semana')} />
              <BotonGrande icono={CalendarIcon} etiqueta="Mes" activo={vista === 'mes'} onClick={() => onVistaChange('mes')} />
            </Grupo>
            <Grupo titulo="Ir a">
              <BotonGrande icono={CalendarCheckIcon} etiqueta="Hoy" onClick={onHoy} />
            </Grupo>
          </> : <Grupo titulo="Impresión">
            <BotonGrande icono={PrinterIcon} etiqueta="Imprimir" onClick={() => window.print()} />
            <BotonGrande icono={FileSearchIcon} etiqueta="Vista previa" onClick={onVistaPrevia} />
            <BotonGrande icono={SettingsIcon} etiqueta="Configuración de página" onClick={() => setConfiguracionAbierta(true)} />
          </Grupo>}
      </div>
      </header>

      {configuracionAbierta && <PageSetupDialog vista={vista} onCerrar={() => setConfiguracionAbierta(false)} />}
    </>;
}