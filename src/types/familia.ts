export type TipoUnion =
'Matrimonio canónico' |
'Matrimonio civil' |
'Unión de hecho' |
'Sin unión formal';

export type TipoResidencia = 'Casa propia' | 'Alquilada' | 'Prestada' | 'Otro';

export type TipoIntegrante = 'Hijo' | 'Hija' | 'Otro';

export type Filiacion = 'Legítima' | 'Natural' | 'Adoptiva';

export interface IntegranteFamilia {
  id: string;
  idPersona: string;
  tipoIntegrante: TipoIntegrante;
  filiacion: Filiacion;
}

export interface Familia {
  id: string;
  nombre: string;
  tipoResidencia: TipoResidencia;
  domicilio: string;
  localidad: string;
  codigoPostal: string;
  provincia: string;
  pais: string;
  telefono: string;
  email: string;
  enRadioParroquial: boolean;
  idPadre: string | null;
  idMadre: string | null;
  union: TipoUnion;
  fecha: string;
  observaciones: string;
  integrantes: IntegranteFamilia[];
}

/** Familia con los campos de persona resueltos a texto, usada por la tabla, el filtro y la exportación. */
export interface FamiliaVista extends Familia {
  padre: string;
  madre: string;
  totalIntegrantes: number;
}

export type VistaFamilias = 'sencilla' | 'detallada' | 'integrantes';

export type CampoFamilia =
'nombre' |
'padre' |
'madre' |
'union' |
'fecha' |
'tipoResidencia' |
'domicilio' |
'localidad' |
'codigoPostal' |
'provincia' |
'pais' |
'telefono' |
'email' |
'enRadioParroquial' |
'observaciones' |
'totalIntegrantes' |
'id';

export type OperadorFiltro =
'igual' |
'noEsIgual' |
'contiene' |
'mayorQue' |
'mayorOIgualA' |
'menorQue' |
'menorOIgualA' |
'esVacio' |
'noEsVacio';

export interface CriterioFiltro {
  id: string;
  conector: 'Y' | 'O';
  campo: CampoFamilia | '';
  operador: OperadorFiltro;
  valor: string;
}

export type PosicionVistaPrevia = 'desactivado' | 'abajo' | 'derecha';
