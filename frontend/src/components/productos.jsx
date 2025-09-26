// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Barra from "../components/shared/barra";
// 👈 importamos la barra lateral

export default function Dashboard() {
  const [productos, setProductos] = useState([]);

  // Cargar productos del localStorage
  useEffect(() => {
    const data = localStorage.getItem("productos");
    if (data) {
      setProductos(JSON.parse(data));
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra lateral */}
      <Barra />

      {/* Panel principal (solo Dashboard) */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Panel de Control</h1>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-purple-600">Usuarios</h2>
            <p className="text-3xl mt-2">3</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-purple-600">Categorías</h2>
            <p className="text-3xl mt-2">
              {[...new Set(productos.map((p) => p.categoria))].length}
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-purple-600">Productos</h2>
            <p className="text-3xl mt-2">{productos.length}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-purple-600">Ventas</h2>
            <p className="text-3xl mt-2">7</p>
          </div>
        </div>

        {/* Últimas ventas */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Productos más vendidos</h2>
            <ul className="space-y-2">
              <li>🍼 Biberón - 10 ventas</li>
              <li>🧸 Peluche - 5 ventas</li>
              <li>👕 Ropita - 3 ventas</li>
            </ul>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Últimas ventas</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-purple-100 text-purple-700">
                  <th className="p-2 border">Producto</th>
                  <th className="p-2 border">Fecha</th>
                  <th className="p-2 border">Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">Biberón</td>
                  <td className="p-2 border">2025-09-25</td>
                  <td className="p-2 border">S/. 50</td>
                </tr>
                <tr>
                  <td className="p-2 border">Peluche</td>
                  <td className="p-2 border">2025-09-24</td>
                  <td className="p-2 border">S/. 80</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
