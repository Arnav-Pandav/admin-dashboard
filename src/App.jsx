import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PortfolioAdminDashboard from "./components/PortfolioAdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PortfolioAdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
