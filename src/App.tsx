import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboards/Dashboard"
import ProtectedRoute from "./auth/ProtectedRoute";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  )
}

export default App
