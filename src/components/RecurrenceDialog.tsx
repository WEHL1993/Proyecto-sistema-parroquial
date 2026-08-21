import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { DiaSemana, FinPeriodicidad, PeriodicidadConfig, TipoPeriodicidad } from '../types/agenda';

interface RecurrenceDialogProps {
  valorInicial: PeriodicidadConfig;
  tienePeriodicidad: boolean;
  onAceptar: (config: PeriodicidadConfig) => void;
  onEliminarPeriodicidad: () => void;
  onCancelar: () => void;
}

const DIAS: {id: DiaSemana;etiqueta: string;}[] = [
{ id: 'domingo', etiqueta: 'Domingo' },
{ id: 'lunes', etiqueta: 'Lunes' },
{ id: 'martes', etiqueta: 'Martes' },
{ id: 'miercoles', etiqueta: 'Miércoles' },
{ id: 'jueves', etiqueta: 'Jueves' },
{ id: 'viernes', etiqueta: 'Viernes' },
{ id: 'sabado', etiqueta: 'Sábado' }];


const TIPOS: {id: TipoPeriodicidad;etiqueta: string;}[] = [
{ id: 'diaria', etiqueta: 'Diaria' },
{ id: 'semanal', etiqueta: 'Semanal' },
{ id: 'mensual', etiqueta: 'Mensual' },
{ id: 'anual', etiqueta: 'Anual' }];


const campo =
'rounded-[2px] border border-navy-600/40 bg-sky-100 px-2 py-1 text-[12px] text-navy-900 outline-none transition-colors duration-150 ease-out focus:border-amber-accent focus:ring-1 focus:ring-amber-accent';

function Grupo({ titulo, children }: {titulo: string;children: React.ReactNode;}) {
  return (
    <div className="relative rounded-[2px] border border-navy-300 px-3 pb-3 pt-4">
      <span className="absolute -top-2 left-2 bg-sky-100 px-1 text-[11px] font-semibold text-navy-700">
        {titulo}
      </span>
      {children}
    </div>);

}

function Radio({
  seleccionado,
  onClick,
  children




}: {seleccionado: boolean;onClick: () => void;children: React.ReactNode;}) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-[12px] text-navy-900">
      <input type="radio" checked={seleccionado} onChange={onClick} className="h-3.5 w-3.5" />
      {children}
    </label>);

}

