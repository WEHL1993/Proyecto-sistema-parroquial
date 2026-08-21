import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XIcon,
  SaveIcon,
  Trash2Icon,
  RefreshCwIcon,
  CalendarDaysIcon,
  CalendarIcon,
  AlertCircleIcon,
  BellIcon,
  MinusIcon,
  SquareIcon } from
'lucide-react';
import { Appointment, DiaSemana, PeriodicidadConfig, Prioridad, Recordatorio } from '../types/agenda';
import { RecurrenceDialog } from './RecurrenceDialog';

interface CalendarioOpcion {
  id: string;
  nombre: string;
}

interface AppointmentDialogProps {
  cita: Appointment | null;
  inicioPorDefecto: Date;
  calendarios: CalendarioOpcion[];
  onGuardar: (cita: Appointment) => void;
  onEliminar: () => void;
  onCerrar: () => void;
}

const PRIORIDADES: Prioridad[] = ['Baja', 'Media', 'Alta'];
const RECORDATORIOS: Recordatorio[] = [
'Sin recordatorio',
'15 min',
'30 min',
'1 hora',
'1 día'];

const ETIQUETA_RECORDATORIO: Record<Recordatorio, string> = {
  'Sin recordatorio': 'None',
  '15 min': '15 min antes',
  '30 min': '30 min antes',
  '1 hora': '1 hora antes',
  '1 día': '1 día antes'
};
const DIAS_SEMANA_ORDEN: DiaSemana[] = [
'domingo',
'lunes',
'martes',
'miercoles',
'jueves',
'viernes',
'sabado'];


function aFecha(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function aHora(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}
function combinar(fecha: string, hora: string): Date {
  const [y, m, d] = fecha.split('-').map(Number);
  const [hh, mm] = hora.split(':').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}
function diaSemanaDeFecha(fechaStr: string): DiaSemana {
  const d = new Date(`${fechaStr}T00:00:00`);
  return DIAS_SEMANA_ORDEN[d.getDay()];
}

function GrupoRibbon({ titulo, children }: {titulo: string;children: React.ReactNode;}) {
  return (
    <div className="flex h-full flex-col justify-between border-r border-sky-300 px-2">
      <div className="flex items-center gap-1.5">{children}</div>
      <div className="pb-0.5 pt-1 text-center text-2xs text-navy-800/60">{titulo}</div>
    </div>);

}

function BotonGrandeRibbon({
  icono: Icono,
  etiqueta,
  onClick,
  deshabilitado,
  activo






}: {icono: typeof SaveIcon;etiqueta: string;onClick?: () => void;deshabilitado?: boolean;activo?: boolean;}) {
  return (
    <button
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
      disabled={deshabilitado}
      className="flex w-[70px] flex-col items-center justify-center gap-1 rounded-[3px] px-1 py-1 text-center text-[11px] leading-tight text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-100/70 disabled:cursor-not-allowed disabled:text-navy-900/30 disabled:hover:bg-transparent">
      
      <Icono
        className={['h-7 w-7', deshabilitado ? 'text-navy-900/25' : activo ? 'text-amber-deep' : 'text-blue-700'].join(' ')}
        strokeWidth={1.5} />
      
      <span className="w-full break-words">{etiqueta}</span>
    </button>);

}

function BotonPequenoRibbon({
  icono: Icono,
  etiqueta,
  onClick,
  deshabilitado,
  tono






}: {icono: typeof SaveIcon;etiqueta: string;onClick?: () => void;deshabilitado?: boolean;tono?: string;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deshabilitado}
      className="flex items-center gap-1.5 rounded-[2px] px-1.5 py-0.5 text-left text-[11px] text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-100/70 disabled:cursor-not-allowed disabled:text-navy-900/30 disabled:hover:bg-transparent">
      
      <Icono className={`h-3.5 w-3.5 shrink-0 ${deshabilitado ? 'text-navy-900/25' : tono ?? 'text-navy-700'}`} strokeWidth={1.8} />
      {etiqueta}
    </button>);

}

function FilaCampo({ etiqueta, children }: {etiqueta: string;children: React.ReactNode;}) {
  return (
    <div className="flex items-center gap-3">
      <label className="w-[84px] shrink-0 text-[12px] text-navy-900">{etiqueta}</label>
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
    </div>);

}

const campoInput =
'rounded-[2px] border border-navy-600/40 bg-sky-100 px-2 py-1 text-[12px] text-navy-900 outline-none transition-colors duration-150 ease-out focus:border-amber-accent focus:ring-1 focus:ring-amber-accent';
const campoSelectPequeno =
'rounded-[2px] border border-navy-600/30 bg-sky-100 px-1 py-0.5 text-[11px] text-navy-900 outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent';

