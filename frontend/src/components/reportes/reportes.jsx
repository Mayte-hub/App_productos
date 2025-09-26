import React, { useState } from "react";
import Barra from "../shared/barra";

export default function Reportes() {
  const [filtro, setFiltro] = useState({
    fechaInicio: "",
    fechaFin: "",
    cliente: "",
    tipoReporte: "general",
  });

  const [reportes, setReportes] = useState([]);

  const handleGenerarReporte = (e) => {
    e.preventDefault();

    const url = "http://localhost/backend/reportes/index.php";

    // Enviar filtros al backend
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtro),
    })
      .then((res) => res.json())
      .then((data) => {
        setReportes(data);
      })
      .catch((error) =>
        console.error("Error al generar reporte:", error)
      );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 to-white">
      {/* Barra lateral */}
      <Barra />

      {/* Contenido principal */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          📊 Reportes
        </h1>

        {/* Formulario de filtros */}
        <form
          onSubmit={handleGenerarReporte}
          className="bg-white rounded-2xl shadow-md p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha inicio
              </label>
              <input
                type="date"
                className="w-full mt-1 border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={filtro.fechaInicio}
                onChange={(e) =>
                  setFiltro({ ...filtro, fechaInicio: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha fin
              </label>
              <input
                type="date"
                className="w-full mt-1 border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={filtro.fechaFin}
                onChange={(e) =>
                  setFiltro({ ...filtro, fechaFin: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cliente
              </label>
              <input
                type="text"
                placeholder="Nombre del cliente"
                className="w-full mt-1 border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={filtro.cliente}
                onChange={(e) =>
                  setFiltro({ ...filtro, cliente: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de reporte
              </label>
              <select
                className="w-full mt-1 border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={filtro.tipoReporte}
                onChange={(e) =>
                  setFiltro({ ...filtro, tipoReporte: e.target.value })
                }
              >
                <option value="general">General</option>
                <option value="cliente">Por Cliente</option>
                <option value="producto">Por Producto</option>
                <option value="categoria">Por Categoría</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition"
            >
              Generar Reporte
            </button>
          </div>
        </form>

        {/* Tabla de reportes */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-purple-700 mb-4">
            Resultados
          </h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-100">
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">Fecha</th>
                <th className="p-3 border-b">Descripción</th>
                <th className="p-3 border-b">Total (S/.)</th>
              </tr>
            </thead>
            <tbody>
              {reportes.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-500 py-4 italic"
                  >
                    No hay reportes generados
                  </td>
                </tr>
              ) : (
                reportes.map((r, index) => (
                  <tr key={index} className="hover:bg-purple-50">
                    <td className="p-3 border-b">{index + 1}</td>
                    <td className="p-3 border-b">{r.fecha}</td>
                    <td className="p-3 border-b">{r.descripcion}</td>
                    <td className="p-3 border-b">S/. {r.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            <button className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-700 transition">
              📥 Exportar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
