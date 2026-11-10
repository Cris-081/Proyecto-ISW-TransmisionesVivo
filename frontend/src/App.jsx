import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Calendario from "./components/Calendario.jsx";
import ProgramarTransmision from "./components/ProgramarTransmision.jsx";
import PanelGeneral from "./components/PanelGeneral.jsx";
import CoberturaEnVivo from "./components/CoberturaEnVivo.jsx";
import ClientesPrecios from "./components/ClientesPrecios.jsx";
import Pagos from "./components/Pagos.jsx";

export default function App() {
  const [vista, setVista] = useState("panel"); // "panel" | "cobertura" | "calendario" | "programar"
  const [fechaElegida, setFechaElegida] = useState(null);

  // Desde el calendario: abrir "Programar" con el día pulsado
  const irAProgramar = (fecha) => {
    setFechaElegida(fecha);
    setVista("programar");
  };

  const cambiarVista = (v) => {
    if (v === "programar") setFechaElegida(null);
    setVista(v);
  };

  return (
    <div className="app">
      <Sidebar vista={vista} onCambiar={cambiarVista} />

      <main className="contenido">
        {vista === "panel" && <PanelGeneral />}

        {vista === "cobertura" && <CoberturaEnVivo />}

                {vista === "clientes" && <ClientesPrecios />}

                        {vista === "pagos" && <Pagos />}

        {vista === "calendario" && (
          <Calendario mostrarListado onElegirDia={irAProgramar} />
        )}

        {vista === "programar" && (
          <ProgramarTransmision key={fechaElegida || "ninguna"} fechaInicial={fechaElegida} />
        )}
      </main>
    </div>
  );
}