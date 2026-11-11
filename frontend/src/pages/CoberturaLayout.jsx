import { Outlet } from "react-router-dom";
import "../styles/Cobertura.css";

// marco comun de las pantallas de cobertura (estilos propios, aislados del resto)
export default function CoberturaLayout() {
  return (
    <main className="zona-cobertura">
      <Outlet />
    </main>
  );
}
