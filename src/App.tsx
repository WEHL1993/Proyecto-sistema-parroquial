import { useState } from 'react';
import { Login } from './pages/Login';
import { Agenda } from './pages/Agenda';
import { Personas } from './pages/Personas';
import { useScreenInit } from './useScreenInit.js';

type Vista = 'login' | 'agenda' | 'personas';

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

  if (vista === 'personas') {
    return (
      <Personas
        usuario={`P. Andrés Chocoj (${usuario})`}
        onVolverAgenda={() => setVista('agenda')}
        onCerrarSesion={() => setVista('login')} />);
  }

  return (
    <Agenda
      usuario={`P. Andrés Chocoj (${usuario})`}
      onAbrirPersonas={() => setVista('personas')}
      onCerrarSesion={() => setVista('login')} />);


}