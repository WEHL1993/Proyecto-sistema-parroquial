import { Appointment, Prioridad } from '../types/agenda';

export const HORA_INICIO = 8;
export const HORA_FIN = 18;
export const ALTO_HORA = 56;

export const HORAS: number[] = Array.from(
  { length: HORA_FIN - HORA_INICIO + 1 },
  (_, i) => HORA_INICIO + i
);

export const DIAS_CORTOS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
export const DIAS_LARGOS = [
'lunes',
'martes',
'miércoles',
'jueves',
'viernes',
'sábado',
'domingo'];

export const MESES = [
'enero',
'febrero',
'marzo',
'abril',
'mayo',
'junio',
'julio',
'agosto',
'septiembre',
'octubre',
'noviembre',
'diciembre'];


interface PrioridadStyle {
  barra: string;
  fondo: string;
  borde: string;
  texto: string;
  punto: string;
}

export const ESTILO_PRIORIDAD: Record<Prioridad, PrioridadStyle> = {
  Alta: {
    barra: 'bg-[#B33A2B]',
    fondo: 'bg-[#FBE7E3]',
    borde: 'border-[#D9A79E]',
    texto: 'text-[#7C2318]',
    punto: 'bg-[#B33A2B]'
  },
  Media: {
    barra: 'bg-amber-accent',
    fondo: 'bg-amber-soft',
    borde: 'border-[#E5C48C]',
    texto: 'text-[#7A4708]',
    punto: 'bg-amber-accent'
  },
  Baja: {
    barra: 'bg-navy-600',
    fondo: 'bg-sky-100',
    borde: 'border-sky-300',
    texto: 'text-navy-800',
    punto: 'bg-navy-600'
  }
};

export function mismaFecha(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate());

}

export function inicioDeSemana(fecha: Date): Date {
  const d = new Date(fecha);
  const dia = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dia);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function sumarDias(fecha: Date, dias: number): Date {
  const d = new Date(fecha);
  d.setDate(d.getDate() + dias);
  return d;
}

export function sumarMeses(fecha: Date, meses: number): Date {
  const d = new Date(fecha);
  d.setDate(1);
  d.setMonth(d.getMonth() + meses);
  return d;
}

export function formatoHora(fecha: Date): string {
  return fecha.toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function formatoFechaLarga(fecha: Date): string {
  return `${DIAS_LARGOS[(fecha.getDay() + 6) % 7]} ${fecha.getDate()} de ${
  MESES[fecha.getMonth()]} de ${
  fecha.getFullYear()}`;
}

export function aValorInput(fecha: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${p(fecha.getMonth() + 1)}-${p(
    fecha.getDate()
  )}T${p(fecha.getHours())}:${p(fecha.getMinutes())}`;
}

export function minutosDesdeInicio(fecha: Date): number {
  return (fecha.getHours() - HORA_INICIO) * 60 + fecha.getMinutes();
}

export function citasDelDia(citas: Appointment[], dia: Date): Appointment[] {
  return citas.
  filter((c) => mismaFecha(new Date(c.inicio), dia)).
  sort((a, b) => +new Date(a.inicio) - +new Date(b.inicio));
}

export interface CitaPosicionada {
  cita: Appointment;
  carril: number;
  carriles: number;
}

export function distribuirCarriles(citas: Appointment[]): CitaPosicionada[] {
  const ordenadas = [...citas].sort(
    (a, b) => +new Date(a.inicio) - +new Date(b.inicio)
  );
  const resultado: CitaPosicionada[] = [];
  let grupo: CitaPosicionada[] = [];
  let finGrupo = 0;

  const cerrar = () => {
    const carriles = grupo.reduce((m, g) => Math.max(m, g.carril + 1), 0);
    grupo.forEach((g) => g.carriles = carriles);
    resultado.push(...grupo);
    grupo = [];
  };

  for (const cita of ordenadas) {
    const inicio = +new Date(cita.inicio);
    const fin = +new Date(cita.fin);
    if (grupo.length && inicio >= finGrupo) {
      cerrar();
      finGrupo = 0;
    }
    const usados = new Set(
      grupo.filter((g) => +new Date(g.cita.fin) > inicio).map((g) => g.carril)
    );
    let carril = 0;
    while (usados.has(carril)) carril++;
    grupo.push({ cita, carril, carriles: 1 });
    finGrupo = Math.max(finGrupo, fin);
  }
  if (grupo.length) cerrar();
  return resultado;
}