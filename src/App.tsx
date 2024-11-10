import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DriverDashboard } from "./pages/driver/DriverDashboard";
import { AppProvider } from "./context/AppContext";
import { ProtectedRoute } from "./services/ProtectedRoute";
import { Home } from "./pages/Home";
import "./index.css";
import { LogsOpsDashboard } from "./pages/logsOps/LogsOpsDashboard";
import { AddManifest } from "./pages/logsOps/AddManifest";
import { VisualizarFacturas } from "./pages/logsOps/VisualizarFacturas";
import { ClientDashboard } from "./pages/client/ClientDashboard2";
import AddUsers from "./pages/logsOps/AddUsers";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/driver-dashboard"
            element={
              <ProtectedRoute
                requiredRole="driver"
                element={<DriverDashboard />}
              />
            }
          />
          <Route
            path="/logOps-dashboard"
            element={
              <ProtectedRoute
                requiredRole="logsOps"
                element={<LogsOpsDashboard />}
              />
            }
          />
          <Route
            path="/agregar-manifiesto"
            element={
              <ProtectedRoute
                requiredRole="logsOps"
                element={<AddManifest />}
              />
            }
          />
          <Route
            path="/visualizar-facturas"
            element={
              <ProtectedRoute
                requiredRole="logsOps"
                element={<VisualizarFacturas />}
              />
            }
          />
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute
                requiredRole="client"
                element={<ClientDashboard />}
              />
            }
          />
          <Route
            path="/agregar-usuarios"
            element={
              <ProtectedRoute requiredRole="logsOps" element={<AddUsers />} />
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
