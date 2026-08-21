import React from 'react';
import { Appointment } from '../types/agenda';
import {
  DIAS_LARGOS,
  ESTILO_PRIORIDAD,
  citasDelDia,
  formatoHora,
  inicioDeSemana,
  mismaFecha,
  sumarDias } from
'../utils/agenda';

interface MonthViewProps {
  fecha: Date;
  citas: Appointment[];
  citaSeleccionadaId: string | null;
  onSeleccionarCita: (cita: Appointment) => void;
  onAbrirCita: (cita: Appointment) => void;
  slotSeleccionado: Date | null;
  onSeleccionarSlot: (fecha: Date) => void;
  onSeleccionarDia: (fecha: Date) => void;
  onSlotVacio: (fecha: Date) => void;
}

export function MonthView({
  fecha,
  citas,
  citaSeleccionadaId,
  onSeleccionarCita,
  onAbrirCita,
  slotSeleccionado,
  onSeleccionarSlot,
  onSeleccionarDia,
  onSlotVacio
}: MonthViewProps) {
  const hoy = new Date();
  const primerDelMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  const inicio = inicioDeSemana(primerDelMes);
  const semanas = Array.from({ length: 6 }, (_, s) =>
  Array.from({ length: 7 }, (_, d) => sumarDias(inicio, s * 7 + d))
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="grid shrink-0 grid-cols-7 border-b border-sky-400 bg-gradient-to-b from-sky-100 to-sky-200">
        {DIAS_LARGOS.map((d) =>
        <div
          key={d}
          className="border-r border-sky-400 px-2 py-1 text-center text-[11px] font-semibold capitalize text-navy-800">
          
            {d}
          </div>
        )}
      </div>

      <div className="grid flex-1 grid-rows-6 overflow-y-auto">
        {semanas.map((semana, i) =>
        <div key={i} className="grid grid-cols-7 border-b border-sky-300">
            {semana.map((dia) => {
            const delMes = dia.getMonth() === fecha.getMonth();
            const esHoy = mismaFecha(dia, hoy);
            const seleccionado = mismaFecha(dia, fecha);
            const esSlotSeleccionado = slotSeleccionado !== null && mismaFecha(dia, slotSeleccionado);
            const delDia = citasDelDia(citas, dia);
            const visibles = delDia.slice(0, 3);
            return (
              <div
                key={dia.toISOString()}
                onClick={() => {
                  const f = new Date(dia);
                  f.setHours(9, 0, 0, 0);
                  onSeleccionarSlot(f);
                }}
                onDoubleClick={() => {
                  const f = new Date(dia);
                  f.setHours(9, 0, 0, 0);
                  onSlotVacio(f);
                }}
                className={[
                'flex min-h-[92px] flex-col border-r border-sky-300 px-1 pb-1 pt-0.5',
                delMes ? 'bg-white' : 'bg-sky-50/70',
                esSlotSeleccionado ?
                'ring-2 ring-inset ring-amber-accent bg-amber-soft/50' :
                seleccionado ?
                'ring-1 ring-inset ring-amber-accent' :
                ''].
                join(' ')}>
                
                  <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeleccionarDia(dia);
                  }}
                  className={[
                  'mb-0.5 self-end rounded-[2px] px-1 text-[11px] transition-colors duration-150 ease-out',
                  esHoy ?
                  'bg-amber-accent font-semibold text-white' :
                  delMes ?
                  'font-semibold text-navy-900 hover:bg-sky-100' :
                  'text-navy-900/35 hover:bg-sky-100'].
                  join(' ')}>
                  
                    {dia.getDate()}
                  </button>

                  <div className="flex flex-col gap-[2px]">
                    {visibles.map((cita) => {
                    const estilo = ESTILO_PRIORIDAD[cita.prioridad];
                    return (
                      <button
                        key={cita.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeleccionarCita(cita);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onAbrirCita(cita);
                        }}
                        className={[
                        'flex items-center gap-1 overflow-hidden rounded-[2px] border px-1 py-[1px] text-left transition-colors duration-150 ease-out hover:brightness-[0.97]',
                        estilo.fondo,
                        estilo.borde,
                        cita.id === citaSeleccionadaId ? 'ring-1 ring-amber-accent' : '',
                        cita.cancelada ? 'opacity-60' : ''].
                        join(' ')}>
                        
                          <span
                          className={`h-[6px] w-[6px] shrink-0 rounded-full ${estilo.punto}`} />
                        
                          <span className="shrink-0 text-2xs text-navy-900/70">
                            {formatoHora(new Date(cita.inicio))}
                          </span>
                          <span
                          className={[
                          'truncate text-2xs font-semibold',
                          estilo.texto,
                          cita.cancelada ? 'line-through' : ''].
                          join(' ')}>
                          
                            {cita.asunto}
                          </span>
                        </button>);

                  })}
                    {delDia.length > visibles.length &&
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeleccionarDia(dia);
                    }}
                    className="px-1 text-left text-2xs font-semibold text-navy-600 hover:underline">
                    
                        +{delDia.length - visibles.length} más…
                      </button>
                  }
                  </div>
                </div>);

          })}
          </div>
        )}
      </div>
    </div>);

}