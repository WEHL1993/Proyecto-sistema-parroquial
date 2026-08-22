import React from 'react';
import { Persona, nombreCompleto } from '../types/persona';

function iniciales(persona: Persona): string {
  const nombre = persona.nombres.trim().charAt(0);
  const apellido = persona.apellidos.trim().charAt(0);
  return `${nombre}${apellido}`.toUpperCase();
}

interface PersonaAvatarProps {
  persona: Persona;
  activo?: boolean;
  tamano?: 'sm' | 'md';
}

export function PersonaAvatar({ persona, activo = false, tamano = 'md' }: PersonaAvatarProps) {
  const clasePorTamano = tamano === 'sm' ? 'h-6 w-6 text-[9px]' : 'h-8 w-8 text-[11px]';
  return (
    <span
      title={nombreCompleto(persona)}
      className={[
      'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
      clasePorTamano,
      activo ? 'bg-amber-accent text-navy-900' : 'bg-navy-200 text-navy-800'].
      join(' ')}>

      {iniciales(persona)}
    </span>);

}
