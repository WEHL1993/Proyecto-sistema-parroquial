import { Persona } from '../types/persona';

export const personasIniciales: Persona[] = [
// Abuelos paternos de Sofía Chávez Ixcot
{ id: 'p-abuelo-chavez', nombres: 'Pedro', apellidos: 'Chávez Us', sexo: 'M', fechaNacimiento: '1945-03-12', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '1101 22345 0101', idPadre: null, idMadre: null },
{ id: 'p-abuela-chavez', nombres: 'Elena', apellidos: 'Us de Chávez', sexo: 'F', fechaNacimiento: '1948-07-30', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '1101 22346 0101', idPadre: null, idMadre: null },

// Abuelos maternos de Sofía — también son padre y madre de la Familia Ixcot Chávez
{ id: 'p-manuel-ixcot', nombres: 'Manuel', apellidos: 'Ixcot', sexo: 'M', fechaNacimiento: '1962-03-17', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '2205 41298 0101', idPadre: null, idMadre: null },
{ id: 'p-rosa-chavez-ixcot', nombres: 'Rosa', apellidos: 'Chávez de Ixcot', sexo: 'F', fechaNacimiento: '1964-11-02', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '2205 41299 0101', idPadre: null, idMadre: null },

// Padres de Sofía — Familia Chávez Ixcot
{ id: 'p-rodolfo', nombres: 'Rodolfo', apellidos: 'Chávez', sexo: 'M', fechaNacimiento: '1970-02-11', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '1101 55678 0101', idPadre: 'p-abuelo-chavez', idMadre: 'p-abuela-chavez' },
{ id: 'p-marta-ixcot', nombres: 'Marta', apellidos: 'Ixcot de Chávez', sexo: 'F', fechaNacimiento: '1973-06-25', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '2205 55679 0101', idPadre: 'p-manuel-ixcot', idMadre: 'p-rosa-chavez-ixcot' },

// Tía de Sofía (hermana de Marta) — integrante de la Familia Ixcot Chávez
{ id: 'p-elena-ixcot', nombres: 'Elena', apellidos: 'Ixcot Chávez', sexo: 'F', fechaNacimiento: '1992-08-30', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '2205 66780 0101', idPadre: 'p-manuel-ixcot', idMadre: 'p-rosa-chavez-ixcot' },

// Sofía y su hermano Samuel — integrantes de la Familia Chávez Ixcot
{ id: 'p-sofia', nombres: 'Sofía', apellidos: 'Chávez Ixcot', sexo: 'F', fechaNacimiento: '1999-09-02', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '3012 77841 0101', idPadre: 'p-rodolfo', idMadre: 'p-marta-ixcot' },
{ id: 'p-samuel', nombres: 'Samuel', apellidos: 'Chávez Ixcot', sexo: 'M', fechaNacimiento: '2002-01-19', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '3012 77842 0101', idPadre: 'p-rodolfo', idMadre: 'p-marta-ixcot' },

// Esposa de Samuel y su hija — sobrina de Sofía (no forman una ficha de familia propia todavía)
{ id: 'p-beatriz-lopez', nombres: 'Beatriz', apellidos: 'López', sexo: 'F', fechaNacimiento: '2003-04-14', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '3012 88123 0101', idPadre: null, idMadre: null },
{ id: 'p-emma', nombres: 'Emma', apellidos: 'Chávez López', sexo: 'F', fechaNacimiento: '2023-05-03', paisNacimiento: 'Guatemala', tipoDocumento: 'Partida de nacimiento', numeroDocumento: 'P-2023-1187', idPadre: 'p-samuel', idMadre: 'p-beatriz-lopez' },

// Familia Pérez Similox
{ id: 'p-julio-perez', nombres: 'Julio', apellidos: 'Pérez', sexo: 'M', fechaNacimiento: '1988-01-30', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '1102 33445 0101', idPadre: null, idMadre: null },
{ id: 'p-ana-similox-perez', nombres: 'Ana Lucía', apellidos: 'Similox de Pérez', sexo: 'F', fechaNacimiento: '1990-03-14', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '2206 33446 0101', idPadre: null, idMadre: null },
{ id: 'p-mateo-perez', nombres: 'Mateo', apellidos: 'Pérez Similox', sexo: 'M', fechaNacimiento: '2016-05-19', paisNacimiento: 'Guatemala', tipoDocumento: 'Partida de nacimiento', numeroDocumento: 'P-2016-3321', idPadre: 'p-julio-perez', idMadre: 'p-ana-similox-perez' },

// Familia Xocop Morales
{ id: 'p-efrain-xocop', nombres: 'Efraín', apellidos: 'Xocop', sexo: 'M', fechaNacimiento: '1965-12-03', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '1103 11002 0101', idPadre: null, idMadre: null },
{ id: 'p-marta-xocop', nombres: 'Marta', apellidos: 'Xocop', sexo: 'F', fechaNacimiento: '1968-07-16', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '2207 11003 0101', idPadre: null, idMadre: null },

// Familia Morales Ixchop
{ id: 'p-francisco-morales', nombres: 'Francisco', apellidos: 'Morales', sexo: 'M', fechaNacimiento: '1982-10-08', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '1104 22011 0101', idPadre: null, idMadre: null },
{ id: 'p-delfina-ixchop', nombres: 'Delfina', apellidos: 'Ixchop de Morales', sexo: 'F', fechaNacimiento: '1985-04-29', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '2208 22012 0101', idPadre: null, idMadre: null },
{ id: 'p-diego-morales', nombres: 'Diego', apellidos: 'Morales Ixchop', sexo: 'M', fechaNacimiento: '2011-01-20', paisNacimiento: 'Guatemala', tipoDocumento: 'Partida de nacimiento', numeroDocumento: 'P-2011-7765', idPadre: 'p-francisco-morales', idMadre: 'p-delfina-ixchop' },
{ id: 'p-valeria-morales', nombres: 'Valeria', apellidos: 'Morales Ixchop', sexo: 'F', fechaNacimiento: '2013-07-11', paisNacimiento: 'Guatemala', tipoDocumento: 'Partida de nacimiento', numeroDocumento: 'P-2013-8842', idPadre: 'p-francisco-morales', idMadre: 'p-delfina-ixchop' },

// Familia Similox Cuc
{ id: 'p-pedro-similox', nombres: 'Pedro', apellidos: 'Similox', sexo: 'M', fechaNacimiento: '1979-05-05', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '1105 33221 0101', idPadre: null, idMadre: null },
{ id: 'p-juana-cuc', nombres: 'Juana', apellidos: 'Cuc de Similox', sexo: 'F', fechaNacimiento: '1981-09-09', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '2209 33222 0101', idPadre: null, idMadre: null },

// Familia Chávez Morales — caso monoparental (padre no registrado)
{ id: 'p-rosa-morales', nombres: 'Rosa', apellidos: 'Morales', sexo: 'F', fechaNacimiento: '1984-12-01', paisNacimiento: 'Guatemala', tipoDocumento: 'DPI', numeroDocumento: '2210 44556 0101', idPadre: null, idMadre: null },
{ id: 'p-ana-lucia-morales', nombres: 'Ana Lucía', apellidos: 'Chávez Morales', sexo: 'F', fechaNacimiento: '2018-02-27', paisNacimiento: 'Guatemala', tipoDocumento: 'Partida de nacimiento', numeroDocumento: 'P-2018-9903', idPadre: null, idMadre: 'p-rosa-morales' }];
