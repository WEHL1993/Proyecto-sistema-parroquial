import React, { useMemo, useState } from 'react';
import { Familia, FamiliaVista, CriterioFiltro, VistaFamilias, CampoFamilia, PosicionVistaPrevia } from '../types/familia';
import { Persona } from '../types/persona';
import { familiasIniciales } from '../data/familias';
import { personasIniciales } from '../data/personas';
import { FamiliaRibbon } from '../components/FamiliaRibbon';
import { FamiliaSidebar } from '../components/FamiliaSidebar';
import { FamiliaFilterPanel } from '../components/FamiliaFilterPanel';
import { FamiliaTable } from '../components/FamiliaTable';
import { FamiliaPreviewPanel } from '../components/FamiliaPreviewPanel';
import { FamiliaDialog } from '../components/FamiliaDialog';
import { FamiliaGroupByDialog } from '../components/FamiliaGroupByDialog';
import { FamiliaSelectorCamposDialog } from '../components/FamiliaSelectorCamposDialog';
import { FamiliaPrintPreviewDialog } from '../components/FamiliaPrintPreviewDialog';
import { FamiliaStatusBar } from '../components/FamiliaStatusBar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { aplicarFiltros, enriquecerFamilia, exportarAExcel } from '../utils/familias';
import { generarIdPersona } from '../utils/personas';

interface FamiliasProps {
  usuario: string;
  onCerrarSesion: () => void;
  onSeleccionarModulo: (id: string) => void;
}