export function AppointmentDialog({
  cita,
  inicioPorDefecto,
  calendarios,
  onGuardar,
  onEliminar,
  onCerrar
}: AppointmentDialogProps) {
  const esEdicion = cita !== null;
  const inicioBase = cita ? new Date(cita.inicio) : inicioPorDefecto;
  const finBase = cita ? new Date(cita.fin) : new Date(inicioPorDefecto.getTime() + 60 * 60000);

  const [asunto, setAsunto] = useState(cita?.asunto ?? '');
  const [agendaId, setAgendaId] = useState(calendarios[0]?.id ?? '');
  const [fechaInicio, setFechaInicio] = useState(aFecha(inicioBase));
  const [horaInicio, setHoraInicio] = useState(aHora(inicioBase));
  const [fechaFin, setFechaFin] = useState(aFecha(finBase));
  const [horaFin, setHoraFin] = useState(aHora(finBase));
  const [todoDia, setTodoDia] = useState(cita?.todoDia ?? false);
  const [prioridad, setPrioridad] = useState<Prioridad>(cita?.prioridad ?? 'Media');
  const [recordatorio, setRecordatorio] = useState<Recordatorio>(cita?.recordatorio ?? 'Sin recordatorio');
  const [observaciones, setObservaciones] = useState(cita?.observaciones ?? '');
  const [error, setError] = useState<string | null>(null);
  const [periodicidad, setPeriodicidad] = useState<PeriodicidadConfig | null>(cita?.periodicidad ?? null);
  const [periodicidadAbierta, setPeriodicidadAbierta] = useState(false);

  const tituloVentana = `${asunto.trim() || 'Sin título'} - Cita`;

  function valorInicialPeriodicidad(): PeriodicidadConfig {
    if (periodicidad) return periodicidad;
    return {
      desde: horaInicio,
      hasta: horaFin,
      tipo: 'semanal',
      cadaSemanas: 1,
      dias: [diaSemanaDeFecha(fechaInicio)],
      inicio: fechaInicio,
      finTipo: 'sinFin',
      ocurrencias: 10,
      hastaFecha: fechaFin
    };
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const inicio = todoDia ? combinar(fechaInicio, '00:00') : combinar(fechaInicio, horaInicio);
    const fin = todoDia ? combinar(fechaFin, '23:59') : combinar(fechaFin, horaFin);
    if (fin <= inicio) {
      setError('La fecha/hora de finalización debe ser posterior a la de comienzo.');
      return;
    }
    onGuardar({
      id: cita?.id ?? `c-${Date.now()}`,
      asunto: asunto.trim() || 'Sin título',
      lugar: cita?.lugar ?? 'Sin lugar definido',
      inicio: inicio.toISOString(),
      fin: fin.toISOString(),
      prioridad,
      recordatorio,
      observaciones,
      cancelada: cita?.cancelada ?? false,
      todoDia,
      periodicidad: periodicidad ?? undefined
    });
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-navy-900/40 px-4 py-6"
        role="dialog"
        aria-modal="true"
        aria-label={esEdicion ? 'Editar cita' : 'Nueva cita'}>
        
        <motion.form
          onSubmit={guardar}
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="flex h-[600px] w-full max-w-[820px] flex-col overflow-hidden rounded-[4px] border border-navy-300 bg-sky-100 shadow-dialog">
          
          {/* Barra de título de ventana */}
          <div className="flex shrink-0 items-center justify-between border-b border-sky-300 bg-sky-100 px-2 py-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-[2px] bg-navy-800">
                <CalendarDaysIcon className="h-3.5 w-3.5 text-amber-accent" strokeWidth={2} />
              </span>
              <span className="text-[13px] text-navy-900">{tituloVentana}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="flex h-6 w-7 items-center justify-center text-navy-700 hover:bg-sky-100">
                <MinusIcon className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span className="flex h-6 w-7 items-center justify-center text-navy-700 hover:bg-sky-100">
                <SquareIcon className="h-3 w-3" strokeWidth={2} />
              </span>
              <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar"
                className="flex h-6 w-7 items-center justify-center text-navy-700 transition-colors duration-150 ease-out hover:bg-[#B33A2B] hover:text-white">
                
                <XIcon className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Pestaña del mini-ribbon */}
          <div className="flex shrink-0 gap-0.5 border-b border-sky-300 bg-sky-50 px-2 pt-1">
            <span className="rounded-t-[3px] border border-b-0 border-sky-300 bg-sky-100 px-4 py-1 text-[12px] font-semibold text-navy-900">
              Appointment
            </span>
          </div>

          {/* Contenido del mini-ribbon */}
          <div className="flex h-[74px] shrink-0 items-stretch gap-0 bg-gradient-to-b from-sky-50 to-sky-100 px-2 py-1">
            <GrupoRibbon titulo="Acciones">
              <BotonGrandeRibbon icono={SaveIcon} etiqueta="Guardar y cerrar" />
              <div className="flex flex-col items-start gap-0.5">
                <BotonPequenoRibbon
                  icono={Trash2Icon}
                  etiqueta="Eliminar"
                  tono="text-[#B33A2B]"
                  deshabilitado={!esEdicion}
                  onClick={onEliminar} />
                
                <BotonPequenoRibbon icono={CalendarIcon} etiqueta="Agenda" />
              </div>
            </GrupoRibbon>

            <GrupoRibbon titulo="Opciones">
              <BotonGrandeRibbon
                icono={RefreshCwIcon}
                etiqueta="Periodicidad"
                activo={periodicidad !== null}
                onClick={() => setPeriodicidadAbierta(true)} />
              
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-1.5">
                  <AlertCircleIcon className="h-3.5 w-3.5 shrink-0 text-amber-deep" strokeWidth={1.8} />
                  <span className="text-[11px] text-navy-900">Prioridad:</span>
                  <select
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value as Prioridad)}
                    className={campoSelectPequeno}>
                    
                    {PRIORIDADES.map((p) =>
                    <option key={p} value={p}>
                        {p}
                      </option>
                    )}
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <BellIcon className="h-3.5 w-3.5 shrink-0 text-navy-700" strokeWidth={1.8} />
                  <span className="text-[11px] text-navy-900">Aviso:</span>
                  <select
                    value={recordatorio}
                    onChange={(e) => setRecordatorio(e.target.value as Recordatorio)}
                    className={campoSelectPequeno}>
                    
                    {RECORDATORIOS.map((r) =>
                    <option key={r} value={r}>
                        {ETIQUETA_RECORDATORIO[r]}
                      </option>
                    )}
                  </select>
                </div>
              </div>
            </GrupoRibbon>
          </div>

          {/* Campos del formulario */}
          <div className="flex shrink-0 flex-col gap-2 border-b border-sky-300 px-4 py-3">
            <FilaCampo etiqueta="Asunto:">
              <input
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                placeholder="Ej. Bautizo familia Pérez Similox"
                className={`${campoInput} w-full`} />
              
            </FilaCampo>

            <FilaCampo etiqueta="Agenda:">
              <select
                value={agendaId}
                onChange={(e) => setAgendaId(e.target.value)}
                className={`${campoInput} w-[240px]`}>
                
                {calendarios.map((c) =>
                <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                )}
              </select>
            </FilaCampo>

            <FilaCampo etiqueta="Comienzo:">
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className={campoInput} />
              
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                disabled={todoDia}
                className={`${campoInput} disabled:bg-sky-50 disabled:text-navy-900/40`} />
              
              <label className="flex items-center gap-1.5 text-[12px] text-navy-900">
                <input
                  type="checkbox"
                  checked={todoDia}
                  onChange={(e) => setTodoDia(e.target.checked)}
                  className="h-3.5 w-3.5" />
                
                Todo el día
              </label>
            </FilaCampo>

            <FilaCampo etiqueta="Finalización:">
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className={campoInput} />
              
              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                disabled={todoDia}
                className={`${campoInput} disabled:bg-sky-50 disabled:text-navy-900/40`} />
              
            </FilaCampo>

            {error &&
            <p role="alert" className="rounded-[2px] border border-[#D9A79E] bg-[#FBE7E3] px-2 py-1 text-[11px] font-semibold text-[#7C2318]">
                {error}
              </p>
            }
          </div>

          {/* Notas — ocupa el resto del espacio, sin etiqueta, como en la referencia */}
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder=""
            className="flex-1 resize-none border-0 px-4 py-3 text-[12px] text-navy-900 outline-none" />
          
        </motion.form>
      </div>

      {periodicidadAbierta &&
      <RecurrenceDialog
        valorInicial={valorInicialPeriodicidad()}
        tienePeriodicidad={periodicidad !== null}
        onAceptar={(config) => {
          setPeriodicidad(config);
          setPeriodicidadAbierta(false);
        }}
        onEliminarPeriodicidad={() => {
          setPeriodicidad(null);
          setPeriodicidadAbierta(false);
        }}
        onCancelar={() => setPeriodicidadAbierta(false)} />

      }
    </>);

}