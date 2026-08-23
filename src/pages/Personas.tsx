import { useEffect, useRef, useState } from 'react';
import type { PersonaFormHandle } from '../components/PersonaForm';
import { PersonaForm } from '../components/PersonaForm';
import { PersonasRibbon } from '../components/PersonasRibbon';
import { PersonasSidebar } from '../components/PersonasSidebar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { PersonaFormData, PersonaRegistro, RadioParroquialFiltro, SexoFiltro, TipoDocumentoFiltro } from '../types/personas';

type Sexo = SexoFiltro;
type TipoDocumento = TipoDocumentoFiltro;
type RadioParroquial = RadioParroquialFiltro;

interface PersonasProps {
  usuario: string;
  onVolverAgenda: () => void;
  onCerrarSesion: () => void;
}

export function Personas({ onVolverAgenda, onCerrarSesion }: PersonasProps) {
  const [modo, setModo] = useState<'padron' | 'nuevo' | 'editar' | 'consultar'>('padron');
  const formularioRef = useRef<PersonaFormHandle>(null);
  const busquedaRef = useRef<HTMLInputElement>(null);
  const sexoRef = useRef<HTMLSelectElement>(null);
  const [personas, setPersonas] = useState<PersonaRegistro[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [sexo, setSexo] = useState<Sexo>('Todos');
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('Todos');
  const [radioParroquial, setRadioParroquial] = useState<RadioParroquial>('Todos');
  const [personaSeleccionadaId, setPersonaSeleccionadaId] = useState<number | null>(null);
  const [confirmarDesactivacion, setConfirmarDesactivacion] = useState(false);

  const personaSeleccionada = personas.find((persona) => persona.id === personaSeleccionadaId);
  const terminoBusqueda = busqueda.trim().toLocaleLowerCase();
  const personasFiltradas = personas.filter((persona) => {
    const coincideBusqueda = !terminoBusqueda || [persona.nombre, persona.apellido, persona.apellidoMaterno, persona.documento]
      .some((valor) => valor.toLocaleLowerCase().includes(terminoBusqueda));
    const coincideSexo = sexo === 'Todos' || persona.sexo === sexo;
    const coincideDocumento = tipoDocumento === 'Todos' || persona.tipoDocumento === tipoDocumento;
    const coincideRadio = radioParroquial === 'Todos' || persona.perteneceRadioParroquial === radioParroquial;
    return coincideBusqueda && coincideSexo && coincideDocumento && coincideRadio;
  });

  useEffect(() => {
    if (personaSeleccionadaId !== null && !personasFiltradas.some((persona) => persona.id === personaSeleccionadaId)) {
      setPersonaSeleccionadaId(null);
    }
  }, [personaSeleccionadaId, personasFiltradas]);

  function limpiarFiltros() {
    setBusqueda('');
    setSexo('Todos');
    setTipoDocumento('Todos');
    setRadioParroquial('Todos');
  }

  function volverAlPadron() {
    formularioRef.current?.limpiar();
    setModo('padron');
  }

  function guardarPersona(datos: PersonaFormData) {
    if (modo === 'editar' && personaSeleccionadaId !== null) {
      setPersonas((actuales) => actuales.map((persona) => persona.id === personaSeleccionadaId ? { ...datos, id: persona.id, activo: persona.activo } : persona));
    } else {
      const siguienteId = personas.reduce((mayor, persona) => Math.max(mayor, persona.id), 0) + 1;
      setPersonas((actuales) => [...actuales, { ...datos, id: siguienteId, activo: true }]);
      setPersonaSeleccionadaId(siguienteId);
    }
    setModo('padron');
  }

  function cambiarEstadoPersona() {
    if (!personaSeleccionada) return;
    setPersonas((actuales) => actuales.map((persona) => persona.id === personaSeleccionada.id ? { ...persona, activo: !persona.activo } : persona));
    setPersonaSeleccionadaId(null);
    setConfirmarDesactivacion(false);
  }

  return <div className="flex h-screen w-full flex-col overflow-hidden bg-sky-100 font-sans text-navy-900">
    <PersonasRibbon
      modo={modo}
      onAbrir={() => personaSeleccionada && setModo('consultar')}
      onNuevo={() => setModo('nuevo')}
      onEditar={() => personaSeleccionada && setModo('editar')}
      onDesactivar={() => {
        if (personaSeleccionada) setConfirmarDesactivacion(true);
      }}
      onActualizar={() => undefined}
      onBuscar={() => busquedaRef.current?.focus()}
      onFiltros={() => sexoRef.current?.focus()}
      onLimpiar={() => modo === 'nuevo' ? formularioRef.current?.limpiar() : limpiarFiltros()}
      onGuardar={() => formularioRef.current?.guardar()}
      onCancelar={volverAlPadron}
      onCargarFoto={() => formularioRef.current?.cargarFoto()}
      onQuitarFoto={() => formularioRef.current?.quitarFoto()}
      onCerrarConsulta={volverAlPadron}
      puedeAbrir={personaSeleccionadaId !== null}
      puedeEditar={Boolean(personaSeleccionada?.activo)}
      puedeDesactivar={personaSeleccionadaId !== null}
      etiquetaEstado={personaSeleccionada?.activo === false ? 'Reactivar' : 'Desactivar'} />

    <div className="flex min-h-0 flex-1">
      <PersonasSidebar onVolverAgenda={onVolverAgenda} onCerrarSesion={onCerrarSesion} />
      {modo !== 'padron' ? <PersonaForm key={`${modo}-${personaSeleccionadaId ?? 'nuevo'}`} ref={formularioRef} modo={modo} datosIniciales={modo === 'editar' || modo === 'consultar' ? personaSeleccionada : undefined} onCancelar={volverAlPadron} onGuardar={guardarPersona} /> : <main className="flex min-w-0 flex-1 flex-col bg-sky-100">
        <div className="flex shrink-0 items-end justify-between border-b border-sky-400 bg-gradient-to-b from-white to-sky-50 px-4 py-3">
          <div>
            <h2 className="text-[16px] font-semibold text-navy-900">Padrón general de personas</h2>
            <p className="mt-1 text-[12px] text-navy-800/70">Administración de personas registradas en la parroquia</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-end gap-2 border-b border-sky-400 bg-sky-50 px-4 py-2">
          <label className="flex min-w-[260px] flex-1 flex-col gap-1 text-[11px] font-semibold text-navy-800">
            Buscar
            <input ref={busquedaRef} type="search" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar por nombre, apellido o documento..." className="h-7 rounded-[2px] border border-navy-600/30 bg-white px-2 text-[12px] font-normal text-navy-900 outline-none focus:border-amber-deep" />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-semibold text-navy-800">
            Sexo
            <select ref={sexoRef} value={sexo} onChange={(event) => setSexo(event.target.value as Sexo)} className="h-7 rounded-[2px] border border-navy-600/30 bg-white px-1.5 text-[12px] font-normal text-navy-900">
              <option>Todos</option><option>Masculino</option><option>Femenino</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-semibold text-navy-800">
            Tipo de documento
            <select value={tipoDocumento} onChange={(event) => setTipoDocumento(event.target.value as TipoDocumento)} className="h-7 rounded-[2px] border border-navy-600/30 bg-white px-1.5 text-[12px] font-normal text-navy-900">
              <option>Todos</option><option>Sin Datos</option><option>DNI</option><option>LE</option><option>CI</option><option>LC</option><option>PAS</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-semibold text-navy-800">
            Radio parroquial
            <select value={radioParroquial} onChange={(event) => setRadioParroquial(event.target.value as RadioParroquial)} className="h-7 rounded-[2px] border border-navy-600/30 bg-white px-1.5 text-[12px] font-normal text-navy-900">
              <option value="Todos">Todos</option><option value="Sí">Sí</option><option value="No">No</option>
            </select>
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
          <div className="overflow-hidden border border-sky-400 bg-white">
            <table className="w-full min-w-[920px] border-collapse text-left text-[11px]">
              <thead className="bg-sky-200 text-navy-900">
                <tr>
                  {['ID', 'Nombre completo', 'Sexo', 'Documento', 'Fecha de nacimiento', 'Teléfono', 'Celular', 'Radio parroquial', 'Estado'].map((columna) => <th key={columna} scope="col" className="border-b border-sky-400 px-2 py-2 font-semibold">{columna}</th>)}
                </tr>
              </thead>
              <tbody>
                {personas.length === 0 ? <tr>
                  <td colSpan={9} className="h-48 px-4 text-center text-navy-800/70">
                    <p className="font-semibold">No hay personas registradas.</p>
                    <p className="mt-1 text-[11px]">Utilice la opción Nuevo para registrar la primera persona.</p>
                  </td>
                </tr> : personasFiltradas.length === 0 ? <tr>
                  <td colSpan={9} className="h-48 px-4 text-center text-navy-800/70">
                    <p className="font-semibold">No se encontraron personas.</p>
                    <p className="mt-1 text-[11px]">No hay registros que coincidan con los criterios de búsqueda o filtros seleccionados.</p>
                  </td>
                </tr> : personasFiltradas.map((persona) => <tr key={persona.id} onClick={() => setPersonaSeleccionadaId(persona.id)} className={['border-b border-sky-200 hover:bg-sky-50', persona.id === personaSeleccionadaId ? 'bg-sky-100' : '', !persona.activo ? 'text-navy-800/50' : ''].join(' ')}>
                  <td className="px-2 py-2">{persona.id}</td>
                  <td className="px-2 py-2">{[persona.nombre, persona.apellido, persona.apellidoMaterno].filter(Boolean).join(' ')}</td>
                  <td className="px-2 py-2">{persona.sexo}</td>
                  <td className="px-2 py-2">{persona.documento}</td>
                  <td className="px-2 py-2">{persona.fechaNacimiento}</td>
                  <td className="px-2 py-2">{persona.telefonoCasa}</td>
                  <td className="px-2 py-2">{persona.telefonoMovil}</td>
                  <td className="px-2 py-2">{persona.perteneceRadioParroquial}</td>
                  <td className="px-2 py-2">{persona.activo ? 'Activo' : 'Inactivo'}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>
        <footer className="shrink-0 border-t border-sky-400 bg-sky-50 px-4 py-1.5 text-[11px] text-navy-800/70">{personas.length} personas registradas</footer>
      </main>}
    </div>
    {confirmarDesactivacion && personaSeleccionada && <ConfirmDialog
      titulo={personaSeleccionada.activo ? 'Desactivar persona' : 'Reactivar persona'}
      mensaje={personaSeleccionada.activo ? `¿Está seguro de que desea desactivar a ${[personaSeleccionada.nombre, personaSeleccionada.apellido, personaSeleccionada.apellidoMaterno].filter(Boolean).join(' ')}? La persona permanecerá registrada en el padrón.` : `¿Está seguro de que desea reactivar a ${[personaSeleccionada.nombre, personaSeleccionada.apellido, personaSeleccionada.apellidoMaterno].filter(Boolean).join(' ')}?`}
      textoConfirmar={personaSeleccionada.activo ? 'Sí, desactivar' : 'Sí, reactivar'}
      onConfirmar={cambiarEstadoPersona}
      onCancelar={() => setConfirmarDesactivacion(false)} />}
  </div>;
}