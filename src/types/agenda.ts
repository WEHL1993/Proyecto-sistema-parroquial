export type Prioridad = 'Baja' | 'Media' | 'Alta';

export type Recordatorio = '15 min' | '30 min' | '1 hora' | '1 día' | 'Sin recordatorio';

export type VistaAgenda = 'dia' | 'laboral' | 'semana' | 'mes';

export type DiaSemana =
'domingo' |
'lunes' |
'martes' |
'miercoles' |
'jueves' |
'viernes' |
'sabado';

export type TipoPeriodicidad = 'diaria' | 'semanal' | 'mensual' | 'anual';
export type FinPeriodicidad = 'sinFin' | 'ocurrencias' | 'hastaFecha';

export interface PeriodicidadConfig {
  desde: string;
  hasta: string;
  tipo: TipoPeriodicidad;
  cadaSemanas: number;
  dias: DiaSemana[];
  inicio: string;
  finTipo: FinPeriodicidad;
  ocurrencias: number;
  hastaFecha: string;
}

export interface Appointment {
  id: string;
  asunto: string;
  lugar: string;
  inicio: string;
  fin: string;
  prioridad: Prioridad;
  recordatorio: Recordatorio;
  observaciones: string;
  cancelada?: boolean;
  todoDia?: boolean;
  periodicidad?: PeriodicidadConfig;
}

export interface ModuloSistema {
  id: string;
  nombre: string;
}