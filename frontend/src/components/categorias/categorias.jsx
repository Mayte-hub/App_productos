import React, { useState, useEffect } from "react";
import Barra from "../shared/barra"; // Barra lateral

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    descripcion: "",
  });
  const [editando, setEditando] = useState(null);

  // Cargar categorías desde el backend
  useEffect(() => {
    fetch("http://localhost:5000/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data));
  }, []);

  // Manejo de inputs
  const handleChange = (e) => {
    setNuevaCategoria({ ...nuevaCategoria, [e.target.name]: e.target.value });
  };

  // Agregar categoría
  const agregarCategoria = () => {
    fetch("http://localhost:5000/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaCategoria),
    })
      .then((res) => res.json())
      .then((data) => {
        setCategorias([...categorias, data]);
        setNuevaCategoria({ nombre: "", descripcion: "" });
      });
  };

  // Eliminar categoría
  const eliminarCategoria = (id) => {
    fetch(`http://localhost:5000/categorias/${id}`, {
      method: "DELETE",
    }).then(() => {
      setCategorias(categorias.filter((c) => c.id !== id));
    });
  };

  // Editar categoría
  const editarCategoria = (categoria) => {
    setEditando(categoria);
    setNuevaCategoria(categoria);
  };

  const guardarEdicion = () => {
    fetch(`http://localhost:5000/categorias/${editando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaCategoria),
    })
      .then((res) => res.json())
      .then((data) => {
        setCategorias(categorias.map((c) => (c.id === data.id ? data : c)));
        setEditando(null);
        setNuevaCategoria({ nombre: "", descripcion: "" });
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Barra lateral */}
      <Barra />

      {/* Contenido principal */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
          Gestión de Categorías
        </h1>

        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            {editando ? "✏️ Editar Categoría" : "➕ Agregar Categoría"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevaCategoria.nombre}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={nuevaCategoria.descripcion}
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
                onClick={agregarCategoria}
                className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-2 rounded-lg shadow-md"
              >
                ➕ Agregar Categoría
              </button>
            )}
          </div>
        </div>

        {/* Tabla de categorías */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Descripción</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr
                  key={categoria.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-semibold">{categoria.nombre}</td>
                  <td className="p-3 text-gray-600">{categoria.descripcion}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => editarCategoria(categoria)}
                      className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded-md mr-2"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarCategoria(categoria.id)}
                      className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded-md"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No hay categorías registradas 📂
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
