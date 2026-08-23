import { motion } from 'framer-motion';
import { AlertTriangleIcon } from 'lucide-react';

interface ConfirmDialogProps {
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({
  titulo,
  mensaje,
  textoConfirmar,
  onConfirmar,
  onCancelar
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-4"
      role="alertdialog"
      aria-modal="true"
      aria-label={titulo}>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[420px] overflow-hidden rounded-[3px] border border-navy-700 bg-sky-50 shadow-dialog">
        
        <div className="bg-navy-800 px-3 py-1.5 text-[12px] font-semibold text-white">
          {titulo}
        </div>
        <div className="flex gap-3 px-4 py-4">
          <AlertTriangleIcon className="h-6 w-6 shrink-0 text-amber-deep" strokeWidth={1.8} />
          <p className="text-[12px] leading-relaxed text-navy-900">{mensaje}</p>
        </div>
        <div className="flex justify-end gap-2 border-t border-sky-400 bg-sky-100 px-3 py-2">
          <button
            type="button"
            onClick={onCancelar}
            className="min-w-[92px] rounded-[2px] border border-navy-600/50 bg-sky-100 px-3 py-1 text-[12px] text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-100">
            
            No, volver
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="min-w-[92px] rounded-[2px] border border-[#8E2B1E] bg-[#B33A2B] px-3 py-1 text-[12px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-[#9C3123]">
            
            {textoConfirmar}
          </button>
        </div>
      </motion.div>
    </div>);

}