import React from 'react';
import { CheckIcon, XIcon, LayersIcon, XCircleIcon } from 'lucide-react';
import { CampoFamilia, CriterioFiltro, OperadorFiltro } from '../types/familia';
import { CAMPOS_FILTRO, ETIQUETA_CAMPO, ETIQUETA_OPERADOR, OPERADORES_FILTRO } from '../utils/familias';

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface FamiliaFilterPanelProps {
  letra: string;
  onCambiarLetra: (letra: string) => void;
  criterios: CriterioFiltro[];
  onCambiarCriterios: (criterios: CriterioFiltro[]) => void;
  panelFiltroVisible: boolean;
  camposAgrupados: CampoFamilia[];
  onAbrirAgrupar: () => void;
  onQuitarAgrupamiento: (campo: CampoFamilia) => void;
}

const selectClase =
'rounded-[2px] border border-navy-600/30 bg-white px-1.5 py-1 text-[11px] text-navy-900 outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent';
const inputClase =
'flex-1 rounded-[2px] border border-navy-600/30 bg-white px-1.5 py-1 text-[11px] text-navy-900 outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent';

export function FamiliaFilterPanel({
  letra,
  onCambiarLetra,
  criterios,
  onCambiarCriterios,
  panelFiltroVisible,
  camposAgrupados,
  onAbrirAgrupar,
  onQuitarAgrupamiento
}: FamiliaFilterPanelProps) {
  function agregarCriterio() {
    onCambiarCriterios([
    ...criterios,
    { id: `crit-${Date.now()}`, conector: 'Y', campo: '', operador: 'igual', valor: '' }]
    );
  }

  function actualizarCriterio(id: string, cambios: Partial<CriterioFiltro>) {
    onCambiarCriterios(criterios.map((c) => c.id === id ? { ...c, ...cambios } : c));
  }

  function quitarCriterio(id: string) {
    onCambiarCriterios(criterios.filter((c) => c.id !== id));
  }

  return (
    <div className="shrink-0 border-b border-sky-400 bg-sky-100">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5">
        <span className="mr-1 text-[11px] font-semibold text-navy-800">Filtro por nombre:</span>
        <button
          type="button"
          onClick={() => onCambiarLetra('<>AZ')}
          className={[
          'rounded-[2px] border px-2 py-0.5 text-[11px] font-semibold transition-colors duration-150 ease-out',
          letra === '<>AZ' ?
          'border-amber-deep/60 bg-amber-soft text-navy-900' :
          'border-navy-600/30 bg-white text-navy-800 hover:bg-sky-50'].
          join(' ')}>

          {'<>AZ'}
        </button>
        <button
          type="button"
          onClick={() => onCambiarLetra('')}
          className={[
          'rounded-[2px] border px-2 py-0.5 text-[11px] transition-colors duration-150 ease-out',
          letra === '' ?
          'border-amber-deep/60 bg-amber-soft text-navy-900 font-semibold' :
          'border-navy-600/30 bg-white text-navy-800 hover:bg-sky-50'].
          join(' ')}>

          A..Z
        </button>
        {LETRAS.map((l) =>
        <button
          key={l}
          type="button"
          onClick={() => onCambiarLetra(l)}
          className={[
          'h-6 w-6 rounded-[2px] border text-[11px] transition-colors duration-150 ease-out',
          letra === l ?
          'border-amber-deep/60 bg-amber-soft font-semibold text-navy-900' :
          'border-navy-600/30 bg-white text-navy-800 hover:bg-sky-50'].
          join(' ')}>

            {l}
          </button>
        )}
      </div>

      {panelFiltroVisible &&
      <div className="border-t border-sky-400 bg-sky-50 px-2 py-2">
          {criterios.length === 0 &&
        <button
          type="button"
          onClick={agregarCriterio}
          className="flex items-center gap-1.5 rounded-[2px] border border-navy-600/30 bg-white px-2 py-1 text-[11px] text-navy-700 transition-colors duration-150 ease-out hover:bg-sky-100">

              Clic aquí para agregar un criterio para filtrar
            </button>
        }
          <div className="space-y-1">
            {criterios.map((c, i) =>
          <div key={c.id} className="flex flex-wrap items-center gap-1.5">
                {i > 0 &&
            <select
              value={c.conector}
              onChange={(e) => actualizarCriterio(c.id, { conector: e.target.value as 'Y' | 'O' })}
              className={selectClase}>

                    <option value="Y">Y</option>
                    <option value="O">O</option>
                  </select>
            }
                <select
              value={c.campo}
              onChange={(e) => actualizarCriterio(c.id, { campo: e.target.value as CampoFamilia })}
              className={selectClase}>

                  <option value="">Elegir Campo</option>
                  {CAMPOS_FILTRO.map((campo) =>
              <option key={campo} value={campo}>
                      {ETIQUETA_CAMPO[campo]}
                    </option>
              )}
                </select>
                <select
              value={c.operador}
              onChange={(e) => actualizarCriterio(c.id, { operador: e.target.value as OperadorFiltro })}
              className={selectClase}>

                  {OPERADORES_FILTRO.map((op) =>
              <option key={op} value={op}>
                      {ETIQUETA_OPERADOR[op]}
                    </option>
              )}
                </select>
                {c.operador !== 'esVacio' && c.operador !== 'noEsVacio' &&
            <input
              value={c.valor}
              onChange={(e) => actualizarCriterio(c.id, { valor: e.target.value })}
              placeholder="Valor..."
              className={inputClase} />

            }
                <span className="flex items-center gap-1">
                  <CheckIcon className="h-4 w-4 text-navy-600/50" strokeWidth={2} />
                  <button
                type="button"
                aria-label="Quitar criterio"
                onClick={() => quitarCriterio(c.id)}
                className="rounded-[2px] p-0.5 text-navy-700 hover:bg-sky-100">

                    <XIcon className="h-4 w-4" strokeWidth={2} />
                  </button>
                </span>
              </div>
          )}
            {criterios.length > 0 &&
          <button
            type="button"
            onClick={agregarCriterio}
            className="mt-1 text-[11px] font-semibold text-navy-700 underline decoration-dotted hover:text-navy-900">

                + Agregar otro criterio
              </button>
          }
          </div>
        </div>
      }

      <button
        type="button"
        onClick={onAbrirAgrupar}
        className="flex w-full flex-wrap items-center gap-1.5 border-t border-sky-400 bg-sky-200/70 px-2 py-1.5 text-left text-[11px] text-navy-800 transition-colors duration-150 ease-out hover:bg-sky-200">

        <LayersIcon className="h-3.5 w-3.5 shrink-0 text-navy-600" strokeWidth={1.8} />
        {camposAgrupados.length === 0 ?
        'Arrastre una columna para agrupar por ella.' :

        camposAgrupados.map((campo) =>
        <span
          key={campo}
          onClick={(e) => {
            e.stopPropagation();
            onQuitarAgrupamiento(campo);
          }}
          className="flex items-center gap-1 rounded-[2px] border border-amber-deep/50 bg-amber-soft px-1.5 py-0.5 font-semibold text-navy-900">

              {ETIQUETA_CAMPO[campo]}
              <XCircleIcon className="h-3 w-3" strokeWidth={2} />
            </span>
        )
        }
      </button>
    </div>);

}
