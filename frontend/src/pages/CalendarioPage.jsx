import { useNavigate } from "react-router-dom";
import Calendario from "../components/Calendario.jsx";

export default function CalendarioPage() {
  const navigate = useNavigate();

  // Desde el calendario: abrir "Programar" con el dia pulsado
  return <Calendario mostrarListado onElegirDia={(fecha) => navigate(`/programar?fecha=${fecha}`)} />;
}
