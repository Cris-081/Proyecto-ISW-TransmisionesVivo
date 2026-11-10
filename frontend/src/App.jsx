import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Calendario from "./components/Calendario.jsx";
import ProgramarTransmision from "./components/ProgramarTransmision.jsx";

export default function App() {
  const [vista, setVista] = useState("calendario"); // "calendario" | "programar"
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
        {vista === "calendario" ? (
          <Calendario mostrarListado onElegirDia={irAProgramar} />
        ) : (
          <ProgramarTransmision key={fechaElegida || "ninguna"} fechaInicial={fechaElegida} />
        )}
      </main>
    </div>
  );
}