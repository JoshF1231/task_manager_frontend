
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import LoginForm from "./LoginForm.tsx";
import RegisterForm from "./RegisterForm.tsx";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path={"/"} element={<Navigate to="/login" replace/>} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
