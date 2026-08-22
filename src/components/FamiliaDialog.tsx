import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XIcon,
  SaveIcon,
  Trash2Icon,
  MinusIcon,
  SquareIcon,
  HomeIcon,
  SearchIcon,
  NetworkIcon,
  PencilIcon,
  InfoIcon,
  AlertTriangleIcon,
  UserPlusIcon,
  FileTextIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon } from
'lucide-react';
import { Familia, Filiacion, IntegranteFamilia, TipoIntegrante, TipoResidencia, TipoUnion } from '../types/familia';
import { Persona, nombreCompleto } from '../types/persona';
import { generarIdFamilia, generarIdIntegrante } from '../utils/familias';
import { formatoFechaCorta } from '../utils/fecha';
import { validarAsociarIntegrante, validarFechaUnion, validarPadreMadre } from '../utils/validacionesFamilia';
import { PersonaAvatar } from './PersonaAvatar';
import { SeleccionarPersonaDialog } from './SeleccionarPersonaDialog';
import { RelacionesFamiliaresDialog } from './RelacionesFamiliaresDialog';
import { FamiliaFichaDialog } from './FamiliaFichaDialog';

interface FamiliaDialogProps {
  familia: Familia | null;
  personas: Persona[];
  onGuardar: (familia: Familia) => void;
  onEliminar: () => void;
  onCerrar: () => void;
  onRegistrarPersona: (persona: Omit<Persona, 'id'>) => Persona;
}

type Pestana = 'generales' | 'conformada' | 'integrantes' | 'ficha';

const PESTANAS: {id: Pestana;etiqueta: string;}[] = [
{ id: 'generales', etiqueta: 'Datos generales' },
{ id: 'conformada', etiqueta: 'Familia conformada' },
{ id: 'integrantes', etiqueta: 'Integrantes' },
{ id: 'ficha', etiqueta: 'Ficha familiar' }];


const TIPOS_UNION: TipoUnion[] = ['Matrimonio canónico', 'Matrimonio civil', 'Unión de hecho', 'Sin unión formal'];
const TIPOS_RESIDENCIA: TipoResidencia[] = ['Casa propia', 'Alquilada', 'Prestada', 'Otro'];
const TIPOS_INTEGRANTE: TipoIntegrante[] = ['Hijo', 'Hija', 'Otro'];
const FILIACIONES: Filiacion[] = ['Legítima', 'Natural', 'Adoptiva'];

function FilaCampo({ etiqueta, children }: {etiqueta: string;children: React.ReactNode;}) {
  return (
    <div className="flex items-center gap-3">
      <label className="w-[130px] shrink-0 text-[12px] text-navy-900">{etiqueta}</label>
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
    </div>);

}

const campoInput =
'rounded-[2px] border border-navy-600/40 bg-sky-100 px-2 py-1 text-[12px] text-navy-900 outline-none transition-colors duration-150 ease-out focus:border-amber-accent focus:ring-1 focus:ring-amber-accent';

function Banner({ nivel, texto }: {nivel: 'error' | 'aviso' | 'info';texto: string;}) {
  const estilos = {
    error: 'border-estado-error/40 bg-estado-errorBg text-estado-error',
    aviso: 'border-estado-aviso/40 bg-estado-avisoBg text-estado-aviso',
    info: 'border-amber-deep/40 bg-amber-soft text-navy-900'
  }[nivel];
  const Icono = nivel === 'info' ? InfoIcon : AlertTriangleIcon;
  return (
    <div className={`flex items-start gap-2 rounded-[2px] border px-2 py-1.5 text-[11px] leading-relaxed ${estilos}`}>
      <Icono className="mt-[1px] h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
      <span>{texto}</span>
    </div>);

}

