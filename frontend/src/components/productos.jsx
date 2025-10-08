import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Barra from "../components/shared/barra";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/products_app/backend/dashboard/index.php")
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch((err) => console.error("Error cargando dashboard:", err));
  }, []);

  if (!dashboardData) {
    return <div className="p-8 text-gray-600">Cargando datos...</div>;
  }

  const chartData = {
    labels: dashboardData.ventasMensuales?.map((v) => v.mes) || [],
    datasets: [
      {
        label: "Ventas Mensuales",
        data: dashboardData.ventasMensuales?.map((v) => parseFloat(v.total)) || [],
        backgroundColor: "rgba(99, 102, 241, 0.6)"
      }
    ]
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Barra />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Panel de Control</h1>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            onClick={() => navigate("/clientes")}
            className="bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer hover:bg-purple-50"
          >
            <h2 className="text-xl font-bold text-purple-600">Clientes</h2>
            <p className="text-3xl mt-2">{dashboardData.clientes}</p>
          </div>

          <div
            onClick={() => navigate("/categorias")}
            className="bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer hover:bg-purple-50"
          >
            <h2 className="text-xl font-bold text-purple-600">Categorías</h2>
            <p className="text-3xl mt-2">{dashboardData.categorias}</p>
          </div>

          <div
            onClick={() => navigate("/productos")}
            className="bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer hover:bg-purple-50"
          >
            <h2 className="text-xl font-bold text-purple-600">Productos</h2>
            <p className="text-3xl mt-2">{dashboardData.productos}</p>
          </div>

          <div
            onClick={() => navigate("/ventas")}
            className="bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer hover:bg-purple-50"
          >
            <h2 className="text-xl font-bold text-purple-600">Ventas Totales</h2>
            <p className="text-3xl mt-2">
              S/. {parseFloat(dashboardData.totalVentas || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Productos más vendidos y últimas ventas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Productos más vendidos</h2>
            <ul className="space-y-2">
              {dashboardData.masVendidos?.length > 0 ? (
                dashboardData.masVendidos.map((p) => (
                  <li key={p.producto} className="text-gray-700">
                    {p.producto} - {p.ventas} ventas
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No hay datos disponibles</p>
              )}
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
                {dashboardData.ultimasVentas?.length > 0 ? (
                  dashboardData.ultimasVentas.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2 border">{v.producto}</td>
                      <td className="p-2 border">{v.fecha}</td>
                      <td className="p-2 border">S/. {v.total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-2 text-center text-gray-500">
                      No hay ventas recientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">📈 Ventas Mensuales</h2>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
}
