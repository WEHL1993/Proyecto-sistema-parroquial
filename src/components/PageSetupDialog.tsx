import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { VistaAgenda } from '../types/agenda';

interface PageSetupDialogProps {
  vista: VistaAgenda;
  onCerrar: () => void;
}

const VISTA_TECNICA: Record<VistaAgenda, string> = {
  dia: 'DayView',
  laboral: 'WorkWeekView',
  semana: 'WeekView',
  mes: 'MonthView'
};

type Pestana = 'formato' | 'encabezado';

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

function Previsualizacion() {
  return (
    <div className="mx-auto flex h-[92px] w-[74px] flex-col overflow-hidden rounded-[2px] border border-navy-400 bg-sky-100 shadow-sm">
      <div className="flex shrink-0 items-center gap-1 border-b border-navy-300 bg-sky-100 px-1 py-1">
        <span className="h-2 w-4 rounded-[1px] bg-navy-600" />
        <span className="ml-auto h-2 w-2 rounded-[1px] bg-sky-500" />
        <span className="h-2 w-2 rounded-[1px] bg-sky-500" />
      </div>
      <div className="flex-1 space-y-[3px] px-1.5 py-1.5">
        {Array.from({ length: 7 }).map((_, i) =>
        <div key={i} className="h-[2px] w-full rounded-full bg-sky-200" />
        )}
      </div>
    </div>);

}

