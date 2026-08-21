import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogInIcon } from 'lucide-react';

interface LoginProps {
  onIngresar: (usuario: string) => void;
}

const etiqueta = 'mb-1.5 block text-[12px] font-semibold text-white';
const campo =
'w-full rounded-[3px] border border-navy-500 bg-navy-800 px-3 py-2 text-[13px] text-white placeholder:text-sky-400/60 outline-none transition-colors duration-150 ease-out focus:border-amber-accent focus:ring-1 focus:ring-amber-accent';

export function Login({ onIngresar }: LoginProps) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);

  function ingresar(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario.trim() || !contrasena.trim()) {
      setError('Complete el usuario y la contraseña para continuar.');
      return;
    }
    setError(null);
    onIngresar(usuario.trim());
  }

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      <section className="flex w-full flex-col justify-center overflow-y-auto bg-navy-900 px-8 py-10 md:w-[38%] md:px-10 lg:px-12">
        <div className="mx-auto w-full max-w-[380px]">
          <h1 className="text-[32px] font-bold leading-tight text-white">
            ¡Hola, Bienvenido!
          </h1>
          <p className="mt-1 text-[13px] text-sky-300">
            Parroquia Santa Cruz, Chiquimulilla
          </p>

          <div className="my-6 h-px bg-navy-700" />

          <h2 className="text-[18px] font-semibold text-white">Iniciar sesión</h2>
          <p className="mt-1 text-[12px] text-sky-400">
            Use las credenciales asignadas por la administración.
          </p>

          <form onSubmit={ingresar} className="mt-5 space-y-4">
            <div>
              <label htmlFor="usuario" className={etiqueta}>
                Usuario
              </label>
              <input
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="administrador"
                autoComplete="username"
                className={campo} />
              
            </div>

            <div>
              <label htmlFor="contrasena" className={etiqueta}>
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={campo} />
              
            </div>

            {error &&
            <p
              role="alert"
              className="rounded-[3px] border border-amber-deep bg-amber-deep/15 px-2.5 py-1.5 text-[12px] text-amber-soft">
              
                {error}
              </p>
            }

            <div className="pt-1">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-[3px] border border-white bg-sky-100 px-3 py-2 text-[13px] font-semibold text-navy-900 transition-colors duration-150 ease-out hover:bg-sky-200">

                <LogInIcon className="h-4 w-4" strokeWidth={1.8} />
                Ingresar
              </button>
            </div>
          </form>

          <p className="mt-8 text-[11px] text-sky-400/70">
            Sistema de gestión parroquial
          </p>
        </div>
      </section>

      <section className="hidden flex-1 items-center justify-center bg-sky-100 p-10 md:flex">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="relative aspect-square w-full max-w-[520px] rounded-full p-[10px]"
          style={{
            background:
            'conic-gradient(from 210deg, #C9971F, #F3DFA2, #B8860B, #F7E7B4, #C9971F)'
          }}>
          
          <div className="h-full w-full overflow-hidden rounded-full border-[6px] border-white shadow-[0_18px_50px_rgba(92,6,27,0.22)]">
            <img
              src="/login-imagen.jpeg"
              alt="Imagen de la parroquia"
              className="h-full w-full object-cover" />
            
          </div>
        </motion.div>
      </section>
    </div>);

}