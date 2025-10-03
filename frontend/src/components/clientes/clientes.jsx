import React, { useState, useEffect } from "react";
import Barra from "../shared/barra";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [editando, setEditando] = useState(null); // guardar ID del cliente en edición

  const API_URL = "http://localhost:4000/clientes";

  // Cargar clientes desde backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((err) => console.error("Error al cargar clientes:", err));
  }, []);

  const handleChange = (e) => {
    setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  };

  const agregarCliente = () => {
    if (nuevoCliente.nombre && nuevoCliente.email && nuevoCliente.telefono) {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoCliente),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientes([...clientes, data]);
          setNuevoCliente({ nombre: "", email: "", telefono: "" });
        })
        .catch((err) => console.error("Error al agregar cliente:", err));
    }
  };

  const eliminarCliente = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setClientes(clientes.filter((c) => c.id !== id));
      })
      .catch((err) => console.error("Error al eliminar cliente:", err));
  };

  const iniciarEdicion = (cliente) => {
    setEditando(cliente.id);
    setNuevoCliente({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
    });
  };

  const guardarEdicion = () => {
    fetch(`${API_URL}/${editando}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoCliente),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientes(
          clientes.map((c) => (c.id === editando ? { ...c, ...data } : c))
        );
        setNuevoCliente({ nombre: "", email: "", telefono: "" });
        setEditando(null);
      })
      .catch((err) => console.error("Error al editar cliente:", err));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Barra />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
          Gestión de Clientes
        </h1>

        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            {editando ? "✏️ Editar Cliente" : "➕ Registrar Cliente"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre Completo"
              value={nuevoCliente.nombre}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={nuevoCliente.email}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={nuevoCliente.telefono}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>
          {editando ? (
            <div className="mt-4 flex gap-3">
              <button
                onClick={guardarEdicion}
                className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded-lg shadow-md"
              >
                💾 Guardar Cambios
              </button>
              <button
                onClick={() => {
                  setEditando(null);
                  setNuevoCliente({ nombre: "", email: "", telefono: "" });
                }}
                className="bg-gray-500 hover:bg-gray-600 transition text-white px-6 py-2 rounded-lg shadow-md"
              >
                ❌ Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={agregarCliente}
              className="mt-4 bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-2 rounded-lg shadow-md"
            >
              ➕ Agregar Cliente
            </button>
          )}
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700 p-4">
            📋 Lista de Clientes
          </h2>
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-semibold">{cliente.nombre}</td>
                  <td className="p-3">{cliente.email}</td>
                  <td className="p-3">{cliente.telefono}</td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => iniciarEdicion(cliente)}
                      className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-1 rounded-md"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarCliente(cliente.id)}
                      className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded-md"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No hay clientes registrados 👥
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
