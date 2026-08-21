import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Appointment, VistaAgenda } from '../types/agenda';
import {
  DIAS_CORTOS,
  MESES,
  inicioDeSemana,
  mismaFecha,
  sumarDias,
  sumarMeses } from
'../utils/agenda';

interface MiniCalendarProps {
  fechaSeleccionada: Date;
  vista: VistaAgenda;
  onSeleccionar: (fecha: Date) => void;
  citas: Appointment[];
}

function enRangoDeVista(dia: Date, vista: VistaAgenda, fechaSel: Date): boolean {
  if (vista === 'dia') return mismaFecha(dia, fechaSel);

  if (vista === 'mes') {
    return (
      dia.getMonth() === fechaSel.getMonth() && dia.getFullYear() === fechaSel.getFullYear());

  }

  const lunes = inicioDeSemana(fechaSel);
  const limiteDias = vista === 'laboral' ? 4 : 6;
  const fin = sumarDias(lunes, limiteDias);
  fin.setHours(23, 59, 59, 999);
  return dia >= lunes && dia <= fin;
}

export function MiniCalendar({
  fechaSeleccionada,
  vista,
  onSeleccionar,
  citas
}: MiniCalendarProps) {
  const [mesVisible, setMesVisible] = useState(
    () => new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), 1)
  );
  const hoy = new Date();

  useEffect(() => {
    setMesVisible(new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth()]);

  const primerDiaCuadricula = inicioDeSemana(mesVisible);
  const dias = Array.from({ length: 42 }, (_, i) => sumarDias(primerDiaCuadricula, i));
  const diasConCita = new Set(
    citas.
    filter((c) => !c.cancelada).
    map((c) => new Date(c.inicio).toDateString())
  );
  const enRangoLista = dias.map((d) => enRangoDeVista(d, vista, fechaSeleccionada));

  return (
    <section className="border-b border-sky-400 bg-white px-2 py-2" aria-label="Calendario mensual">
      <div className="mb-1 flex items-center justify-between">
        <button
          type="button"
          aria-label="Mes anterior"
          onClick={() => setMesVisible(sumarMeses(mesVisible, -1))}
          className="rounded-[2px] p-0.5 text-navy-700 transition-colors duration-150 ease-out hover:bg-sky-100">
          
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="text-[12px] font-semibold capitalize text-navy-900">
          {MESES[mesVisible.getMonth()]} {mesVisible.getFullYear()}
        </span>
        <button
          type="button"
          aria-label="Mes siguiente"
          onClick={() => setMesVisible(sumarMeses(mesVisible, 1))}
          className="rounded-[2px] p-0.5 text-navy-700 transition-colors duration-150 ease-out hover:bg-sky-100">
          
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-2xs font-semibold text-navy-800/70">
        {DIAS_CORTOS.map((d, i) =>
        <span key={i} className="py-0.5">
            {d}
          </span>
        )}
      </div>

      <div className="grid grid-cols-7">
        {dias.map((dia, i) => {
          const esDelMes = dia.getMonth() === mesVisible.getMonth();
          const seleccionado = mismaFecha(dia, fechaSeleccionada);
          const esHoy = mismaFecha(dia, hoy);
          const tieneCita = diasConCita.has(dia.toDateString());
          const enRango = enRangoLista[i] && !seleccionado;
          const inicioTira = enRango && (i % 7 === 0 || !enRangoLista[i - 1]);
          const finTira = enRango && (i % 7 === 6 || !enRangoLista[i + 1]);

          return (
            <button
              key={dia.toISOString()}
              type="button"
              onClick={() => onSeleccionar(dia)}
              className={[
              'relative h-[22px] text-[11px] transition-colors duration-150 ease-out',
              seleccionado ?
              'rounded-full bg-amber-accent font-semibold text-white' :
              enRango ?
              [
              'bg-amber-soft text-navy-900',
              inicioTira ? 'rounded-l-full' : '',
              finTira ? 'rounded-r-full' : ''].
              join(' ') :
              esHoy ?
              'rounded-full border border-amber-accent font-semibold text-navy-900' :
              esDelMes ?
              'text-navy-900 hover:bg-sky-100' :
              'text-navy-900/30 hover:bg-sky-50'].
              join(' ')}>
              
              {dia.getDate()}
              {tieneCita && !seleccionado &&
              <span className="absolute bottom-[1px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-navy-600" />
              }
            </button>);

        })}
      </div>
    </section>);

}