export function Familias({ usuario, onCerrarSesion, onSeleccionarModulo }: FamiliasProps) {
  const [familias, setFamilias] = useState<Familia[]>(familiasIniciales);
  const [personas, setPersonas] = useState<Persona[]>(personasIniciales);
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [pestana, setPestana] = useState<'inicio' | 'impresion'>('inicio');

  const [vistaActual, setVistaActual] = useState<VistaFamilias>('sencilla');
  const [letra, setLetra] = useState('<>AZ');
  const [criterios, setCriterios] = useState<CriterioFiltro[]>([]);
  const [panelFiltroVisible, setPanelFiltroVisible] = useState(false);
  const [groupFields, setGroupFields] = useState<CampoFamilia[]>([]);
  const [camposVisibles, setCamposVisibles] = useState<CampoFamilia[]>([]);
  const [panelVistaPrevia, setPanelVistaPrevia] = useState<PosicionVistaPrevia>('abajo');

  const [dialogo, setDialogo] = useState<
    {modo: 'nuevo';} | {modo: 'editar';familia: Familia;} | null>(
    null);

  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [confirmarSalir, setConfirmarSalir] = useState(false);
  const [vistaPreviaAbierta, setVistaPreviaAbierta] = useState(false);
  const [agruparAbierto, setAgruparAbierto] = useState(false);
  const [selectorCamposAbierto, setSelectorCamposAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const enriquecidas = useMemo(
    () => familias.map((f) => enriquecerFamilia(f, personas)),
    [familias, personas]
  );

  const visibles = useMemo(
    () => aplicarFiltros(enriquecidas, letra, criterios),
    [enriquecidas, letra, criterios]
  );

  const seleccionada: FamiliaVista | null = enriquecidas.find((f) => f.id === seleccionadaId) ?? null;

  function anunciar(texto: string) {
    setMensaje(texto);
    window.setTimeout(() => setMensaje(''), 4000);
  }

  function seleccionarFamilia(f: FamiliaVista) {
    setSeleccionadaId(f.id);
  }

  function abrirNueva() {
    setDialogo({ modo: 'nuevo' });
  }

  function abrirEdicion(f: FamiliaVista) {
    const original = familias.find((fam) => fam.id === f.id);
    if (!original) return;
    setSeleccionadaId(f.id);
    setDialogo({ modo: 'editar', familia: original });
  }

  function guardar(familia: Familia) {
    setFamilias((prev) => {
      const existe = prev.some((f) => f.id === familia.id);
      return existe ? prev.map((f) => f.id === familia.id ? familia : f) : [...prev, familia];
    });
    setSeleccionadaId(familia.id);
    setDialogo(null);
    anunciar(dialogo?.modo === 'editar' ? 'Cambios guardados.' : 'Familia registrada correctamente.');
  }

  function eliminarFamilia() {
    if (!seleccionadaId) return;
    setFamilias((prev) => prev.filter((f) => f.id !== seleccionadaId));
    setSeleccionadaId(null);
    setConfirmarEliminar(false);
    setDialogo(null);
    anunciar('Familia eliminada.');
  }

  function registrarPersona(datos: Omit<Persona, 'id'>): Persona {
    const nueva: Persona = { ...datos, id: generarIdPersona() };
    setPersonas((prev) => [...prev, nueva]);
    return nueva;
  }

  function restaurarValores() {
    setLetra('<>AZ');
    setCriterios([]);
    setPanelFiltroVisible(false);
    setGroupFields([]);
    setCamposVisibles([]);
    setVistaActual('sencilla');
    setPanelVistaPrevia('abajo');
    anunciar('Se restauraron los valores predeterminados de la vista.');
  }

  const layoutFila = panelVistaPrevia === 'derecha';

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-sky-100 font-sans text-navy-900">
      <FamiliaRibbon
        pestana={pestana}
        onPestanaChange={setPestana}
        onNuevo={abrirNueva}
        onEliminar={() => setConfirmarEliminar(true)}
        onActualizar={() => anunciar('Lista de familias actualizada desde el servidor.')}
        onVistaPrevia={() => setVistaPreviaAbierta(true)}
        haySeleccion={Boolean(seleccionada)}
        panelVistaPrevia={panelVistaPrevia}
        onCambiarPanelVistaPrevia={setPanelVistaPrevia}
        onAgrupar={() => setAgruparAbierto(true)}
        onSelectorCampos={() => setSelectorCamposAbierto(true)}
        vistaActual={vistaActual}
        onCambiarVista={setVistaActual}
        onRestaurar={restaurarValores}
        panelFiltroVisible={panelFiltroVisible}
        onTogglePanelFiltro={() => setPanelFiltroVisible((v) => !v)}
        onExportarExcel={() => {
          exportarAExcel(visibles);
          anunciar('Listado exportado a MS Excel.');
        }} />


      <div className="flex min-h-0 flex-1">
        <FamiliaSidebar
          vistaActual={vistaActual}
          onCambiarVista={setVistaActual}
          onCerrarSesion={() => setConfirmarSalir(true)}
          onSeleccionarModulo={onSeleccionarModulo} />


        <main className="flex min-w-0 flex-1 flex-col bg-sky-100">
          <FamiliaFilterPanel
            letra={letra}
            onCambiarLetra={setLetra}
            criterios={criterios}
            onCambiarCriterios={setCriterios}
            panelFiltroVisible={panelFiltroVisible}
            camposAgrupados={groupFields}
            onAbrirAgrupar={() => setAgruparAbierto(true)}
            onQuitarAgrupamiento={(campo) =>
            setGroupFields((prev) => prev.filter((c) => c !== campo))
            } />


          <div className={['min-h-0 flex-1', layoutFila ? 'flex flex-row' : 'flex flex-col'].join(' ')}>
            <div className="min-h-0 min-w-0 flex-1 border-b border-sky-400 bg-white">
              <FamiliaTable
                familias={visibles}
                vistaActual={vistaActual}
                camposVisibles={camposVisibles}
                groupFields={groupFields}
                seleccionadaId={seleccionadaId}
                onSeleccionar={seleccionarFamilia}
                onAbrirEdicion={abrirEdicion} />

            </div>

            {panelVistaPrevia !== 'desactivado' &&
            <div
              className={[
              'shrink-0 border-sky-400 bg-sky-50',
              layoutFila ? 'h-full w-[300px] border-l' : 'h-[220px] w-full border-t'].
              join(' ')}>

                <FamiliaPreviewPanel familia={seleccionada} personas={personas} />
              </div>
            }
          </div>
        </main>
      </div>

      <FamiliaStatusBar
        totalFamilias={familias.length}
        totalVisibles={visibles.length}
        mensaje={mensaje}
        usuario={usuario}
        onCerrarSesion={() => setConfirmarSalir(true)} />


      {dialogo &&
      <FamiliaDialog
        key={dialogo.modo === 'editar' ? dialogo.familia.id : 'nueva'}
        familia={dialogo.modo === 'editar' ? dialogo.familia : null}
        personas={personas}
        onGuardar={guardar}
        onEliminar={() => {
          setDialogo(null);
          setConfirmarEliminar(true);
        }}
        onCerrar={() => setDialogo(null)}
        onRegistrarPersona={registrarPersona} />

      }

      {agruparAbierto &&
      <FamiliaGroupByDialog
        valorInicial={groupFields}
        onAceptar={(campos) => {
          setGroupFields(campos);
          setAgruparAbierto(false);
        }}
        onCancelar={() => setAgruparAbierto(false)} />

      }

      {selectorCamposAbierto &&
      <FamiliaSelectorCamposDialog
        camposVisibles={camposVisibles}
        onCambiar={setCamposVisibles}
        onCerrar={() => setSelectorCamposAbierto(false)} />

      }

      {vistaPreviaAbierta &&
      <FamiliaPrintPreviewDialog familias={visibles} onCerrar={() => setVistaPreviaAbierta(false)} />
      }

      {confirmarEliminar && seleccionada &&
      <ConfirmDialog
        titulo="Eliminar familia"
        mensaje={`¿Desea eliminar definitivamente a «${seleccionada.nombre}»? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        onConfirmar={eliminarFamilia}
        onCancelar={() => setConfirmarEliminar(false)} />

      }

      {confirmarSalir &&
      <ConfirmDialog
        titulo="Cerrar sesión"
        mensaje="¿Desea cerrar la sesión y volver a la pantalla de inicio? Los cambios no guardados se perderán."
        textoConfirmar="Cerrar sesión"
        onConfirmar={onCerrarSesion}
        onCancelar={() => setConfirmarSalir(false)} />

      }
    </div>);

}
