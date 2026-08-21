import React, { useMemo } from 'react';
import { PrinterIcon, XIcon } from 'lucide-react';
import { Appointment, VistaAgenda } from '../types/agenda';
import {
  DIAS_LARGOS,
  ESTILO_PRIORIDAD,
  MESES,
  citasDelDia,
  formatoFechaLarga,
  formatoHora,
  inicioDeSemana,
  mismaFecha,
  sumarDias } from
'../utils/agenda';

interface PrintPreviewDialogProps {
  vista: VistaAgenda;
  fecha: Date;
  citas: Appointment[];
  onCerrar: () => void;
}

const ETIQUETA_VISTA: Record<VistaAgenda, string> = {
  dia: 'Vista Día',
  laboral: 'Vista Semana laboral',
  semana: 'Vista Semana',
  mes: 'Vista Mes'
};

function ListaDeCitas({ citas }: {citas: Appointment[];}) {
  const activas = citas.filter((c) => !c.cancelada);
  if (activas.length === 0) {
    return <p className="text-[10px] italic text-navy-800/50">Sin citas programadas.</p>;
  }
  return (
    <ul className="space-y-0.5">
      {activas.map((c) =>
      <li key={c.id} className="flex gap-2 text-[10.5px] text-navy-900">
          <span className="w-[92px] shrink-0 font-semibold">
            {formatoHora(new Date(c.inicio))}–{formatoHora(new Date(c.fin))}
          </span>
          <span className="min-w-0 flex-1 truncate">
            {c.asunto} <span className="text-navy-800/60">— {c.lugar}</span>
          </span>
          <span
          className={`shrink-0 text-[9px] font-semibold uppercase ${ESTILO_PRIORIDAD[c.prioridad].texto}`}>
          
            {c.prioridad}
          </span>
        </li>
      )}
    </ul>);

}

function BloqueDia({ dia, citas }: {dia: Date;citas: Appointment[];}) {
  return (
    <div className="mb-3 break-inside-avoid">
      <h3 className="mb-1 border-b border-navy-300 pb-0.5 text-[12px] font-bold capitalize text-navy-900">
        {DIAS_LARGOS[(dia.getDay() + 6) % 7]} {dia.getDate()} de {MESES[dia.getMonth()]}
      </h3>
      <ListaDeCitas citas={citasDelDia(citas, dia)} />
    </div>);

}

function CuadriculaMes({ fecha, citas }: {fecha: Date;citas: Appointment[];}) {
  const primerDelMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  const inicio = inicioDeSemana(primerDelMes);
  const semanas = Array.from({ length: 6 }, (_, s) =>
  Array.from({ length: 7 }, (_, d) => sumarDias(inicio, s * 7 + d))
  );

  return (
    <div className="border border-navy-300">
      <div className="grid grid-cols-7 border-b border-navy-300 bg-sky-50">
        {DIAS_LARGOS.map((d) =>
        <div
          key={d}
          className="border-r border-navy-300 px-1 py-0.5 text-center text-[9px] font-semibold capitalize text-navy-800 last:border-r-0">
          
            {d.slice(0, 3)}
          </div>
        )}
      </div>
      {semanas.map((semana, i) =>
      <div key={i} className="grid grid-cols-7 border-b border-navy-200 last:border-b-0">
          {semana.map((dia) => {
          const delMes = dia.getMonth() === fecha.getMonth();
          const delDia = citasDelDia(citas, dia).filter((c) => !c.cancelada);
          const visibles = delDia.slice(0, 2);
          return (
            <div
              key={dia.toISOString()}
              className={[
              'min-h-[52px] border-r border-navy-200 px-1 py-0.5 last:border-r-0',
              delMes ? 'bg-sky-100' : 'bg-sky-50/60'].
              join(' ')}>
              
                <div
                className={['text-[9px] font-semibold', delMes ? 'text-navy-900' : 'text-navy-900/35'].join(
                  ' '
                )}>
                
                  {dia.getDate()}
                </div>
                {visibles.map((c) =>
              <div key={c.id} className="truncate text-[8px] leading-tight text-navy-800">
                    {formatoHora(new Date(c.inicio))} {c.asunto}
                  </div>
              )}
                {delDia.length > visibles.length &&
              <div className="text-[8px] leading-tight text-navy-600">
                    +{delDia.length - visibles.length} más
                  </div>
              }
              </div>);

        })}
        </div>
      )}
    </div>);

}

export function PrintPreviewDialog({ vista, fecha, citas, onCerrar }: PrintPreviewDialogProps) {
  const diasSemana = useMemo(() => {
    const lunes = inicioDeSemana(fecha);
    const total = vista === 'laboral' ? 5 : 7;
    return Array.from({ length: total }, (_, i) => sumarDias(lunes, i));
  }, [fecha, vista]);

  const tituloRango =
  vista === 'mes' ?
  `${MESES[fecha.getMonth()]} ${fecha.getFullYear()}` :
  vista === 'dia' ?
  formatoFechaLarga(fecha) :
  `${diasSemana[0].getDate()} – ${diasSemana[diasSemana.length - 1].getDate()} de ${
  MESES[diasSemana[diasSemana.length - 1].getMonth()]} de ${
  diasSemana[diasSemana.length - 1].getFullYear()}`;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-navy-900/60"
      role="dialog"
      aria-modal="true"
      aria-label="Vista previa de impresión">
      
      <div className="flex shrink-0 items-center justify-between border-b border-navy-700 bg-navy-800 px-4 py-2">
        <div className="flex items-center gap-3">
          <h2 className="text-[13px] font-semibold text-white">Vista previa de impresión</h2>
          <span className="rounded-[2px] border border-sky-400/50 bg-navy-700 px-2 py-[1px] text-[11px] text-sky-200">
            {ETIQUETA_VISTA[vista]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-[2px] border border-sky-400/40 bg-navy-700 px-3 py-1 text-[12px] text-white transition-colors duration-150 ease-out hover:bg-navy-600">
            
            <PrinterIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
            Imprimir
          </button>
          <button
            type="button"
            onClick={onCerrar}
            className="flex items-center gap-1.5 rounded-[2px] border border-sky-400/40 bg-sky-100 px-3 py-1 text-[12px] font-semibold text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-100">
            
            <XIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
            Cerrar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto w-full max-w-[680px] rounded-[2px] bg-sky-100 p-8 shadow-dialog">
          <div className="mb-4 border-b-2 border-navy-800 pb-2">
            <p className="text-[11px] text-navy-800/70">Office Eclesial — Agenda parroquial</p>
            <h1 className="text-[20px] font-bold capitalize text-navy-900">{tituloRango}</h1>
          </div>

          {vista === 'dia' && <ListaDeCitas citas={citasDelDia(citas, fecha)} />}

          {(vista === 'laboral' || vista === 'semana') &&
          <div>
              {diasSemana.map((dia) =>
            <BloqueDia key={dia.toISOString()} dia={dia} citas={citas} />
            )}
            </div>
          }

          {vista === 'mes' && <CuadriculaMes fecha={fecha} citas={citas} />}
        </div>
      </div>
    </div>);

}