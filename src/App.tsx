import React, { useState } from 'react';
import { Login } from './pages/Login';
import { Agenda } from './pages/Agenda';
import { useScreenInit } from './useScreenInit.js';

type Vista = 'login' | 'agenda';

export function App() {
  const screenInit = useScreenInit();
  const [vista, setVista] = useState<Vista>(
    screenInit.vista as Vista ?? 'login'
  );
  const [usuario, setUsuario] = useState('administrador');

  if (vista === 'login') {
    return (
      <Login
        onIngresar={(nombre) => {
          setUsuario(nombre);
          setVista('agenda');
        }} />);


  }

  return (
    <Agenda
      usuario={`P. Andrés Chocoj (${usuario})`}
      onCerrarSesion={() => setVista('login')} />);


}