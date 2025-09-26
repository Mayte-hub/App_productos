// src/components/Barra.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Barra() {
  return (
    <div className="w-64 bg-gradient-to-b from-purple-500 to-purple-700 text-white p-6">
      <h2 className="text-2xl font-bold mb-10">🍼 Bebé Store</h2>
      <ul className="space-y-4">
        <li className="hover:bg-purple-600 p-2 rounded cursor-pointer">
          <Link to="/productos">📊 Panel de Control</Link>
        </li>
        <li className="hover:bg-purple-600 p-2 rounded cursor-pointer">
          <Link to="/articulos">📦 Productos</Link>
        </li>
        <li className="hover:bg-purple-600 p-2 rounded cursor-pointer">
          <Link to="/categorias">📂 Categorías</Link>
        </li>
        <li className="hover:bg-purple-600 p-2 rounded cursor-pointer">
          <Link to="/ventas">💰 Ventas</Link>
        </li>
        <li className="hover:bg-purple-600 p-2 rounded cursor-pointer">
          <Link to="/clientes">🧸 Clientes</Link>
        </li>
        <li className="hover:bg-purple-600 p-2 rounded cursor-pointer">
          <Link to="/reportes">📑 Reportes</Link>
        </li>
      </ul>
    </div>
  );
}
