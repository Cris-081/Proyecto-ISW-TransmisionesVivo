import { useState } from "react";
import ProgramarTransmision from "./components/ProgramarTransmision.jsx";
import TransmisionesPorMes from "./components/TransmisionesPorMes.jsx";

export default function App() {
  // Al reservar, cambia refreshKey y la lista mensual se vuelve a cargar
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="container">
      <h1>Transmisiones en vivo</h1>
      <ProgramarTransmision onCreated={() => setRefreshKey((k) => k + 1)} />
      <TransmisionesPorMes refreshKey={refreshKey} />
    </main>
  );
}
