import { Appointment } from '../types/agenda';
import { citasIniciales } from '../data/citas';

export async function obtenerCitas(): Promise<Appointment[]> {
  return citasIniciales;
}

export async function guardarCita(cita: Appointment): Promise<Appointment> {
  return cita;
}

export async function eliminarCita(id: string): Promise<void> {
  void id;
}
