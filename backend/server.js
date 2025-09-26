const express = require("express");
const cors = require("cors");
const conexion = require("./conexion");

const app = express();

app.use(cors());
app.use(express.json());

// Ruta inicial
app.get("/", (req, res) => {
  res.send("Servidor Backend corriendo correctamente");
});

// Obtener todos los productos
app.get("/productos", (req, res) => {
  conexion.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Agregar producto
app.post("/productos", (req, res) => {
  const { nombre, descripcion, precio, imagen, categoria } = req.body;
  conexion.query(
    "INSERT INTO productos (nombre, descripcion, precio, imagen, categoria) VALUES (?, ?, ?, ?, ?)",
    [nombre, descripcion, precio, imagen, categoria],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: results.insertId, ...req.body });
    }
  );
});

// Eliminar producto
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  conexion.query("DELETE FROM productos WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: "Producto eliminado" });
  });
});

// Editar producto
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen, categoria } = req.body;
  conexion.query(
    "UPDATE productos SET nombre=?, descripcion=?, precio=?, imagen=?, categoria=? WHERE id=?",
    [nombre, descripcion, precio, imagen, categoria, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id, ...req.body });
    }
  );
});

app.listen(4000, () => {
  console.log("✅ Servidor backend en http://localhost:4000");
});
