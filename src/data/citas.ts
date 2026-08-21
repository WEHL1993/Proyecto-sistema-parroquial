import { Appointment } from '../types/agenda';
import { inicioDeSemana, sumarDias } from '../utils/agenda';

const lunes = inicioDeSemana(new Date());

function enSemana(
diaOffset: number,
hora: number,
minuto: number,
duracionMin: number)
: {inicio: string;fin: string;} {
  const inicio = sumarDias(lunes, diaOffset);
  inicio.setHours(hora, minuto, 0, 0);
  const fin = new Date(inicio.getTime() + duracionMin * 60000);
  return { inicio: inicio.toISOString(), fin: fin.toISOString() };
}

export const citasIniciales: Appointment[] = [
{
  id: 'c-001',
  asunto: 'Reunión de catequistas',
  lugar: 'Salón parroquial San José',
  ...enSemana(0, 9, 0, 90),
  prioridad: 'Media',
  recordatorio: '30 min',
  observaciones:
  'Revisión del plan de formación del segundo ciclo. Confirmar asistencia de la Sra. Marta Xocop.'
},
{
  id: 'c-002',
  asunto: 'Misa de difuntos — familia Chávez',
  lugar: 'Templo parroquial',
  ...enSemana(0, 16, 0, 60),
  prioridad: 'Alta',
  recordatorio: '1 hora',
  observaciones: 'Novenario del Sr. Rodolfo Chávez Ixcot. Coro a cargo del grupo juvenil.'
},
{
  id: 'c-003',
  asunto: 'Bautizo familia Pérez Similox',
  lugar: 'Capilla del Sagrado Corazón',
  ...enSemana(2, 11, 0, 60),
  prioridad: 'Alta',
  recordatorio: '1 día',
  observaciones: 'Padrinos: Julio Similox y Ana Lucía Morales. Pendiente constancia de pláticas.'
},
{
  id: 'c-004',
  asunto: 'Consejo pastoral parroquial',
  lugar: 'Despacho parroquial',
  ...enSemana(3, 15, 30, 120),
  prioridad: 'Media',
  recordatorio: '30 min',
  observaciones: 'Presupuesto de la fiesta patronal y calendario de visitas a comunidades.'
},
{
  id: 'c-005',
  asunto: 'Catequesis de primera comunión',
  lugar: 'Aula 2 — Centro parroquial',
  ...enSemana(1, 8, 30, 90),
  prioridad: 'Baja',
  recordatorio: '15 min',
  observaciones: 'Grupo B, 24 niños inscritos.'
},
{
  id: 'c-006',
  asunto: 'Visita a enfermos — aldea Chuisuc',
  lugar: 'Aldea Chuisuc',
  ...enSemana(4, 9, 30, 180),
  prioridad: 'Media',
  recordatorio: '1 hora',
  observaciones: 'Llevar unción de enfermos. Acompaña el ministro extraordinario Don Efraín.'
},
{
  id: 'c-007',
  asunto: 'Ensayo del coro parroquial',
  lugar: 'Templo parroquial',
  ...enSemana(4, 16, 0, 90),
  prioridad: 'Baja',
  recordatorio: 'Sin recordatorio',
  observaciones: 'Preparación de cantos para la misa dominical de 10:00.'
},
{
  id: 'c-008',
  asunto: 'Misa dominical de 10:00',
  lugar: 'Templo parroquial',
  ...enSemana(6, 10, 0, 75),
  prioridad: 'Alta',
  recordatorio: '1 hora',
  observaciones: 'Presentación de niños. Colecta destinada al fondo de construcción.'
},
{
  id: 'c-009',
  asunto: 'Plática prematrimonial',
  lugar: 'Salón parroquial San José',
  ...enSemana(5, 14, 0, 120),
  prioridad: 'Media',
  recordatorio: '30 min',
  observaciones: 'Cuatro parejas convocadas. Material impreso en secretaría.'
}];