function TarjetaPersona({
  persona,
  onCambiar,
  onQuitar,
  onVerRelaciones



}: {persona: Persona;onCambiar: () => void;onQuitar: () => void;onVerRelaciones: () => void;}) {
  return (
    <div className="flex items-center gap-3 rounded-[2px] border border-navy-600/30 bg-white p-2">
      <PersonaAvatar persona={persona} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-medium text-navy-900">{nombreCompleto(persona)}</p>
        <p className="text-[11px] text-navy-800/60">Registrado en el padrón</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onVerRelaciones}
          title="Ver relaciones familiares"
          className="rounded-[2px] p-1.5 text-navy-700 hover:bg-sky-100">

          <NetworkIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
        <button
          type="button"
          onClick={onCambiar}
          className="flex items-center gap-1 rounded-[2px] border border-navy-600/30 bg-sky-100 px-2 py-1 text-[11px] text-navy-800 hover:bg-sky-100">

          <SearchIcon className="h-3 w-3" strokeWidth={1.8} />
          Cambiar
        </button>
        <button
          type="button"
          onClick={onQuitar}
          title="Quitar"
          className="rounded-[2px] p-1.5 text-[#B33A2B] hover:bg-[#FBE7E3]">

          <Trash2Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
      </div>
    </div>);

}

