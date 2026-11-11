import { useSearchParams } from "react-router-dom";
import ProgramarTransmision from "../components/ProgramarTransmision.jsx";

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export default function ProgramarPage() {
  const [params] = useSearchParams();
  const fecha = params.get("fecha");
  const fechaInicial = fecha && FECHA_REGEX.test(fecha) ? fecha : null;

  return <ProgramarTransmision key={fechaInicial || "ninguna"} fechaInicial={fechaInicial} />;
}
