import React, { useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Appointment, VistaAgenda } from '../types/agenda';
import { citasIniciales } from '../data/citas';
import { Ribbon } from '../components/Ribbon';
import { Sidebar } from '../components/Sidebar';
import { DayView } from '../components/DayView';
import { TimeGrid } from '../components/TimeGrid';
import { MonthView } from '../components/MonthView';
import { StatusBar } from '../components/StatusBar';
import { AppointmentDialog } from '../components/AppointmentDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PrintPreviewDialog } from '../components/PrintPreviewDialog';
import { useScreenInit } from '../useScreenInit.js';
import {
  MESES,
  ESTILO_PRIORIDAD,
  formatoFechaLarga,
  inicioDeSemana,
  sumarDias,
  sumarMeses } from
'../utils/agenda';

const TITULOS_VISTA: Record<VistaAgenda, string> = {
  dia: 'Día',
  laboral: 'Semana laboral',
  semana: 'Semana',
  mes: 'Mes'
};

interface AgendaProps {
  usuario: string;
  onCerrarSesion: () => void;
}

export function Agenda({ usuario, onCerrarSesion }: AgendaProps) {
  const screenInit = useScreenInit();
  const [citas, setCitas] = useState<Appointment[]>(citasIniciales);
  const [vista, setVista] = useState<VistaAgenda>(
    screenInit.vistaAgenda as VistaAgenda ?? 'semana'
  );
  const [pestana, setPestana] = useState<'inicio' | 'impresion'>('inicio');
  const [fecha, setFecha] = useState<Date>(() => new Date());
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [slotSeleccionado, setSlotSeleccionado] = useState<Date | null>(null);
  const [dialogo, setDialogo] = useState<
    {modo: 'nuevo';inicio: Date;} | {modo: 'editar';cita: Appointment;} | null>(
    () => {
      if (screenInit.dialogo === 'nuevo') {
        const inicio = new Date();
        inicio.setHours(9, 0, 0, 0);
        return { modo: 'nuevo', inicio };
      }
      if (screenInit.dialogo === 'editar') {
        return { modo: 'editar', cita: citasIniciales[0] };
      }
      return null;
    });
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [confirmarSalir, setConfirmarSalir] = useState(false);
  const [vistaPreviaAbierta, setVistaPreviaAbierta] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [calendarios, setCalendarios] = useState([
  { id: 'oe', nombre: 'Office Eclesial', visible: true, color: '#96253F' },
  { id: 'litur', nombre: 'Calendario litúrgico', visible: false, color: '#D4AF37' }]
  );

  const agendaVisible = calendarios[0].visible;
  const citasVisibles = agendaVisible ? citas : [];

  const diasSemana = useMemo(() => {
    const lunes = inicioDeSemana(fecha);
    const total = vista === 'laboral' ? 5 : 7;
    return Array.from({ length: total }, (_, i) => sumarDias(lunes, i));
  }, [fecha, vista]);

  const ordenadas = useMemo(
    () => [...citasVisibles].sort((a, b) => +new Date(a.inicio) - +new Date(b.inicio)),
    [citasVisibles]
  );
  const referencia = new Date(fecha);
  referencia.setHours(0, 0, 0, 0);
  const citaSiguiente =
  ordenadas.find((c) => +new Date(c.inicio) > +referencia + 86400000 - 1) ?? null;
  const citaAnterior =
  [...ordenadas].reverse().find((c) => +new Date(c.inicio) < +referencia) ?? null;

  const seleccionada = citas.find((c) => c.id === seleccionadaId) ?? null;

  function anunciar(texto: string) {
    setMensaje(texto);
    window.setTimeout(() => setMensaje(''), 4000);
  }

  function navegar(direccion: -1 | 1) {
    if (vista === 'mes') setFecha(sumarMeses(fecha, direccion));else
    if (vista === 'dia') setFecha(sumarDias(fecha, direccion));else
    setFecha(sumarDias(fecha, direccion * 7));
  }

  function seleccionarSlot(fecha: Date) {
    setSlotSeleccionado(fecha);
    setSeleccionadaId(null);
  }

  function abrirNueva(inicio?: Date) {
    const base = inicio ?
    new Date(inicio) :
    slotSeleccionado ?
    new Date(slotSeleccionado) :
    new Date(fecha);
    if (!inicio && !slotSeleccionado) base.setHours(9, 0, 0, 0);
    setDialogo({ modo: 'nuevo', inicio: base });
    setSlotSeleccionado(null);
  }

  function seleccionarCita(cita: Appointment) {
    setSeleccionadaId(cita.id);
    setSlotSeleccionado(null);
  }

  function abrirEdicion(cita: Appointment) {
    setSeleccionadaId(cita.id);
    setSlotSeleccionado(null);
    setDialogo({ modo: 'editar', cita });
  }

  function guardar(cita: Appointment) {
    setCitas((prev) => {
      const existe = prev.some((c) => c.id === cita.id);
      return existe ? prev.map((c) => c.id === cita.id ? cita : c) : [...prev, cita];
    });
    setSeleccionadaId(cita.id);
    setFecha(new Date(cita.inicio));
    setDialogo(null);
    anunciar(
      dialogo?.modo === 'editar' ? 'Cambios guardados.' : 'Cita creada correctamente.'
    );
  }

  function eliminarCita() {
    if (!seleccionadaId) return;
    setCitas((prev) => prev.filter((c) => c.id !== seleccionadaId));
    setSeleccionadaId(null);
    setConfirmarEliminar(false);
    anunciar('Cita eliminada de la agenda.');
  }

  const tituloRango =
  vista === 'mes' ?
  `${MESES[fecha.getMonth()]} ${fecha.getFullYear()}` :
  vista === 'dia' ?
  formatoFechaLarga(fecha) :
  `${diasSemana[0].getDate()} – ${diasSemana[diasSemana.length - 1].getDate()} de ${
  MESES[diasSemana[diasSemana.length - 1].getMonth()]} de ${
  diasSemana[diasSemana.length - 1].getFullYear()}`;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-sky-100 font-sans text-navy-900">
      <Ribbon
        pestana={pestana}
        onPestanaChange={setPestana}
        vista={vista}
        onVistaChange={setVista}
        onAbrir={() => {
          if (seleccionada) abrirEdicion(seleccionada);
        }}
        onNuevo={() => abrirNueva()}
        onEliminar={() => setConfirmarEliminar(true)}
        onActualizar={() => anunciar('Agenda actualizada desde el servidor.')}
        onHoy={() => setFecha(new Date())}
        onVistaPrevia={() => setVistaPreviaAbierta(true)}
        hayCitaSeleccionada={Boolean(seleccionada)} />
      

      <div className="flex min-h-0 flex-1">
        <Sidebar
          fechaSeleccionada={fecha}
          vista={vista}
          onSeleccionarFecha={(f) => {
            setFecha(f);
            if (vista === 'mes') setVista('dia');
          }}
          citas={citas}
          calendarios={calendarios}
          onToggleCalendario={(id) =>
          setCalendarios((prev) =>
          prev.map((c) => c.id === id ? { ...c, visible: !c.visible } : c)
          )
          }
          onCerrarSesion={() => setConfirmarSalir(true)} />
        

        <main className="flex min-w-0 flex-1 flex-col bg-sky-100">
          <div className="flex shrink-0 items-center justify-between border-b border-sky-400 bg-gradient-to-b from-white to-sky-50 px-3 py-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Periodo anterior"
                onClick={() => navegar(-1)}
                className="rounded-[2px] border border-navy-600/30 bg-sky-100 p-1 text-navy-700 transition-colors duration-150 ease-out hover:bg-sky-100">
                
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Periodo siguiente"
                onClick={() => navegar(1)}
                className="rounded-[2px] border border-navy-600/30 bg-sky-100 p-1 text-navy-700 transition-colors duration-150 ease-out hover:bg-sky-100">
                
                <ChevronRightIcon className="h-4 w-4" />
              </button>
              <h2 className="ml-1 text-[16px] font-semibold capitalize text-navy-900">
                {tituloRango}
              </h2>
              <span className="rounded-[2px] border border-sky-400 bg-sky-100 px-2 py-[1px] text-[11px] text-navy-800">
                Vista: {TITULOS_VISTA[vista]}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-navy-800/80">
              <span className="font-semibold uppercase tracking-wide text-navy-800/60">
                Prioridad
              </span>
              {(['Alta', 'Media', 'Baja'] as const).map((p) =>
              <span key={p} className="flex items-center gap-1.5">
                  <span
                  className={`h-3 w-3 rounded-[2px] ${ESTILO_PRIORIDAD[p].barra}`} />
                
                  {p}
                </span>
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1">
            {!agendaVisible ?
            <div className="flex h-full items-center justify-center px-6 text-center text-[12px] text-navy-800/70">
                No hay calendarios visibles. Active «Office Eclesial» en el panel Agenda
                para ver las citas.
              </div> :
            vista === 'dia' ?
            <DayView
              fecha={fecha}
              citas={citasVisibles}
              citaSeleccionadaId={seleccionadaId}
              onSeleccionarCita={seleccionarCita}
              onAbrirCita={abrirEdicion}
              slotSeleccionado={slotSeleccionado}
              onSeleccionarSlot={seleccionarSlot}
              onSlotVacio={abrirNueva}
              citaAnterior={citaAnterior}
              citaSiguiente={citaSiguiente}
              onCitaAnterior={() => {
                if (citaAnterior) {
                  setFecha(new Date(citaAnterior.inicio));
                  setSeleccionadaId(citaAnterior.id);
                }
              }}
              onCitaSiguiente={() => {
                if (citaSiguiente) {
                  setFecha(new Date(citaSiguiente.inicio));
                  setSeleccionadaId(citaSiguiente.id);
                }
              }} /> :

            vista === 'mes' ?
            <MonthView
              fecha={fecha}
              citas={citasVisibles}
              citaSeleccionadaId={seleccionadaId}
              onSeleccionarCita={seleccionarCita}
              onAbrirCita={abrirEdicion}
              slotSeleccionado={slotSeleccionado}
              onSeleccionarSlot={seleccionarSlot}
              onSeleccionarDia={(d) => {
                setFecha(d);
                setVista('dia');
              }}
              onSlotVacio={abrirNueva} /> :


            <TimeGrid
              dias={diasSemana}
              citas={citasVisibles}
              citaSeleccionadaId={seleccionadaId}
              onSeleccionarCita={seleccionarCita}
              onAbrirCita={abrirEdicion}
              slotSeleccionado={slotSeleccionado}
              onSeleccionarSlot={seleccionarSlot}
              onSlotVacio={abrirNueva} />

            }
          </div>
        </main>
      </div>

      <StatusBar
        totalCitas={citas.length}
        mensaje={mensaje}
        usuario={usuario}
        onCerrarSesion={() => setConfirmarSalir(true)} />
      

      {dialogo &&
      <AppointmentDialog
        key={dialogo.modo === 'editar' ? dialogo.cita.id : 'nueva'}
        cita={dialogo.modo === 'editar' ? dialogo.cita : null}
        inicioPorDefecto={dialogo.modo === 'nuevo' ? dialogo.inicio : new Date()}
        calendarios={calendarios}
        onGuardar={guardar}
        onEliminar={() => {
          setDialogo(null);
          setConfirmarEliminar(true);
        }}
        onCerrar={() => setDialogo(null)} />

      }

      {vistaPreviaAbierta &&
      <PrintPreviewDialog
        vista={vista}
        fecha={fecha}
        citas={citasVisibles}
        onCerrar={() => setVistaPreviaAbierta(false)} />

      }

      {confirmarEliminar && seleccionada &&
      <ConfirmDialog
        titulo="Eliminar cita"
        mensaje={`¿Desea eliminar definitivamente la cita “${seleccionada.asunto}”? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        onConfirmar={eliminarCita}
        onCancelar={() => setConfirmarEliminar(false)} />

      }

      {confirmarSalir &&
      <ConfirmDialog
        titulo="Cerrar sesión"
        mensaje="¿Desea cerrar la sesión y volver a la pantalla de inicio? Los cambios no guardados se perderán."
        textoConfirmar="Cerrar sesión"
        onConfirmar={onCerrarSesion}
        onCancelar={() => setConfirmarSalir(false)} />

      }
    </div>);

}