export function RecurrenceDialog({
  valorInicial,
  tienePeriodicidad,
  onAceptar,
  onEliminarPeriodicidad,
  onCancelar
}: RecurrenceDialogProps) {
  const [desde, setDesde] = useState(valorInicial.desde);
  const [hasta, setHasta] = useState(valorInicial.hasta);
  const [tipo, setTipo] = useState<TipoPeriodicidad>(valorInicial.tipo);
  const [cadaSemanas, setCadaSemanas] = useState(valorInicial.cadaSemanas);
  const [dias, setDias] = useState<DiaSemana[]>(valorInicial.dias);
  const [inicio, setInicio] = useState(valorInicial.inicio);
  const [finTipo, setFinTipo] = useState<FinPeriodicidad>(valorInicial.finTipo);
  const [ocurrencias, setOcurrencias] = useState(valorInicial.ocurrencias);
  const [hastaFecha, setHastaFecha] = useState(valorInicial.hastaFecha);

  function toggleDia(d: DiaSemana) {
    setDias((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  }

  function aceptar(e: React.FormEvent) {
    e.preventDefault();
    onAceptar({
      desde,
      hasta,
      tipo,
      cadaSemanas,
      dias,
      inicio,
      finTipo,
      ocurrencias,
      hastaFecha
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Periodicidad de cita">
      
      <motion.form
        onSubmit={aceptar}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[560px] overflow-hidden rounded-[3px] border border-navy-300 bg-sky-100 shadow-dialog">
        
        <div className="flex items-center justify-between border-b border-navy-200 bg-sky-100 px-3 py-2">
          <h2 className="text-[13px] font-semibold text-navy-900">Periodicidad de Cita</h2>
          <button
            type="button"
            onClick={onCancelar}
            aria-label="Cerrar"
            className="flex h-6 w-6 items-center justify-center rounded-[2px] text-navy-700 transition-colors duration-150 ease-out hover:bg-sky-100">
            
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-4 py-4">
          <Grupo titulo="Hora">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-[12px] text-navy-900">
                Desde:
                <input
                  type="time"
                  step={1}
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className={campo} />
                
              </label>
              <label className="flex items-center gap-2 text-[12px] text-navy-900">
                Hasta:
                <input
                  type="time"
                  step={1}
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className={campo} />
                
              </label>
            </div>
          </Grupo>

          <Grupo titulo="Periodicidad">
            <div className="flex gap-5">
              <div className="flex shrink-0 flex-col gap-2">
                {TIPOS.map((t) =>
                <Radio key={t.id} seleccionado={tipo === t.id} onClick={() => setTipo(t.id)}>
                    {t.etiqueta}
                  </Radio>
                )}
              </div>

              <div className="min-w-0 flex-1 border-l border-navy-200 pl-4">
                {tipo === 'semanal' ?
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[12px] text-navy-900">
                      Ocurre cada
                      <input
                      type="number"
                      min={1}
                      value={cadaSemanas}
                      onChange={(e) => setCadaSemanas(Math.max(1, Number(e.target.value)))}
                      className={`${campo} w-[48px] text-center`} />
                    
                      semana(s) para:
                    </div>
                    <div className="grid grid-cols-4 gap-x-4 gap-y-1">
                      {DIAS.map((d) =>
                    <label
                      key={d.id}
                      className="flex cursor-pointer items-center gap-1.5 text-[12px] text-navy-900">
                      
                          <input
                        type="checkbox"
                        checked={dias.includes(d.id)}
                        onChange={() => toggleDia(d.id)}
                        className="h-3.5 w-3.5" />
                      
                          {d.etiqueta}
                        </label>
                    )}
                    </div>
                  </div> :

                <p className="text-[12px] text-navy-800/80">
                    {tipo === 'diaria' && 'Se repite todos los días.'}
                    {tipo === 'mensual' && 'Se repite el mismo día cada mes.'}
                    {tipo === 'anual' && 'Se repite el mismo día cada año.'}
                  </p>
                }
              </div>
            </div>
          </Grupo>

          <Grupo titulo="Rangos">
            <div className="flex items-start gap-6">
              <label className="flex items-center gap-2 text-[12px] text-navy-900">
                Inicio:
                <input
                  type="date"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  className={campo} />
                
              </label>

              <div className="flex flex-1 flex-col gap-2">
                <Radio seleccionado={finTipo === 'sinFin'} onClick={() => setFinTipo('sinFin')}>
                  Sin finalización
                </Radio>
                <div className="flex items-center gap-1.5">
                  <Radio
                    seleccionado={finTipo === 'ocurrencias'}
                    onClick={() => setFinTipo('ocurrencias')}>
                    
                    Fin luego de
                  </Radio>
                  <input
                    type="number"
                    min={1}
                    value={ocurrencias}
                    onChange={(e) => {
                      setFinTipo('ocurrencias');
                      setOcurrencias(Math.max(1, Number(e.target.value)));
                    }}
                    className={`${campo} w-[52px] text-center`} />
                  
                  <span className="text-[12px] text-navy-900">ocurrencias</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Radio
                    seleccionado={finTipo === 'hastaFecha'}
                    onClick={() => setFinTipo('hastaFecha')}>
                    
                    Hasta fecha:
                  </Radio>
                  <input
                    type="date"
                    value={hastaFecha}
                    onChange={(e) => {
                      setFinTipo('hastaFecha');
                      setHastaFecha(e.target.value);
                    }}
                    className={campo} />
                  
                </div>
              </div>
            </div>
          </Grupo>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-sky-300 bg-sky-50 px-4 py-2.5">
          <button
            type="button"
            onClick={onEliminarPeriodicidad}
            disabled={!tienePeriodicidad}
            className="rounded-[2px] border border-navy-600/40 bg-sky-100 px-3 py-1 text-[12px] text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-100 disabled:cursor-not-allowed disabled:text-navy-900/30 disabled:hover:bg-sky-100">
            
            Eliminar Periodicidad
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancelar}
              className="min-w-[88px] rounded-[2px] border border-navy-600/50 bg-sky-100 px-3 py-1 text-[12px] text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-100">
              
              Cancelar
            </button>
            <button
              type="submit"
              className="min-w-[88px] rounded-[2px] border border-navy-900 bg-navy-700 px-3 py-1 text-[12px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-navy-600">
              
              Aceptar
            </button>
          </div>
        </div>
      </motion.form>
    </div>);

}