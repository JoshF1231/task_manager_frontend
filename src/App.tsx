
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import LoginForm from "./LoginForm.tsx";
import RegisterForm from "./RegisterForm.tsx";
import Dashboard from "./Dashboard";
import {AuthProvider} from "./components/AuthProvider.tsx";

function App() {

  return (
      <AuthProvider>
          <BrowserRouter>
              <Routes>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path={"/"} element={<Navigate to="/login" replace/>} />
              </Routes>
          </BrowserRouter>
      </AuthProvider>
  )
}

export default App
