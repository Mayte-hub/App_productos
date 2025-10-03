import React, { useState, useEffect } from "react";
import Barra from "../shared/barra";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({
    cliente_id: "",
    producto_id: "",
    cantidad: "",
    total: "",
    fecha: "",
  });
  const [editando, setEditando] = useState(null);

  const API_URL = "http://localhost:4000/ventas";

  // Cargar datos iniciales
  const cargarDatos = () => {
    fetch("http://localhost:4000/ventas")
      .then((res) => res.json())
      .then((data) => setVentas(data));

    fetch("http://localhost:4000/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data));

    fetch("http://localhost:4000/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setNuevaVenta({ ...nuevaVenta, [e.target.name]: e.target.value });
  };

  const agregarVenta = () => {
    if (
      !nuevaVenta.cliente_id ||
      !nuevaVenta.producto_id ||
      !nuevaVenta.cantidad ||
      !nuevaVenta.total ||
      !nuevaVenta.fecha
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaVenta),
    })
      .then((res) => res.json())
      .then(() => {
        cargarDatos(); // refrescar lista
        setNuevaVenta({
          cliente_id: "",
          producto_id: "",
          cantidad: "",
          total: "",
          fecha: "",
        });
      });
  };

  const editarVenta = (venta) => {
    setEditando(venta);
    setNuevaVenta({
      cliente_id: venta.cliente_id,
      producto_id: venta.producto_id,
      cantidad: venta.cantidad,
      total: venta.total,
      fecha: venta.fecha,
    });
  };

  const guardarEdicion = () => {
    fetch(`${API_URL}/${editando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaVenta),
    })
      .then(() => {
        cargarDatos(); // refrescar lista
        setEditando(null);
        setNuevaVenta({
          cliente_id: "",
          producto_id: "",
          cantidad: "",
          total: "",
          fecha: "",
        });
      });
  };

  const eliminarVenta = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(() => {
      cargarDatos(); // refrescar lista
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Barra />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
          Gestión de Ventas
        </h1>

        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            {editando ? "✏️ Editar Venta" : "➕ Registrar Nueva Venta"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Select Cliente */}
            <select
              name="cliente_id"
              value={nuevaVenta.cliente_id}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>

            {/* Select Producto */}
            <select
              name="producto_id"
              value={nuevaVenta.producto_id}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            >
              <option value="">Seleccione un producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="cantidad"
              placeholder="Cantidad"
              value={nuevaVenta.cantidad}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <input
              type="number"
              name="total"
              placeholder="Total (S/.)"
              value={nuevaVenta.total}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <input
              type="date"
              name="fecha"
              value={nuevaVenta.fecha}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none md:col-span-2"
            />
          </div>

          <div className="mt-4">
            {editando ? (
              <button
                onClick={guardarEdicion}
                className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded-lg shadow-md"
              >
                💾 Guardar Cambios
              </button>
            ) : (
              <button
                onClick={agregarVenta}
                className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-2 rounded-lg shadow-md"
              >
                ➕ Agregar Venta
              </button>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700 p-4">
            📋 Ventas Registradas
          </h2>
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3">Cliente</th>
                <th className="p-3">Producto</th>
                <th className="p-3">Cantidad</th>
                <th className="p-3">Total (S/.)</th>
                <th className="p-3">Fecha</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-semibold">{venta.cliente}</td>
                  <td className="p-3">{venta.producto}</td>
                  <td className="p-3">{venta.cantidad}</td>
                  <td className="p-3 font-bold text-purple-600">
                    S/ {venta.total}
                  </td>
                  <td className="p-3">{venta.fecha}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => editarVenta(venta)}
                      className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded-md mr-2"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarVenta(venta.id)}
                      className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded-md"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {ventas.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500 italic">
                    No hay ventas registradas 🛒
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
