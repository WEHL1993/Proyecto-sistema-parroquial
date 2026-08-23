import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Appointment } from '../types/agenda';
import { TimeGrid } from './TimeGrid';
import { citasDelDia, formatoHora } from '../utils/agenda';

interface DayViewProps {
  fecha: Date;
  citas: Appointment[];
  citaSeleccionadaId: string | null;
  onSeleccionarCita: (cita: Appointment) => void;
  onAbrirCita: (cita: Appointment) => void;
  slotSeleccionado: Date | null;
  onSeleccionarSlot: (fecha: Date) => void;
  onSlotVacio: (fecha: Date) => void;
  onCitaAnterior: () => void;
  onCitaSiguiente: () => void;
  citaAnterior: Appointment | null;
  citaSiguiente: Appointment | null;
}

function NavegadorCita({
  direccion,
  cita,
  onClick




}: {direccion: 'anterior' | 'siguiente';cita: Appointment | null;onClick: () => void;}) {
  const Icono = direccion === 'anterior' ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!cita}
      className={[
      'flex w-[104px] shrink-0 flex-col items-center justify-center gap-1.5 border-sky-400 px-2 py-3 text-center transition-colors duration-150 ease-out',
      direccion === 'anterior' ? 'border-r' : 'border-l',
      cita ?
      'bg-sky-50 text-navy-800 hover:bg-sky-100' :
      'cursor-not-allowed bg-sky-50/50 text-navy-900/30'].
      join(' ')}>
      
      <Icono className="h-5 w-5" strokeWidth={1.8} />
      <span className="text-[11px] font-semibold leading-tight">
        Cita {direccion}
      </span>
      {cita &&
      <span className="text-2xs leading-tight text-navy-800/70">
          {formatoHora(new Date(cita.inicio))}
          <br />
          {cita.asunto}
        </span>
      }
    </button>);

}

export function DayView({
  fecha,
  citas,
  citaSeleccionadaId,
  onSeleccionarCita,
  onAbrirCita,
  slotSeleccionado,
  onSeleccionarSlot,
  onSlotVacio,
  onCitaAnterior,
  onCitaSiguiente,
  citaAnterior,
  citaSiguiente
}: DayViewProps) {
  const delDia = citasDelDia(citas, fecha);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1">
        <NavegadorCita direccion="anterior" cita={citaAnterior} onClick={onCitaAnterior} />
        <div className="min-w-0 flex-1">
          <TimeGrid
            dias={[fecha]}
            citas={citas}
            citaSeleccionadaId={citaSeleccionadaId}
            onSeleccionarCita={onSeleccionarCita}
            onAbrirCita={onAbrirCita}
            slotSeleccionado={slotSeleccionado}
            onSeleccionarSlot={onSeleccionarSlot}
            onSlotVacio={onSlotVacio} />
          
        </div>
        <NavegadorCita direccion="siguiente" cita={citaSiguiente} onClick={onCitaSiguiente} />
      </div>
      <div className="shrink-0 border-t border-sky-400 bg-sky-50 px-3 py-1 text-[11px] text-navy-800/80">
        {delDia.length === 0 ?
        'Sin citas programadas para este día. Haga clic en una franja horaria para seleccionarla, o doble clic para crear una cita directamente.' :
        `${delDia.length} cita${delDia.length === 1 ? '' : 's'} programada${
        delDia.length === 1 ? '' : 's'}`
        }
      </div>
    </div>);

}