import React, { useState, useEffect } from "react";
import Barra from "../shared/barra";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Reportes() {
  const [filtro, setFiltro] = useState({
    fechaInicio: "",
    fechaFin: "",
  });

  const [reportes, setReportes] = useState([]);
  const [totalGeneral, setTotalGeneral] = useState(0);

  const [nuevoReporte, setNuevoReporte] = useState({
    fecha: "",
    descripcion: "",
    total: "",
  });

  const API_REPORTES = "http://localhost/products_app/backend/reportes/index.php";

  useEffect(() => {
    cargarReportes({});
  }, []);

  const cargarReportes = (filtroData) => {
    fetch(API_REPORTES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtroData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReportes(data);
          calcularTotal(data);
        } else {
          setReportes([]);
          setTotalGeneral(0);
        }
      })
      .catch(() => {
        setReportes([]);
        setTotalGeneral(0);
      });
  };

  const handleGenerarReporte = (e) => {
    e.preventDefault();
    cargarReportes(filtro);
  };

  const calcularTotal = (data) => {
    const suma = data.reduce((acc, r) => acc + parseFloat(r.total), 0);
    setTotalGeneral(suma.toFixed(2));
  };

  const handleAgregarReporte = (e) => {
    e.preventDefault();

    fetch(API_REPORTES, {
      method: "PUT", // Usamos PUT para agregar un nuevo reporte
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoReporte),
    })
      .then((res) => res.json())
      .then((data) => {
        cargarReportes({});
        setNuevoReporte({ fecha: "", descripcion: "", total: "" });
      })
      .catch((error) => console.error("Error agregando reporte:", error));
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Ventas", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["#", "Fecha", "Descripción", "Total (S/.)"]],
      body: reportes.map((r, index) => [
        index + 1,
        r.fecha,
        r.descripcion,
        r.total,
      ]),
    });

    doc.text(`Monto total: S/. ${totalGeneral}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save("reporte.pdf");
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      reportes.map((r, index) => ({
        "#": index + 1,
        Fecha: r.fecha,
        Descripción: r.descripcion,
        "Total (S/.)": r.total,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reportes");
    XLSX.writeFile(wb, "reporte.xlsx");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 to-white">
      <Barra />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">📊 Reportes</h1>

        {/* Formulario agregar reporte */}
        <form
          onSubmit={handleAgregarReporte}
          className="bg-white rounded-2xl shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-purple-700 mb-4">➕ Agregar Reporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              className="border border-purple-300 rounded-lg px-3 py-2"
              value={nuevoReporte.fecha}
              onChange={(e) => setNuevoReporte({ ...nuevoReporte, fecha: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Descripción"
              className="border border-purple-300 rounded-lg px-3 py-2"
              value={nuevoReporte.descripcion}
              onChange={(e) =>
                setNuevoReporte({ ...nuevoReporte, descripcion: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Total"
              step="0.01"
              className="border border-purple-300 rounded-lg px-3 py-2"
              value={nuevoReporte.total}
              onChange={(e) => setNuevoReporte({ ...nuevoReporte, total: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Agregar Reporte
            </button>
          </div>
        </form>

        {/* Formulario filtrar */}
        
        <form
          onSubmit={handleGenerarReporte}
          className="bg-white rounded-2xl shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-purple-700 mb-4">📑 Reportes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha inicio</label>
              <input
                type="date"
                className="w-full mt-1 border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={filtro.fechaInicio}
                onChange={(e) => setFiltro({ ...filtro, fechaInicio: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha fin</label>
              <input
                type="date"
                className="w-full mt-1 border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={filtro.fechaFin}
                onChange={(e) => setFiltro({ ...filtro, fechaFin: e.target.value })}
              />
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
          <h2 className="text-xl font-bold text-purple-700 mb-4">Resultados</h2>
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
                  <td colSpan="4" className="text-center text-gray-500 py-4 italic">
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
            {reportes.length > 0 && (
              <tfoot>
                <tr className="bg-purple-200 font-bold">
                  <td colSpan="3" className="p-3 border-t text-right">
                    Total general:
                  </td>
                  <td className="p-3 border-t">S/. {totalGeneral}</td>
                </tr>
              </tfoot>
            )}
          </table>

          {/* Botones exportar */}
          <div className="flex justify-end mt-4 gap-4">
            <button
              onClick={exportarPDF}
              className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              📥 Exportar PDF
            </button>
            <button
              onClick={exportarExcel}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              📥 Exportar Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
