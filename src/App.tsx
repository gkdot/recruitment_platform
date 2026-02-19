import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboard"
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  )
}

export default App