export function PageSetupDialog({ vista, onCerrar }: PageSetupDialogProps) {
  const [pestana, setPestana] = useState<Pestana>('formato');
  const [capa, setCapa] = useState('One Page/View');
  const [imprimirDesde, setImprimirDesde] = useState('08:00:00');
  const [imprimirHasta, setImprimirHasta] = useState('20:00:00');
  const [fuenteTitulos, setFuenteTitulos] = useState('24 pt. Tahoma');
  const [fuenteCitas, setFuenteCitas] = useState('8.25 pt. Tahoma');
  const [sombreadoGris, setSombreadoGris] = useState(false);
  const [encabezado, setEncabezado] = useState('');
  const [pie, setPie] = useState('');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Configuración de página">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[600px] overflow-hidden rounded-[3px] border border-navy-300 bg-sky-100 shadow-dialog">
        
        <div className="flex items-center justify-between border-b border-navy-200 bg-sky-100 px-3 py-2">
          <h2 className="text-[13px] font-semibold text-navy-900">Configuración de Página</h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex h-6 w-6 items-center justify-center rounded-[2px] text-navy-700 transition-colors duration-150 ease-out hover:bg-sky-100">
            
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between px-4 pt-3">
          <p className="text-[13px] font-bold text-navy-900">
            Vista Actual:{VISTA_TECNICA[vista]}
          </p>
          <button
            type="button"
            className="rounded-[2px] border border-navy-600/40 bg-sky-100 px-3 py-1 text-[12px] text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-100">
            
            Papel:
          </button>
        </div>

        <div className="flex gap-0.5 px-4 pt-3">
          <button
            type="button"
            onClick={() => setPestana('formato')}
            className={[
            'rounded-t-[3px] border border-b-0 px-4 py-1 text-[12px] transition-colors duration-150 ease-out',
            pestana === 'formato' ?
            'border-navy-300 bg-sky-100 font-semibold text-navy-900' :
            'border-transparent text-navy-700 hover:bg-sky-50'].
            join(' ')}>
            
            Formato:
          </button>
          <button
            type="button"
            onClick={() => setPestana('encabezado')}
            className={[
            'rounded-t-[3px] border border-b-0 px-4 py-1 text-[12px] transition-colors duration-150 ease-out',
            pestana === 'encabezado' ?
            'border-navy-300 bg-sky-100 font-semibold text-navy-900' :
            'border-transparent text-navy-700 hover:bg-sky-50'].
            join(' ')}>
            
            Encabezado/Pie:
          </button>
        </div>

        <div className="border-t border-navy-300">
          {pestana === 'formato' ?
          <div className="flex flex-col gap-4 px-4 py-4">
              <Grupo titulo="Previsualizar">
                <div className="flex justify-center py-1">
                  <Previsualizacion />
                </div>
              </Grupo>

              <div className="grid grid-cols-2 gap-4">
                <Grupo titulo="Opciones">
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center justify-between gap-2 text-[12px] text-navy-900">
                      Capa:
                      <select
                      value={capa}
                      onChange={(e) => setCapa(e.target.value)}
                      className={`${campo} flex-1`}>
                      
                        <option value="One Page/View">One Page/View</option>
                        <option value="Multiple Pages">Multiple Pages</option>
                      </select>
                    </label>
                    <label className="flex items-center justify-between gap-2 text-[12px] text-navy-900">
                      Imprimir desde
                      <input
                      type="time"
                      step={1}
                      value={imprimirDesde}
                      onChange={(e) => setImprimirDesde(e.target.value)}
                      className={`${campo} flex-1`} />
                    
                    </label>
                    <label className="flex items-center justify-between gap-2 text-[12px] text-navy-900">
                      Imprimir hasta
                      <input
                      type="time"
                      step={1}
                      value={imprimirHasta}
                      onChange={(e) => setImprimirHasta(e.target.value)}
                      className={`${campo} flex-1`} />
                    
                    </label>
                  </div>
                </Grupo>

                <Grupo titulo="Fuentes">
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="text-[12px] text-navy-900">Títulos de la fecha</span>
                      <div className="mt-1 flex gap-1.5">
                        <input
                        value={fuenteTitulos}
                        onChange={(e) => setFuenteTitulos(e.target.value)}
                        className={`${campo} flex-1`} />
                      
                        <button
                        type="button"
                        className="rounded-[2px] border border-navy-600/40 bg-sky-100 px-2 py-1 text-[12px] text-navy-900 hover:bg-sky-100">
                        
                          Fuente
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-[12px] text-navy-900">Citas</span>
                      <div className="mt-1 flex gap-1.5">
                        <input
                        value={fuenteCitas}
                        onChange={(e) => setFuenteCitas(e.target.value)}
                        className={`${campo} flex-1`} />
                      
                        <button
                        type="button"
                        className="rounded-[2px] border border-navy-600/40 bg-sky-100 px-2 py-1 text-[12px] text-navy-900 hover:bg-sky-100">
                        
                          Fuente
                        </button>
                      </div>
                    </div>
                  </div>
                </Grupo>
              </div>

              <Grupo titulo="Sombreado">
                <label className="flex items-center gap-2 text-[12px] text-navy-900">
                  <input
                  type="checkbox"
                  checked={sombreadoGris}
                  onChange={(e) => setSombreadoGris(e.target.checked)}
                  className="h-3.5 w-3.5" />
                
                  Impresión usando sombrear gris
                </label>
              </Grupo>
            </div> :

          <div className="flex flex-col gap-3 px-4 py-4">
              <label className="flex flex-col gap-1 text-[12px] text-navy-900">
                Encabezado:
                <input
                value={encabezado}
                onChange={(e) => setEncabezado(e.target.value)}
                placeholder="Office Eclesial — Agenda parroquial"
                className={campo} />
              
              </label>
              <label className="flex flex-col gap-1 text-[12px] text-navy-900">
                Pie de página:
                <input
                value={pie}
                onChange={(e) => setPie(e.target.value)}
                placeholder="Página &amp;p de &amp;P"
                className={campo} />
              
              </label>
            </div>
          }
        </div>

        <div className="flex justify-end gap-2 border-t border-sky-300 bg-sky-50 px-4 py-2.5">
          <button
            type="button"
            onClick={onCerrar}
            className="min-w-[88px] rounded-[2px] border border-navy-600/50 bg-sky-100 px-3 py-1 text-[12px] text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-100">
            
            Cancelar
          </button>
          <button
            type="button"
            onClick={onCerrar}
            className="min-w-[88px] rounded-[2px] border border-navy-900 bg-navy-700 px-3 py-1 text-[12px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-navy-600">
            
            Aceptar
          </button>
        </div>
      </motion.div>
    </div>);

}