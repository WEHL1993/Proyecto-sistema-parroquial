import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { PersonaFormData } from '../types/personas';

export interface PersonaFormHandle {
  guardar: () => void;
  limpiar: () => void;
  cargarFoto: () => void;
  quitarFoto: () => void;
}

interface PersonaFormProps {
  onCancelar: () => void;
  onGuardar?: (datos: PersonaFormData) => void;
}

type ErroresFormulario = Partial<Record<'nombre' | 'apellido' | 'sexo' | 'email', string>>;

const FORMULARIO_INICIAL: PersonaFormData = {
  nombre: '',
  apellido: '',
  apellidoMaterno: '',
  sexo: '',
  tipoDocumento: 'Sin Datos',
  documento: '',
  fechaNacimiento: '',
  localidadNacimiento: '',
  provinciaNacimiento: '',
  paisNacimiento: 'Sin Datos',
  domicilio: '',
  telefonoCasa: '',
  telefonoMovil: '',
  email: '',
  perteneceRadioParroquial: 'Sí',
  parroquiaQuePertenece: '',
  observaciones: '',
  foto: null
};

function Campo({
  etiqueta,
  error,
  children
}: { etiqueta: string; error?: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1 text-[11px] font-semibold text-navy-800">
    {etiqueta}
    {children}
    {error && <span className="font-normal text-red-700">{error}</span>}
  </label>;
}

const controlClase = 'h-7 rounded-[2px] border border-navy-600/30 bg-white px-2 text-[12px] font-normal text-navy-900 outline-none focus:border-amber-deep disabled:bg-sky-100 disabled:text-navy-800/50';

export const PersonaForm = forwardRef<PersonaFormHandle, PersonaFormProps>(function PersonaForm({ onCancelar, onGuardar }, ref) {
  const [datos, setDatos] = useState<PersonaFormData>(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [vistaFoto, setVistaFoto] = useState<string | null>(null);
  const archivoRef = useRef<HTMLInputElement>(null);

  function actualizar<K extends keyof PersonaFormData>(campo: K, valor: PersonaFormData[K]) {
    setDatos((actual) => ({ ...actual, [campo]: valor }));
  }

  function seleccionarFoto(event: ChangeEvent<HTMLInputElement>) {
    const archivo = event.target.files?.[0] ?? null;
    if (!archivo) return;
    actualizar('foto', archivo);
    const lector = new FileReader();
    lector.onload = () => setVistaFoto(typeof lector.result === 'string' ? lector.result : null);
    lector.readAsDataURL(archivo);
  }

  function quitarFoto() {
    actualizar('foto', null);
    setVistaFoto(null);
    if (archivoRef.current) archivoRef.current.value = '';
  }

  function limpiar() {
    setDatos(FORMULARIO_INICIAL);
    setErrores({});
    setVistaFoto(null);
    if (archivoRef.current) archivoRef.current.value = '';
  }

  function guardar(event?: FormEvent) {
    event?.preventDefault();
    const nuevosErrores: ErroresFormulario = {};
    if (!datos.nombre.trim()) nuevosErrores.nombre = 'Este campo es obligatorio.';
    if (!datos.apellido.trim()) nuevosErrores.apellido = 'Este campo es obligatorio.';
    if (!datos.sexo) nuevosErrores.sexo = 'Este campo es obligatorio.';
    if (datos.email && !/^\S+@\S+\.\S+$/.test(datos.email)) {
      nuevosErrores.email = 'Ingrese un correo electrónico válido.';
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) onGuardar?.(datos);
  }

  useImperativeHandle(ref, () => ({ guardar: () => guardar(), limpiar, cargarFoto: () => archivoRef.current?.click(), quitarFoto }));

  return <form onSubmit={guardar} className="flex min-h-0 flex-1 flex-col overflow-auto bg-sky-100 px-4 py-4">
    <div className="mb-3 shrink-0">
      <h2 className="text-[16px] font-semibold text-navy-900">Registrar nueva persona</h2>
      <p className="mt-1 text-[12px] text-navy-800/70">Ingrese la información de la persona registrada en la parroquia</p>
    </div>

    <div className="grid shrink-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
      <section className="border border-sky-400 bg-sky-50 p-3">
        <h3 className="mb-2 border-b border-sky-400 pb-1 text-[12px] font-semibold uppercase tracking-wide text-navy-800">Datos personales</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Campo etiqueta="Nombre *" error={errores.nombre}><input maxLength={50} value={datos.nombre} onChange={(event) => actualizar('nombre', event.target.value)} className={controlClase} /></Campo>
          <Campo etiqueta="Apellido *" error={errores.apellido}><input maxLength={50} value={datos.apellido} onChange={(event) => actualizar('apellido', event.target.value)} className={controlClase} /></Campo>
          <Campo etiqueta="Apellido materno"><input maxLength={50} value={datos.apellidoMaterno} onChange={(event) => actualizar('apellidoMaterno', event.target.value)} className={controlClase} /></Campo>
          <Campo etiqueta="Sexo *" error={errores.sexo}><select value={datos.sexo} onChange={(event) => actualizar('sexo', event.target.value as PersonaFormData['sexo'])} className={controlClase}><option value="">Seleccione...</option><option>Masculino</option><option>Femenino</option></select></Campo>
          <Campo etiqueta="Tipo de documento"><select value={datos.tipoDocumento} onChange={(event) => actualizar('tipoDocumento', event.target.value as PersonaFormData['tipoDocumento'])} className={controlClase}><option>Sin Datos</option><option>DNI</option><option>LE</option><option>CI</option><option>LC</option><option>PAS</option></select></Campo>
          <Campo etiqueta="Número de documento"><input maxLength={25} value={datos.documento} onChange={(event) => actualizar('documento', event.target.value)} className={controlClase} /></Campo>
        </div>
      </section>

      <section className="border border-sky-400 bg-sky-50 p-3">
        <h3 className="mb-2 border-b border-sky-400 pb-1 text-[12px] font-semibold uppercase tracking-wide text-navy-800">Fotografía</h3>
        <div className="flex h-[116px] items-center justify-center border border-dashed border-navy-600/30 bg-white">
          {vistaFoto ? <img src={vistaFoto} alt="Vista previa" className="h-full max-w-full object-contain" /> : <span className="text-[11px] text-navy-800/60">Sin fotografía seleccionada</span>}
        </div>
        <input ref={archivoRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={seleccionarFoto} className="hidden" />
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={() => archivoRef.current?.click()} className="h-7 rounded-[2px] border border-navy-600/30 bg-sky-100 px-2 text-[11px] font-semibold text-navy-800 hover:bg-sky-200">Cargar foto</button>
          <button type="button" onClick={quitarFoto} disabled={!vistaFoto} className="h-7 rounded-[2px] border border-navy-600/30 bg-sky-100 px-2 text-[11px] font-semibold text-navy-800 disabled:cursor-not-allowed disabled:text-navy-800/40 hover:bg-sky-200">Quitar foto</button>
        </div>
      </section>
    </div>

    <section className="mt-3 shrink-0 border border-sky-400 bg-sky-50 p-3">
      <h3 className="mb-2 border-b border-sky-400 pb-1 text-[12px] font-semibold uppercase tracking-wide text-navy-800">Nacimiento</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Campo etiqueta="Fecha de nacimiento"><input type="date" value={datos.fechaNacimiento} onChange={(event) => actualizar('fechaNacimiento', event.target.value)} className={controlClase} /></Campo>
        <Campo etiqueta="Lugar de nacimiento"><input maxLength={50} value={datos.localidadNacimiento} onChange={(event) => actualizar('localidadNacimiento', event.target.value)} className={controlClase} /></Campo>
        <Campo etiqueta="Provincia / departamento de nacimiento"><input maxLength={50} value={datos.provinciaNacimiento} onChange={(event) => actualizar('provinciaNacimiento', event.target.value)} className={controlClase} /></Campo>
        <Campo etiqueta="País de nacimiento / país de origen"><select value={datos.paisNacimiento} onChange={(event) => actualizar('paisNacimiento', event.target.value as PersonaFormData['paisNacimiento'])} className={controlClase}><option>Sin Datos</option><option>Guatemala</option></select></Campo>
      </div>
    </section>

    <section className="mt-3 shrink-0 border border-sky-400 bg-sky-50 p-3">
      <h3 className="mb-2 border-b border-sky-400 pb-1 text-[12px] font-semibold uppercase tracking-wide text-navy-800">Contacto y domicilio</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Campo etiqueta="Dirección"><input maxLength={150} value={datos.domicilio} onChange={(event) => actualizar('domicilio', event.target.value)} className={controlClase} /></Campo>
        <Campo etiqueta="Teléfono"><input maxLength={25} value={datos.telefonoCasa} onChange={(event) => actualizar('telefonoCasa', event.target.value)} className={controlClase} /></Campo>
        <Campo etiqueta="Celular"><input maxLength={25} value={datos.telefonoMovil} onChange={(event) => actualizar('telefonoMovil', event.target.value)} className={controlClase} /></Campo>
        <Campo etiqueta="Correo electrónico" error={errores.email}><input type="email" maxLength={50} value={datos.email} onChange={(event) => actualizar('email', event.target.value)} className={controlClase} /></Campo>
      </div>
    </section>

    <section className="mt-3 shrink-0 border border-sky-400 bg-sky-50 p-3">
      <h3 className="mb-2 border-b border-sky-400 pb-1 text-[12px] font-semibold uppercase tracking-wide text-navy-800">Información parroquial</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Campo etiqueta="Pertenece al radio parroquial *"><select value={datos.perteneceRadioParroquial} onChange={(event) => actualizar('perteneceRadioParroquial', event.target.value as PersonaFormData['perteneceRadioParroquial'])} className={controlClase}><option>Sí</option><option>No</option></select></Campo>
        <Campo etiqueta="Parroquia a la que pertenece"><input maxLength={50} disabled={datos.perteneceRadioParroquial === 'Sí'} value={datos.parroquiaQuePertenece} onChange={(event) => actualizar('parroquiaQuePertenece', event.target.value)} className={controlClase} /></Campo>
      </div>
    </section>

    <section className="mt-3 shrink-0 border border-sky-400 bg-sky-50 p-3">
      <Campo etiqueta="Observaciones"><textarea value={datos.observaciones} onChange={(event) => actualizar('observaciones', event.target.value)} className="min-h-[72px] rounded-[2px] border border-navy-600/30 bg-white px-2 py-1 text-[12px] font-normal text-navy-900 outline-none focus:border-amber-deep" /></Campo>
    </section>

    <div className="mt-3 flex shrink-0 justify-end gap-2">
      <button type="submit" className="h-7 rounded-[2px] border border-amber-deep/60 bg-amber-soft px-3 text-[11px] font-semibold text-navy-900 hover:bg-amber-accent">Guardar</button>
      <button type="button" onClick={onCancelar} className="h-7 rounded-[2px] border border-navy-600/30 bg-sky-100 px-3 text-[11px] font-semibold text-navy-800 hover:bg-sky-200">Cancelar</button>
    </div>
  </form>;
});