const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",       // usuario por defecto en XAMPP
  password: "",       // si tienes contraseña ponla aquí
  database: "inventario" // el nombre de tu BD
});

conexion.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err);
  } else {
    console.log("✅ Conectado a MySQL - Base de datos: inventario");
  }
});

module.exports = conexion;
