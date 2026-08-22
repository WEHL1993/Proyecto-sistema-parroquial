import React, { useState } from 'react';
import { Login } from './pages/Login';
import { Agenda } from './pages/Agenda';
import { Familias } from './pages/Familias';
import { ModuloEnConstruccion } from './pages/ModuloEnConstruccion';
import { useScreenInit } from './useScreenInit.js';

type Vista = 'login' | 'app';

export function App() {
  const screenInit = useScreenInit();
  const [vista, setVista] = useState<Vista>(
    screenInit.vista === 'login' ? 'login' : 'app'
  );
  const [usuario, setUsuario] = useState('administrador');
  const [moduloId, setModuloId] = useState<string>(
    screenInit.vista === 'agenda' || screenInit.vista === 'familias' ? screenInit.vista : 'agenda'
  );

  if (vista === 'login') {
    return (
      <Login
        onIngresar={(nombre) => {
          setUsuario(nombre);
          setVista('app');
        }} />);


  }

  const usuarioMostrado = `P. Andrés Chocoj (${usuario})`;
  const onCerrarSesion = () => setVista('login');

  if (moduloId === 'agenda') {
    return (
      <Agenda
        usuario={usuarioMostrado}
        onCerrarSesion={onCerrarSesion}
        onSeleccionarModulo={setModuloId} />);


  }

  if (moduloId === 'familias') {
    return (
      <Familias
        usuario={usuarioMostrado}
        onCerrarSesion={onCerrarSesion}
        onSeleccionarModulo={setModuloId} />);


  }

  return (
    <ModuloEnConstruccion
      moduloId={moduloId}
      usuario={usuarioMostrado}
      onCerrarSesion={onCerrarSesion}
      onSeleccionarModulo={setModuloId} />);


}
