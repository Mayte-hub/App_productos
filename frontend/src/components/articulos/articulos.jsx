import React, { useState, useEffect } from "react";
import Barra from "../shared/barra";

export default function Articulos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoria_id: "",
  });
  const [editando, setEditando] = useState(null);

  const API_URL = "http://localhost:4000/productos"; // URL de tu backend Node.js

  // Cargar productos y categorías desde backend
  const cargarDatos = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((error) =>
        console.error("Error al cargar productos:", error)
      );

    fetch("http://localhost:4000/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((error) =>
        console.error("Error al cargar categorías:", error)
      );
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value,
    });
  };

  const agregarProducto = () => {
    if (
      !nuevoProducto.nombre ||
      !nuevoProducto.descripcion ||
      !nuevoProducto.precio ||
      !nuevoProducto.imagen ||
      !nuevoProducto.categoria_id
    ) {
      alert("Completa todos los campos");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto),
    })
      .then((res) => res.json())
      .then(() => {
        cargarDatos();
        setNuevoProducto({
          nombre: "",
          descripcion: "",
          precio: "",
          imagen: "",
          categoria_id: "",
        });
      });
  };

  const editarProducto = (producto) => {
    setEditando(producto);
    setNuevoProducto(producto);
  };

  const guardarEdicion = () => {
    fetch(`${API_URL}/${editando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto),
    })
      .then(() => {
        cargarDatos();
        setEditando(null);
        setNuevoProducto({
          nombre: "",
          descripcion: "",
          precio: "",
          imagen: "",
          categoria_id: "",
        });
      });
  };

  const eliminarProducto = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then(() => cargarDatos());
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Barra />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
          Gestión de Artículos
        </h1>

        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            {editando ? "✏️ Editar Producto" : "➕ Agregar Producto"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoProducto.nombre}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            />

            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={nuevoProducto.precio}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            />

            <select
              name="categoria_id"
              value={nuevoProducto.categoria_id}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="imagen"
              placeholder="URL de la Imagen"
              value={nuevoProducto.imagen}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
            />

            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={nuevoProducto.descripcion}
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
                onClick={agregarProducto}
                className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-2 rounded-lg shadow-md"
              >
                ➕ Agregar Producto
              </button>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3">Imagen</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Precio</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  className="border-b hover:bg-purple-50 transition"
                >
                  <td className="p-3">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="p-3 font-semibold">{producto.nombre}</td>
                  <td className="p-3">{producto.categoria_nombre || producto.categoria_id}</td>
                  <td className="p-3 text-gray-600">{producto.descripcion}</td>
                  <td className="p-3 font-bold text-purple-700">
                    ${producto.precio}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => editarProducto(producto)}
                      className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded-md mr-2"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(producto.id)}
                      className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded-md"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No hay productos registrados 📦
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
