import { useRef, useState } from 'react';
import type { PersonaFormHandle } from '../components/PersonaForm';
import { PersonaForm } from '../components/PersonaForm';
import { PersonasRibbon } from '../components/PersonasRibbon';
import { PersonasSidebar } from '../components/PersonasSidebar';
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
  const [personas, setPersonas] = useState<PersonaRegistro[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [sexo, setSexo] = useState<Sexo>('Todos');
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('Todos');
  const [radioParroquial, setRadioParroquial] = useState<RadioParroquial>('Todos');
  const [personaSeleccionadaId, setPersonaSeleccionadaId] = useState<number | null>(null);

  const personaSeleccionada = personas.find((persona) => persona.id === personaSeleccionadaId);

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
      setPersonas((actuales) => actuales.map((persona) => persona.id === personaSeleccionadaId ? { ...datos, id: persona.id } : persona));
    } else {
      const siguienteId = personas.reduce((mayor, persona) => Math.max(mayor, persona.id), 0) + 1;
      setPersonas((actuales) => [...actuales, { ...datos, id: siguienteId }]);
      setPersonaSeleccionadaId(siguienteId);
    }
    setModo('padron');
  }

  return <div className="flex h-screen w-full flex-col overflow-hidden bg-sky-100 font-sans text-navy-900">
    <PersonasRibbon
      modo={modo}
      onAbrir={() => personaSeleccionada && setModo('consultar')}
      onNuevo={() => setModo('nuevo')}
      onEditar={() => personaSeleccionada && setModo('editar')}
      onDesactivar={() => undefined}
      onActualizar={() => undefined}
      onBuscar={() => formularioRef.current?.cargarFoto()}
      onFiltros={() => formularioRef.current?.quitarFoto()}
      onLimpiar={() => modo === 'nuevo' ? formularioRef.current?.limpiar() : limpiarFiltros()}
      onGuardar={() => formularioRef.current?.guardar()}
      onCancelar={volverAlPadron}
      onCargarFoto={() => formularioRef.current?.cargarFoto()}
      onQuitarFoto={() => formularioRef.current?.quitarFoto()}
      onCerrarConsulta={volverAlPadron}
      hayPersonaSeleccionada={personaSeleccionadaId !== null} />

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
            <input type="search" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar por nombre, apellido o documento..." className="h-7 rounded-[2px] border border-navy-600/30 bg-white px-2 text-[12px] font-normal text-navy-900 outline-none focus:border-amber-deep" />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-semibold text-navy-800">
            Sexo
            <select value={sexo} onChange={(event) => setSexo(event.target.value as Sexo)} className="h-7 rounded-[2px] border border-navy-600/30 bg-white px-1.5 text-[12px] font-normal text-navy-900">
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
              <option>Todos</option><option>Sí</option><option>No</option>
            </select>
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
          <div className="overflow-hidden border border-sky-400 bg-white">
            <table className="w-full min-w-[920px] border-collapse text-left text-[11px]">
              <thead className="bg-sky-200 text-navy-900">
                <tr>
                  {['ID', 'Nombre completo', 'Sexo', 'Documento', 'Fecha de nacimiento', 'Teléfono', 'Celular', 'Radio parroquial'].map((columna) => <th key={columna} scope="col" className="border-b border-sky-400 px-2 py-2 font-semibold">{columna}</th>)}
                </tr>
              </thead>
              <tbody>
                {personas.length === 0 ? <tr>
                  <td colSpan={8} className="h-48 px-4 text-center text-navy-800/70">
                    <p className="font-semibold">No hay personas registradas.</p>
                    <p className="mt-1 text-[11px]">Utilice la opción Nuevo para registrar la primera persona.</p>
                  </td>
                </tr> : personas.map((persona) => <tr key={persona.id} onClick={() => setPersonaSeleccionadaId(persona.id)} className={['border-b border-sky-200 hover:bg-sky-50', persona.id === personaSeleccionadaId ? 'bg-sky-100' : ''].join(' ')}>
                  <td className="px-2 py-2">{persona.id}</td>
                  <td className="px-2 py-2">{[persona.nombre, persona.apellido, persona.apellidoMaterno].filter(Boolean).join(' ')}</td>
                  <td className="px-2 py-2">{persona.sexo}</td>
                  <td className="px-2 py-2">{persona.documento}</td>
                  <td className="px-2 py-2">{persona.fechaNacimiento}</td>
                  <td className="px-2 py-2">{persona.telefonoCasa}</td>
                  <td className="px-2 py-2">{persona.telefonoMovil}</td>
                  <td className="px-2 py-2">{persona.perteneceRadioParroquial}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>
        <footer className="shrink-0 border-t border-sky-400 bg-sky-50 px-4 py-1.5 text-[11px] text-navy-800/70">{personas.length} personas registradas</footer>
      </main>}
    </div>
  </div>;
}