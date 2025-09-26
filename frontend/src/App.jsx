import React from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí podrías validar usuario/contraseña
    navigate("/productos"); // Redirige al Dashboard
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-200 to-purple-400">
      <div className="bg-white shadow-2xl rounded-2xl flex overflow-hidden w-[800px]">
        {/* Panel de login */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Inicio de sesión - Administrador
          </h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Usuario */}
            <div className="relative">
              <input
                type="text"
                placeholder="Usuario o Correo"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Contraseña */}
            <div className="relative">
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Opciones */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox text-purple-500" />
                Recuérdame
              </label>
              <a href="#" className="hover:underline text-purple-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Ingresar
            </button>
          </form>
        </div>

        {/* Panel derecho */}
        <div className="w-1/2 bg-gradient-to-b from-purple-400 to-purple-600 text-white flex flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-bold mb-4">¡Bienvenido Administrador!</h2>
          <p className="text-center mb-6">
            Ingresa con tus credenciales para gestionar el{" "}
            <span className="font-semibold">sistema de productos para bebés</span>.
          </p>
          <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition">
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}
