import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App"; // Login
import Productos from "./components/Productos"; // Dashboard principal
import Articulos from "./components/articulos/articulos"; // Nueva sección
import Categorias from "./components/categorias/categorias";
import Ventas from "./components/ventas/ventas";
import Clientes from "./components/clientes/clientes";
import Reportes from "./components/reportes/reportes";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Página de inicio (login) */}
        <Route path="/" element={<App />} />

        {/* Dashboard de productos */}
        <Route path="/productos" element={<Productos />} />

        {/* Nueva ruta para Artículos */}
        <Route path="/articulos" element={<Articulos />} />

        {/* Nueva ruta para Artículos */}
        <Route path="/categorias" element={<Categorias />} />

        {/* Nueva ruta para Artículos */}
        <Route path="/ventas" element={<Ventas />} />

        {/* Nueva ruta para Artículos */}
        <Route path="/clientes" element={<Clientes />} />

        {/* Nueva ruta para Artículos */}
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
