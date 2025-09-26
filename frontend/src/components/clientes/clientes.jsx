import React, { useState, useEffect } from "react";
import Barra from "../shared/barra";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
  });

  // Cargar clientes desde backend
  useEffect(() => {
    fetch("http://localhost/backend/clientes/index.php")
      .then((res) => res.json())
      .then((data) => setClientes(data));
  }, []);

  const handleChange = (e) => {
    setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  };

  const agregarCliente = () => {
    if (
      nuevoCliente.nombre &&
      nuevoCliente.correo &&
      nuevoCliente.telefono &&
      nuevoCliente.direccion
    ) {
      fetch("http://localhost/backend/clientes/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoCliente),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientes([...clientes, data]); // añadir cliente nuevo
          setNuevoCliente({
            nombre: "",
            correo: "",
            telefono: "",
            direccion: "",
          });
        });
    }
  };

  const eliminarCliente = (id) => {
    fetch("http://localhost/backend/clientes/index.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id=${id}`,
    }).then(() => {
      setClientes(clientes.filter((c) => c.id !== id));
    });
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
            ➕ Registrar Cliente
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
              name="correo"
              placeholder="Correo Electrónico"
              value={nuevoCliente.correo}
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
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={nuevoCliente.direccion}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>
          <button
            onClick={agregarCliente}
            className="mt-4 bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-2 rounded-lg shadow-md"
          >
            ➕ Agregar Cliente
          </button>
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
                <th className="p-3">Dirección</th>
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
                  <td className="p-3">{cliente.correo}</td>
                  <td className="p-3">{cliente.telefono}</td>
                  <td className="p-3">{cliente.direccion}</td>
                  <td className="p-3 text-center">
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
                    colSpan="5"
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