export function FamiliaDialog({
  familia,
  personas: personasProp,
  onGuardar,
  onEliminar,
  onCerrar,
  onRegistrarPersona
}: FamiliaDialogProps) {
  const esEdicion = familia !== null;
  const [personas, setPersonas] = useState<Persona[]>(personasProp);
  const [pestana, setPestana] = useState<Pestana>('generales');

  const [nombre, setNombre] = useState(familia?.nombre ?? '');
  const [tipoResidencia, setTipoResidencia] = useState<TipoResidencia>(familia?.tipoResidencia ?? 'Casa propia');
  const [domicilio, setDomicilio] = useState(familia?.domicilio ?? '');
  const [localidad, setLocalidad] = useState(familia?.localidad ?? '');
  const [codigoPostal, setCodigoPostal] = useState(familia?.codigoPostal ?? '');
  const [provincia, setProvincia] = useState(familia?.provincia ?? '');
  const [pais, setPais] = useState(familia?.pais ?? 'Guatemala');
  const [telefono, setTelefono] = useState(familia?.telefono ?? '');
  const [email, setEmail] = useState(familia?.email ?? '');
  const [enRadioParroquial, setEnRadioParroquial] = useState(familia?.enRadioParroquial ?? false);
  const [observaciones, setObservaciones] = useState(familia?.observaciones ?? '');

  const [idPadre, setIdPadre] = useState<string | null>(familia?.idPadre ?? null);
  const [idMadre, setIdMadre] = useState<string | null>(familia?.idMadre ?? null);
  const [union, setUnion] = useState<TipoUnion>(familia?.union ?? 'Matrimonio canónico');
  const [fecha, setFecha] = useState(familia?.fecha ?? '');

  const [integrantes, setIntegrantes] = useState<IntegranteFamilia[]>(familia?.integrantes ?? []);
  const [editandoIntegranteId, setEditandoIntegranteId] = useState<string | null>(null);
  const [personaPendiente, setPersonaPendiente] = useState<Persona | null>(null);
  const [tipoIntegrantePendiente, setTipoIntegrantePendiente] = useState<TipoIntegrante>('Hija');
  const [filiacionPendiente, setFiliacionPendiente] = useState<Filiacion>('Legítima');
  const [errorIntegrante, setErrorIntegrante] = useState<string | null>(null);

  const [selectorAbierto, setSelectorAbierto] = useState<'padre' | 'madre' | 'integrante' | null>(null);
  const [relacionesDe, setRelacionesDe] = useState<Persona | null>(null);
  const [fichaAbierta, setFichaAbierta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idNuevaFamilia] = useState(() => generarIdFamilia());

  const porId = new Map(personas.map((p) => [p.id, p]));
  const padre = idPadre ? porId.get(idPadre) ?? null : null;
  const madre = idMadre ? porId.get(idMadre) ?? null : null;

  const tituloVentana = `${nombre.trim() || 'Sin nombre'} - Familia`;

  const errorPadreMadre = validarPadreMadre(idPadre, idMadre);
  const avisoFecha = validarFechaUnion(fecha, padre, madre);

  function registrarPersona(datos: Omit<Persona, 'id'>): Persona {
    const nueva = onRegistrarPersona(datos);
    setPersonas((prev) => [...prev, nueva]);
    return nueva;
  }

  function alSeleccionarPersona(persona: Persona) {
    if (selectorAbierto === 'padre') {
      setIdPadre(persona.id);
      setIntegrantes((prev) => prev.filter((i) => i.idPersona !== persona.id));
      setSelectorAbierto(null);
    } else if (selectorAbierto === 'madre') {
      setIdMadre(persona.id);
      setIntegrantes((prev) => prev.filter((i) => i.idPersona !== persona.id));
      setSelectorAbierto(null);
    } else if (selectorAbierto === 'integrante') {
      const draft: Familia = construirFamilia();
      const problema = validarAsociarIntegrante(persona.id, draft, personas);
      if (problema) {
        setErrorIntegrante(problema.mensaje);
        setSelectorAbierto(null);
        return;
      }
      setErrorIntegrante(null);
      setPersonaPendiente(persona);
      setTipoIntegrantePendiente(persona.sexo === 'M' ? 'Hijo' : 'Hija');
      setFiliacionPendiente('Legítima');
      setSelectorAbierto(null);
    }
  }

  function confirmarAsociarIntegrante() {
    if (!personaPendiente) return;
    setIntegrantes((prev) => [
    ...prev,
    { id: generarIdIntegrante(), idPersona: personaPendiente.id, tipoIntegrante: tipoIntegrantePendiente, filiacion: filiacionPendiente }]
    );
    setPersonaPendiente(null);
  }

  function guardarEdicionIntegrante() {
    if (!editandoIntegranteId) return;
    setIntegrantes((prev) =>
    prev.map((i) =>
    i.id === editandoIntegranteId ?
    { ...i, tipoIntegrante: tipoIntegrantePendiente, filiacion: filiacionPendiente } :
    i
    )
    );
    setEditandoIntegranteId(null);
  }

  function editarIntegrante(i: IntegranteFamilia) {
    if (personaPendiente) return;
    setEditandoIntegranteId(i.id);
    setTipoIntegrantePendiente(i.tipoIntegrante);
    setFiliacionPendiente(i.filiacion);
  }

  function quitarIntegrante(id: string) {
    setIntegrantes((prev) => prev.filter((i) => i.id !== id));
    if (editandoIntegranteId === id) setEditandoIntegranteId(null);
  }

  function construirFamilia(): Familia {
    return {
      id: familia?.id ?? idNuevaFamilia,
      nombre: nombre.trim() || 'Sin nombre',
      tipoResidencia,
      domicilio: domicilio.trim(),
      localidad: localidad.trim(),
      codigoPostal: codigoPostal.trim(),
      provincia: provincia.trim(),
      pais: pais.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      enRadioParroquial,
      idPadre,
      idMadre,
      union,
      fecha,
      observaciones,
      integrantes
    };
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre de la familia es obligatorio.');
      setPestana('generales');
      return;
    }
    if (errorPadreMadre) {
      setError(errorPadreMadre.mensaje);
      setPestana('conformada');
      return;
    }
    setError(null);
    onGuardar(construirFamilia());
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-navy-900/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={esEdicion ? 'Editar familia' : 'Nueva familia'}>

      <motion.form
        onSubmit={guardar}
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        className="flex max-h-[92vh] w-full max-w-[900px] flex-col overflow-hidden rounded-[4px] border border-navy-300 bg-sky-100 shadow-dialog">

        <div className="flex shrink-0 items-center justify-between border-b border-sky-300 bg-sky-100 px-2 py-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-[2px] bg-navy-800">
              <HomeIcon className="h-3.5 w-3.5 text-amber-accent" strokeWidth={2} />
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

        <div className="flex shrink-0 items-center gap-2 border-b border-sky-300 bg-sky-50 px-3 py-1.5">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-[2px] border border-amber-deep bg-amber-accent px-3 py-1 text-[12px] font-semibold text-navy-900 transition-colors duration-150 ease-out hover:bg-amber-deep hover:text-white">

            <SaveIcon className="h-3.5 w-3.5" strokeWidth={2} />
            Guardar y cerrar
          </button>
          <button
            type="button"
            onClick={onEliminar}
            disabled={!esEdicion}
            className="flex items-center gap-1.5 rounded-[2px] border border-[#D9A79E] bg-white px-3 py-1 text-[12px] font-semibold text-[#B33A2B] transition-colors duration-150 ease-out hover:bg-[#FBE7E3] disabled:cursor-not-allowed disabled:border-navy-600/20 disabled:text-navy-900/30 disabled:hover:bg-white">

            <Trash2Icon className="h-3.5 w-3.5" strokeWidth={2} />
            Eliminar
          </button>
          <button
            type="button"
            onClick={() => setFichaAbierta(true)}
            className="flex items-center gap-1.5 rounded-[2px] border border-navy-600/30 bg-white px-3 py-1 text-[12px] font-semibold text-navy-800 transition-colors duration-150 ease-out hover:bg-sky-50">

            <FileTextIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
            Ver ficha familiar
          </button>
          {error && <span className="text-[11px] font-semibold text-estado-error">{error}</span>}
        </div>

        <div role="tablist" aria-label="Secciones de la ficha familiar" className="flex shrink-0 gap-0.5 border-b border-sky-300 bg-sky-50 px-2 pt-1">
          {PESTANAS.map((p) =>
          <button
            key={p.id}
            role="tab"
            type="button"
            aria-selected={pestana === p.id}
            onClick={() => setPestana(p.id)}
            className={[
            'rounded-t-[3px] border border-b-0 px-4 py-1.5 text-[12px] transition-colors duration-150 ease-out',
            pestana === p.id ?
            'border-sky-300 bg-sky-100 font-semibold text-navy-900' :
            'border-transparent text-navy-800/70 hover:bg-sky-100/60'].
            join(' ')}>

              {p.etiqueta}
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {pestana === 'generales' &&
          <div className="mx-auto max-w-[560px] space-y-2">
              <FilaCampo etiqueta="Nombre de familia:">
                <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Pérez Similox"
                className={`${campoInput} w-full`} />

              </FilaCampo>
              <FilaCampo etiqueta="Tipo de residencia:">
                <select value={tipoResidencia} onChange={(e) => setTipoResidencia(e.target.value as TipoResidencia)} className={`${campoInput} w-full`}>
                  {TIPOS_RESIDENCIA.map((t) =>
                <option key={t} value={t}>
                      {t}
                    </option>
                )}
                </select>
              </FilaCampo>
              <FilaCampo etiqueta="Domicilio:">
                <div className="flex flex-1 items-center gap-1.5 rounded-[2px] border border-navy-600/40 bg-sky-100 px-2 py-1">
                  <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-navy-600" strokeWidth={1.7} />
                  <input
                  value={domicilio}
                  onChange={(e) => setDomicilio(e.target.value)}
                  className="w-full border-0 bg-transparent text-[12px] text-navy-900 outline-none" />

                </div>
              </FilaCampo>
              <FilaCampo etiqueta="Localidad:">
                <input value={localidad} onChange={(e) => setLocalidad(e.target.value)} className={`${campoInput} w-full`} />
              </FilaCampo>
              <div className="grid grid-cols-2 gap-2">
                <FilaCampo etiqueta="Código postal:">
                  <input value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className={`${campoInput} w-full`} />
                </FilaCampo>
                <FilaCampo etiqueta="Departamento:">
                  <input value={provincia} onChange={(e) => setProvincia(e.target.value)} className={`${campoInput} w-full`} />
                </FilaCampo>
              </div>
              <FilaCampo etiqueta="País:">
                <input value={pais} onChange={(e) => setPais(e.target.value)} className={`${campoInput} w-full`} />
              </FilaCampo>
              <FilaCampo etiqueta="Teléfono:">
                <div className="flex flex-1 items-center gap-1.5 rounded-[2px] border border-navy-600/40 bg-sky-100 px-2 py-1">
                  <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-navy-600" strokeWidth={1.7} />
                  <input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full border-0 bg-transparent text-[12px] text-navy-900 outline-none" />

                </div>
              </FilaCampo>
              <FilaCampo etiqueta="Correo electrónico:">
                <div className="flex flex-1 items-center gap-1.5 rounded-[2px] border border-navy-600/40 bg-sky-100 px-2 py-1">
                  <MailIcon className="h-3.5 w-3.5 shrink-0 text-navy-600" strokeWidth={1.7} />
                  <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-0 bg-transparent text-[12px] text-navy-900 outline-none" />

                </div>
              </FilaCampo>
              <label className="flex items-center gap-1.5 text-[12px] text-navy-900">
                <input
                type="checkbox"
                checked={enRadioParroquial}
                onChange={(e) => setEnRadioParroquial(e.target.checked)}
                className="h-3.5 w-3.5" />

                Pertenece al radio parroquial
              </label>
              <FilaCampo etiqueta="Observaciones:">
                <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={3}
                className={`${campoInput} w-full resize-none`} />

              </FilaCampo>
            </div>
          }

          {pestana === 'conformada' &&
          <div className="mx-auto max-w-[560px] space-y-4">
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy-800/70">Padre</p>
                {padre ?
              <TarjetaPersona
                persona={padre}
                onCambiar={() => setSelectorAbierto('padre')}
                onQuitar={() => setIdPadre(null)}
                onVerRelaciones={() => setRelacionesDe(padre)} /> :


              <button
                type="button"
                onClick={() => setSelectorAbierto('padre')}
                className="flex w-full items-center justify-center gap-1.5 rounded-[2px] border border-dashed border-navy-600/40 px-2 py-2 text-[12px] font-semibold text-navy-800 hover:bg-white">

                    <SearchIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                    Seleccionar padre
                  </button>
              }
              </div>

              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy-800/70">Madre</p>
                {madre ?
              <TarjetaPersona
                persona={madre}
                onCambiar={() => setSelectorAbierto('madre')}
                onQuitar={() => setIdMadre(null)}
                onVerRelaciones={() => setRelacionesDe(madre)} /> :


              <button
                type="button"
                onClick={() => setSelectorAbierto('madre')}
                className="flex w-full items-center justify-center gap-1.5 rounded-[2px] border border-dashed border-navy-600/40 px-2 py-2 text-[12px] font-semibold text-navy-800 hover:bg-white">

                    <SearchIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                    Seleccionar madre
                  </button>
              }
              </div>

              {errorPadreMadre && <Banner nivel="error" texto={errorPadreMadre.mensaje} />}

              <div className="grid grid-cols-2 gap-2">
                <FilaCampo etiqueta="Tipo de unión:">
                  <select value={union} onChange={(e) => setUnion(e.target.value as TipoUnion)} className={`${campoInput} w-full`}>
                    {TIPOS_UNION.map((u) =>
                  <option key={u} value={u}>
                        {u}
                      </option>
                  )}
                  </select>
                </FilaCampo>
                <FilaCampo etiqueta="Fecha de unión:">
                  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={campoInput} />
                </FilaCampo>
              </div>

              {avisoFecha && <Banner nivel="aviso" texto={avisoFecha.mensaje} />}

              <Banner
              nivel="info"
              texto="Hermanos, tíos, sobrinos, abuelos y nietos no se registran aquí: el sistema los calcula a partir del padre y la madre." />

            </div>
          }

          {pestana === 'integrantes' &&
          <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-800/70">
                  Integrantes de la familia
                </p>
                <button
                type="button"
                onClick={() => setSelectorAbierto('integrante')}
                disabled={editandoIntegranteId !== null}
                className="flex items-center gap-1.5 rounded-[2px] border border-navy-600/40 bg-sky-100 px-2 py-1 text-[11px] font-semibold text-navy-800 hover:bg-sky-100 disabled:cursor-not-allowed disabled:text-navy-900/30 disabled:hover:bg-sky-100">

                  <UserPlusIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Asociar integrante
                </button>
              </div>

              {errorIntegrante && <Banner nivel="error" texto={errorIntegrante} />}

              {personaPendiente &&
            <div className="flex flex-wrap items-end gap-2 rounded-[2px] border border-amber-deep/50 bg-amber-soft p-2">
                  <PersonaAvatar persona={personaPendiente} activo />
                  <span className="mr-2 text-[12px] font-medium text-navy-900">{nombreCompleto(personaPendiente)}</span>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[10.5px] text-navy-800/70">Tipo de integrante</label>
                    <select
                  value={tipoIntegrantePendiente}
                  onChange={(e) => setTipoIntegrantePendiente(e.target.value as TipoIntegrante)}
                  className={campoInput}>

                      {TIPOS_INTEGRANTE.map((t) =>
                  <option key={t} value={t}>
                          {t}
                        </option>
                  )}
                    </select>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[10.5px] text-navy-800/70">Filiación</label>
                    <select
                  value={filiacionPendiente}
                  onChange={(e) => setFiliacionPendiente(e.target.value as Filiacion)}
                  className={campoInput}>

                      {FILIACIONES.map((f) =>
                  <option key={f} value={f}>
                          {f}
                        </option>
                  )}
                    </select>
                  </div>
                  <button
                type="button"
                onClick={confirmarAsociarIntegrante}
                className="rounded-[2px] border border-amber-deep bg-amber-accent px-2 py-1 text-[11px] font-semibold text-navy-900 hover:bg-amber-deep hover:text-white">

                    Asociar
                  </button>
                  <button
                type="button"
                onClick={() => setPersonaPendiente(null)}
                className="rounded-[2px] border border-navy-600/30 bg-white px-2 py-1 text-[11px] text-navy-800 hover:bg-sky-50">

                    Cancelar
                  </button>
                </div>
            }

              {integrantes.length === 0 ?
            <p className="rounded-[2px] border border-dashed border-navy-600/30 bg-white px-3 py-4 text-center text-[12px] italic text-navy-800/50">
                  Esta familia todavía no tiene integrantes asociados.
                </p> :

            <div className="overflow-x-auto rounded-[2px] border border-navy-600/20 bg-white">
                  <table className="w-full text-left text-[11.5px]">
                    <thead>
                      <tr className="bg-sky-100 text-navy-800">
                        <th className="px-2 py-1.5 font-semibold">Integrante</th>
                        <th className="px-2 py-1.5 font-semibold">Relación</th>
                        <th className="px-2 py-1.5 font-semibold">Filiación</th>
                        <th className="px-2 py-1.5 font-semibold">Documento</th>
                        <th className="px-2 py-1.5 font-semibold">No. documento</th>
                        <th className="px-2 py-1.5 font-semibold">Fecha nac.</th>
                        <th className="px-2 py-1.5 font-semibold">País</th>
                        <th className="px-2 py-1.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {integrantes.map((i) => {
                    const persona = porId.get(i.idPersona);
                    const enEdicion = editandoIntegranteId === i.id;
                    return (
                      <tr key={i.id} className={['border-t border-sky-100', enEdicion ? 'bg-amber-soft/50' : ''].join(' ')}>
                            <td className="px-2 py-1.5">
                              {persona &&
                          <span className="flex items-center gap-1.5">
                                  <PersonaAvatar persona={persona} tamano="sm" />
                                  <span className="font-medium text-navy-900">{nombreCompleto(persona)}</span>
                                </span>
                          }
                            </td>
                            <td className="px-2 py-1.5">
                              {enEdicion ?
                          <select
                            value={tipoIntegrantePendiente}
                            onChange={(e) => setTipoIntegrantePendiente(e.target.value as TipoIntegrante)}
                            className={campoInput}>

                                  {TIPOS_INTEGRANTE.map((t) =>
                            <option key={t} value={t}>
                                      {t}
                                    </option>
                            )}
                                </select> :

                          i.tipoIntegrante
                          }
                            </td>
                            <td className="px-2 py-1.5">
                              {enEdicion ?
                          <select
                            value={filiacionPendiente}
                            onChange={(e) => setFiliacionPendiente(e.target.value as Filiacion)}
                            className={campoInput}>

                                  {FILIACIONES.map((f) =>
                            <option key={f} value={f}>
                                      {f}
                                    </option>
                            )}
                                </select> :

                          i.filiacion
                          }
                            </td>
                            <td className="px-2 py-1.5 text-navy-800">{persona?.tipoDocumento}</td>
                            <td className="px-2 py-1.5 text-navy-800">{persona?.numeroDocumento}</td>
                            <td className="px-2 py-1.5 text-navy-800">
                              {persona ? formatoFechaCorta(persona.fechaNacimiento) : ''}
                            </td>
                            <td className="px-2 py-1.5 text-navy-800">{persona?.paisNacimiento}</td>
                            <td className="px-2 py-1.5">
                              <div className="flex items-center gap-0.5">
                                {enEdicion ?
                            <button
                              type="button"
                              onClick={guardarEdicionIntegrante}
                              className="rounded-[2px] px-1.5 py-1 text-[10.5px] font-semibold text-navy-800 hover:bg-sky-100">

                                    Guardar
                                  </button> :

                            <>
                                    {persona &&
                              <button
                                type="button"
                                onClick={() => setRelacionesDe(persona)}
                                title="Ver relaciones familiares"
                                className="rounded-[2px] p-1 text-navy-700 hover:bg-sky-100">

                                        <NetworkIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                                      </button>
                              }
                                    <button
                                type="button"
                                onClick={() => editarIntegrante(i)}
                                title="Editar"
                                className="rounded-[2px] p-1 text-navy-700 hover:bg-sky-100">

                                      <PencilIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                                    </button>
                                  </>
                            }
                                <button
                              type="button"
                              onClick={() => quitarIntegrante(i.id)}
                              title="Quitar de la familia"
                              className="rounded-[2px] p-1 text-[#B33A2B] hover:bg-[#FBE7E3]">

                                  <Trash2Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                                </button>
                              </div>
                            </td>
                          </tr>);

                  })}
                    </tbody>
                  </table>
                </div>
            }
              <p className="text-[10.5px] text-navy-800/50">
                Solo se asocian personas ya registradas en el padrón. El padre y la madre no se listan aquí: se
                definen en «Familia conformada».
              </p>
            </div>
          }

          {pestana === 'ficha' &&
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <FileTextIcon className="h-8 w-8 text-navy-600/40" strokeWidth={1.5} />
              <p className="max-w-[360px] text-[12px] text-navy-800/70">
                Genere el documento consolidado para archivo parroquial con los datos actuales del formulario.
              </p>
              <button
              type="button"
              onClick={() => setFichaAbierta(true)}
              className="flex items-center gap-1.5 rounded-[2px] border border-amber-deep bg-amber-accent px-3 py-1.5 text-[12px] font-semibold text-navy-900 hover:bg-amber-deep hover:text-white">

                <FileTextIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                Ver ficha familiar
              </button>
            </div>
          }
        </div>
      </motion.form>

      {selectorAbierto &&
      <SeleccionarPersonaDialog
        titulo={
        selectorAbierto === 'padre' ?
        'Seleccionar padre' :
        selectorAbierto === 'madre' ?
        'Seleccionar madre' :
        'Asociar integrante'}

        subtitulo="Vincula una persona ya registrada con la familia."
        personas={personas}
        onSeleccionar={alSeleccionarPersona}
        onRegistrarNueva={(datos) => alSeleccionarPersona(registrarPersona(datos))}
        onCerrar={() => setSelectorAbierto(null)} />

      }

      {relacionesDe &&
      <RelacionesFamiliaresDialog persona={relacionesDe} personas={personas} onCerrar={() => setRelacionesDe(null)} />
      }

      {fichaAbierta &&
      <FamiliaFichaDialog familia={construirFamilia()} personas={personas} onCerrar={() => setFichaAbierta(false)} />
      }
    </div>);

}
