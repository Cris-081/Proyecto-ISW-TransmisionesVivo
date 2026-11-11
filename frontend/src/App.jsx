import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import InventarioPage from "./pages/InventarioPage.jsx";
import CoberturaLayout from "./pages/CoberturaLayout.jsx";
import CalendarioPage from "./pages/CalendarioPage.jsx";
import ProgramarPage from "./pages/ProgramarPage.jsx";
import PanelGeneral from "./components/PanelGeneral.jsx";
import CoberturaEnVivo from "./components/CoberturaEnVivo.jsx";
import ClientesPrecios from "./components/ClientesPrecios.jsx";
import Pagos from "./components/Pagos.jsx";
import { ROLES_GESTION } from "./helpers/roles.js";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Todo lo que esta aqui dentro necesita sesion y se muestra con la sidebar */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventario"
          element={
            <ProtectedRoute roles={["admin"]}>
              <InventarioPage />
            </ProtectedRoute>
          }
        />

        {/* Cobertura de transmisiones (Isidora) */}
        <Route element={<CoberturaLayout />}>
          <Route
            path="/panel"
            element={
              <ProtectedRoute roles={ROLES_GESTION}>
                <PanelGeneral />
              </ProtectedRoute>
            }
          />
          <Route path="/cobertura" element={<CoberturaEnVivo />} />
          <Route path="/calendario" element={<CalendarioPage />} />
          <Route
            path="/programar"
            element={
              <ProtectedRoute roles={ROLES_GESTION}>
                <ProgramarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute roles={ROLES_GESTION}>
                <ClientesPrecios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pagos"
            element={
              <ProtectedRoute roles={ROLES_GESTION}>
                <Pagos />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
