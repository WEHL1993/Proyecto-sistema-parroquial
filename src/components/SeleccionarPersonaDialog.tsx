import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XIcon, SearchIcon, UserPlusIcon } from 'lucide-react';
import { Persona, Sexo, TipoDocumento, nombreCompleto } from '../types/persona';
import { buscarPersonas } from '../utils/personas';
import { formatoFechaCorta } from '../utils/fecha';

interface SeleccionarPersonaDialogProps {
  titulo: string;
  subtitulo?: string;
  personas: Persona[];
  onSeleccionar: (persona: Persona) => void;
  onRegistrarNueva: (persona: Omit<Persona, 'id'>) => void;
  onCerrar: () => void;
}

const TIPOS_DOCUMENTO: TipoDocumento[] = ['DPI', 'Partida de nacimiento', 'Pasaporte', 'Sin documento'];

const campoInput =
'rounded-[2px] border border-navy-600/40 bg-sky-100 px-2 py-1 text-[12px] text-navy-900 outline-none transition-colors duration-150 ease-out focus:border-amber-accent focus:ring-1 focus:ring-amber-accent';

export function SeleccionarPersonaDialog({
  titulo,
  subtitulo,
  personas,
  onSeleccionar,
  onRegistrarNueva,
  onCerrar
}: SeleccionarPersonaDialogProps) {
  const [consulta, setConsulta] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [sexo, setSexo] = useState<Sexo>('F');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('DPI');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [paisNacimiento, setPaisNacimiento] = useState('Guatemala');

  const resultados = buscarPersonas(personas, consulta);

  function registrar() {
    if (!nombres.trim() || !apellidos.trim()) return;
    onRegistrarNueva({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      sexo,
      fechaNacimiento,
      paisNacimiento: paisNacimiento.trim() || 'Guatemala',
      tipoDocumento,
      numeroDocumento: numeroDocumento.trim(),
      idPadre: null,
      idMadre: null
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
        className="flex max-h-[88vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[3px] border border-navy-700 bg-sky-50 shadow-dialog">

        <div className="flex shrink-0 items-center justify-between bg-navy-800 px-3 py-1.5">
          <span className="text-[12px] font-semibold text-white">{titulo}</span>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-[2px] p-0.5 text-sky-200 transition-colors duration-150 ease-out hover:bg-[#B33A2B] hover:text-white">

            <XIcon className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {subtitulo &&
        <p className="shrink-0 border-b border-sky-300 bg-sky-100 px-3 py-1.5 text-[11px] text-navy-800/70">
            {subtitulo}
          </p>
        }

        <div className="shrink-0 border-b border-sky-300 bg-sky-100 p-2">
          <div className="flex items-center gap-1.5 rounded-[2px] border border-navy-600/40 bg-white px-2 py-1">
            <SearchIcon className="h-3.5 w-3.5 shrink-0 text-navy-600" strokeWidth={1.8} />
            <input
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Buscar por nombre o documento..."
              autoFocus
              className="flex-1 border-0 bg-transparent text-[12px] text-navy-900 outline-none" />

          </div>
          <p className="mt-1 text-[10.5px] text-navy-800/60">
            {resultados.length} resultado{resultados.length === 1 ? '' : 's'} · solo personas existentes en el padrón
          </p>
        </div>

        <div className="min-h-[120px] flex-1 overflow-y-auto p-2">
          {resultados.length === 0 ?
          <p className="px-2 py-4 text-center text-[11px] italic text-navy-800/50">
              No se encontraron coincidencias. Registre la persona antes de asociarla.
            </p> :

          <ul className="space-y-1">
              {resultados.map((p) =>
            <li key={p.id}>
                  <button
                type="button"
                onClick={() => onSeleccionar(p)}
                className="flex w-full items-center gap-2.5 rounded-[2px] border border-navy-600/20 bg-white px-2 py-1.5 text-left transition-colors duration-150 ease-out hover:border-amber-accent hover:bg-amber-soft/40">

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-200 text-[10px] font-semibold text-navy-800">
                      {(p.nombres.charAt(0) + p.apellidos.charAt(0)).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-medium text-navy-900">
                        {nombreCompleto(p)}
                      </span>
                      <span className="block text-[10.5px] text-navy-800/60">
                        {p.tipoDocumento}
                        {p.numeroDocumento ? ` ${p.numeroDocumento}` : ''} · {formatoFechaCorta(p.fechaNacimiento)}
                      </span>
                    </span>
                  </button>
                </li>
            )}
            </ul>
          }
        </div>

        <div className="shrink-0 border-t border-sky-400 bg-sky-100 p-2">
          {!registrando ?
          <button
            type="button"
            onClick={() => setRegistrando(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-[2px] border border-dashed border-navy-600/40 px-2 py-1.5 text-[11px] font-semibold text-navy-800 transition-colors duration-150 ease-out hover:bg-sky-50">

              <UserPlusIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
              Registrar nueva persona
            </button> :

          <div className="space-y-1.5 rounded-[2px] border border-navy-600/20 bg-white p-2">
              <div className="grid grid-cols-2 gap-1.5">
                <input
                placeholder="Nombres"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                className={campoInput} />

                <input
                placeholder="Apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className={campoInput} />

              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <select value={sexo} onChange={(e) => setSexo(e.target.value as Sexo)} className={campoInput}>
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                </select>
                <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className={campoInput} />

                <input
                placeholder="País de nacimiento"
                value={paisNacimiento}
                onChange={(e) => setPaisNacimiento(e.target.value)}
                className={campoInput} />

              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
                className={campoInput}>

                  {TIPOS_DOCUMENTO.map((t) =>
                <option key={t} value={t}>
                      {t}
                    </option>
                )}
                </select>
                <input
                placeholder="No. de documento"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                className={campoInput} />

              </div>
              <div className="flex justify-end gap-1.5 pt-1">
                <button
                type="button"
                onClick={() => setRegistrando(false)}
                className="rounded-[2px] border border-navy-600/30 bg-sky-100 px-2 py-1 text-[11px] text-navy-900 hover:bg-sky-100">

                  Cancelar
                </button>
                <button
                type="button"
                onClick={registrar}
                disabled={!nombres.trim() || !apellidos.trim()}
                className="rounded-[2px] border border-amber-deep bg-amber-accent px-2 py-1 text-[11px] font-semibold text-navy-900 hover:bg-amber-deep hover:text-white disabled:cursor-not-allowed disabled:border-navy-600/20 disabled:bg-sky-100 disabled:text-navy-900/40">

                  Registrar y seleccionar
                </button>
              </div>
            </div>
          }
        </div>
      </motion.div>
    </div>);

}
