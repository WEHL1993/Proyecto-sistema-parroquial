import React, { useMemo } from 'react';
import { Appointment } from '../types/agenda';
import {
  ALTO_HORA,
  DIAS_LARGOS,
  ESTILO_PRIORIDAD,
  HORAS,
  HORA_FIN,
  HORA_INICIO,
  citasDelDia,
  distribuirCarriles,
  formatoHora,
  minutosDesdeInicio,
  mismaFecha } from
'../utils/agenda';

interface TimeGridProps {
  dias: Date[];
  citas: Appointment[];
  citaSeleccionadaId: string | null;
  onSeleccionarCita: (cita: Appointment) => void;
  onAbrirCita: (cita: Appointment) => void;
  slotSeleccionado: Date | null;
  onSeleccionarSlot: (fecha: Date) => void;
  onSlotVacio: (fecha: Date) => void;
  mostrarEncabezado?: boolean;
}

export function TimeGrid({
  dias,
  citas,
  citaSeleccionadaId,
  onSeleccionarCita,
  onAbrirCita,
  slotSeleccionado,
  onSeleccionarSlot,
  onSlotVacio,
  mostrarEncabezado = true
}: TimeGridProps) {
  const hoy = new Date();
  const altoTotal = (HORA_FIN - HORA_INICIO) * ALTO_HORA;
  const minutosAhora = minutosDesdeInicio(hoy);
  const mostrarLineaAhora =
  minutosAhora >= 0 && minutosAhora <= (HORA_FIN - HORA_INICIO) * 60;

  const porDia = useMemo(
    () => dias.map((d) => distribuirCarriles(citasDelDia(citas, d))),
    [dias, citas]
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-sky-100">
      {mostrarEncabezado &&
      <div className="flex shrink-0 border-b border-sky-400 bg-gradient-to-b from-sky-100 to-sky-200">
          <div className="w-[58px] shrink-0 border-r border-sky-400" />
          {dias.map((dia) => {
          const esHoy = mismaFecha(dia, hoy);
          return (
            <div
              key={dia.toISOString()}
              className={[
              'flex-1 border-r border-sky-400 px-2 py-1 text-center',
              esHoy ? 'bg-amber-soft' : ''].
              join(' ')}>
              
                <div className="text-[11px] capitalize text-navy-800/80">
                  {DIAS_LARGOS[(dia.getDay() + 6) % 7]}
                </div>
                <div
                className={[
                'text-[15px] font-semibold',
                esHoy ? 'text-amber-deep' : 'text-navy-900'].
                join(' ')}>
                
                  {dia.getDate()}
                </div>
              </div>);

        })}
        </div>
      }

      <div className="flex-1 overflow-y-auto">
        <div className="flex" style={{ height: altoTotal }}>
          <div className="w-[58px] shrink-0 border-r border-sky-400 bg-sky-50">
            {HORAS.slice(0, -1).map((h) =>
            <div
              key={h}
              style={{ height: ALTO_HORA }}
              className="relative border-b border-sky-200 pr-1.5 text-right">
              
                <span className="text-[11px] font-semibold text-navy-800">
                  {String(h).padStart(2, '0')}
                </span>
                <span className="text-2xs text-navy-800/60">:00</span>
              </div>
            )}
          </div>

          {dias.map((dia, indiceDia) => {
            const esHoy = mismaFecha(dia, hoy);
            return (
              <div
                key={dia.toISOString()}
                className="relative flex-1 border-r border-sky-300">
                
                {HORAS.slice(0, -1).map((h) => {
                  const esSlotSeleccionado =
                  slotSeleccionado !== null &&
                  mismaFecha(dia, slotSeleccionado) &&
                  slotSeleccionado.getHours() === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      aria-label={`Seleccionar franja el ${dia.getDate()} a las ${h}:00`}
                      aria-pressed={esSlotSeleccionado || undefined}
                      onClick={() => {
                        const f = new Date(dia);
                        f.setHours(h, 0, 0, 0);
                        onSeleccionarSlot(f);
                      }}
                      onDoubleClick={() => {
                        const f = new Date(dia);
                        f.setHours(h, 0, 0, 0);
                        onSlotVacio(f);
                      }}
                      style={{ height: ALTO_HORA }}
                      className={[
                      'block w-full border-b border-sky-200 transition-colors duration-150 ease-out hover:bg-sky-50',
                      esSlotSeleccionado ?
                      'bg-amber-soft ring-2 ring-inset ring-amber-accent' :
                      esHoy ?
                      'bg-[#FFFBF3]' :
                      'bg-sky-100'].
                      join(' ')} />);


                })}

                {esHoy && mostrarLineaAhora &&
                <div
                  className="pointer-events-none absolute left-0 right-0 z-20 flex items-center"
                  style={{ top: minutosAhora / 60 * ALTO_HORA }}
                  aria-hidden="true">
                  
                    <span className="h-[7px] w-[7px] -translate-x-[3px] rounded-full bg-amber-accent" />
                    <span className="h-[2px] flex-1 bg-amber-accent" />
                  </div>
                }

                {porDia[indiceDia].map(({ cita, carril, carriles }) => {
                  const inicio = new Date(cita.inicio);
                  const fin = new Date(cita.fin);
                  const top = minutosDesdeInicio(inicio) / 60 * ALTO_HORA;
                  const alto = Math.max(
                    24,
                    (+fin - +inicio) / 3600000 * ALTO_HORA - 2
                  );
                  const estilo = ESTILO_PRIORIDAD[cita.prioridad];
                  const seleccionada = cita.id === citaSeleccionadaId;
                  return (
                    <button
                      key={cita.id}
                      type="button"
                      onClick={() => onSeleccionarCita(cita)}
                      onDoubleClick={() => onAbrirCita(cita)}
                      style={{
                        top,
                        height: alto,
                        left: `calc(${carril / carriles * 100}% + 2px)`,
                        width: `calc(${100 / carriles}% - 5px)`
                      }}
                      className={[
                      'absolute z-10 flex overflow-hidden rounded-[2px] border text-left transition-colors duration-150 ease-out',
                      estilo.fondo,
                      estilo.borde,
                      seleccionada ?
                      'ring-2 ring-amber-accent' :
                      'hover:brightness-[0.97]',
                      cita.cancelada ? 'opacity-60' : ''].
                      join(' ')}>
                      
                      <span className={`w-[4px] shrink-0 ${estilo.barra}`} />
                      <span className="min-w-0 flex-1 px-1.5 py-1">
                        <span
                          className={[
                          'block truncate text-[11px] font-semibold',
                          estilo.texto,
                          cita.cancelada ? 'line-through' : ''].
                          join(' ')}>
                          
                          {cita.asunto}
                        </span>
                        <span className="block truncate text-2xs text-navy-900/70">
                          {formatoHora(inicio)}–{formatoHora(fin)}
                          {alto > 44 ? ` · ${cita.lugar}` : ''}
                        </span>
                      </span>
                    </button>);

                })}
              </div>);

          })}
        </div>
      </div>
    </div>);

}