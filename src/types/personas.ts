export type SexoFiltro = 'Todos' | 'Masculino' | 'Femenino';
export type TipoDocumentoFiltro = 'Todos' | 'Sin Datos' | 'DNI' | 'LE' | 'CI' | 'LC' | 'PAS';
export type RadioParroquialFiltro = 'Todos' | 'Sí' | 'No';

export interface PersonaFormData {
  nombre: string;
  apellido: string;
  apellidoMaterno: string;
  sexo: '' | 'Masculino' | 'Femenino';
  tipoDocumento: Exclude<TipoDocumentoFiltro, 'Todos'>;
  documento: string;
  fechaNacimiento: string;
  localidadNacimiento: string;
  provinciaNacimiento: string;
  paisNacimiento: 'Sin Datos' | 'Guatemala';
  domicilio: string;
  telefonoCasa: string;
  telefonoMovil: string;
  email: string;
  perteneceRadioParroquial: 'Sí' | 'No';
  parroquiaQuePertenece: string;
  observaciones: string;
  foto: File | null;
}