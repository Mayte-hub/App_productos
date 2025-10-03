const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================== CONEXIÓN A LA BASE DE DATOS ==================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // agrega tu contraseña si tienes
  database: "inventario",
  port: 3315
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err);
    return;
  }
  console.log("✅ Conexión a la base de datos establecida.");
});

// ================== RUTAS PRODUCTOS ==================
app.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/productos", (req, res) => {
  const { nombre, descripcion, precio, imagen, categoria_id } = req.body;
  db.query(
    "INSERT INTO productos (nombre, descripcion, precio, imagen, categoria_id) VALUES (?, ?, ?, ?, ?)",
    [nombre, descripcion, precio, imagen, categoria_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, nombre, descripcion, precio, imagen, categoria_id });
    }
  );
});

app.put("/productos/:id", (req, res) => {
  const { nombre, descripcion, precio, imagen, categoria_id } = req.body;
  db.query(
    "UPDATE productos SET nombre=?, descripcion=?, precio=?, imagen=?, categoria_id=? WHERE id=?",
    [nombre, descripcion, precio, imagen, categoria_id, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json({ id: req.params.id, nombre, descripcion, precio, imagen, categoria_id });
    }
  );
});

app.delete("/productos/:id", (req, res) => {
  db.query("DELETE FROM productos WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ success: true });
  });
});

// ================== RUTAS CATEGORÍAS ==================
app.get("/categorias", (req, res) => {
  db.query("SELECT * FROM categorias", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/categorias", (req, res) => {
  const { nombre } = req.body;
  db.query(
    "INSERT INTO categorias (nombre) VALUES (?)",
    [nombre],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, nombre });
    }
  );
});

app.put("/categorias/:id", (req, res) => {
  const { nombre } = req.body;
  db.query(
    "UPDATE categorias SET nombre=? WHERE id=?",
    [nombre, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Categoría no encontrada" });
      }
      res.json({ id: req.params.id, nombre });
    }
  );
});

app.delete("/categorias/:id", (req, res) => {
  db.query("DELETE FROM categorias WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ success: true });
  });
});

// ================== RUTAS CLIENTES ==================
app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/clientes", (req, res) => {
  const { nombre, email, telefono } = req.body;
  db.query(
    "INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)",
    [nombre, email, telefono],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, nombre, email, telefono });
    }
  );
});

app.put("/clientes/:id", (req, res) => {
  const { nombre, email, telefono } = req.body;
  db.query(
    "UPDATE clientes SET nombre=?, email=?, telefono=? WHERE id=?",
    [nombre, email, telefono, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Cliente no encontrado" });
      }
      res.json({ id: req.params.id, nombre, email, telefono });
    }
  );
});

app.delete("/clientes/:id", (req, res) => {
  db.query("DELETE FROM clientes WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json({ success: true });
  });
});

// ================== RUTAS VENTAS ==================
app.get("/ventas", (req, res) => {
  db.query(
    `SELECT ventas.id, clientes.nombre AS cliente, productos.nombre AS producto, ventas.cantidad, ventas.total, ventas.fecha
     FROM ventas
     JOIN clientes ON ventas.cliente_id = clientes.id
     JOIN productos ON ventas.producto_id = productos.id`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.post("/ventas", (req, res) => {
  const { cliente_id, producto_id, cantidad, total, fecha } = req.body;
  db.query(
    "INSERT INTO ventas (cliente_id, producto_id, cantidad, total, fecha) VALUES (?, ?, ?, ?, ?)",
    [cliente_id, producto_id, cantidad, total, fecha],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: result.insertId,
        cliente_id,
        producto_id,
        cantidad,
        total,
        fecha,
      });
    }
  );
});

app.put("/ventas/:id", (req, res) => {
  const { cliente_id, producto_id, cantidad, total, fecha } = req.body;
  db.query(
    "UPDATE ventas SET cliente_id=?, producto_id=?, cantidad=?, total=?, fecha=? WHERE id=?",
    [cliente_id, producto_id, cantidad, total, fecha, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }
      res.json({
        id: req.params.id,
        cliente_id,
        producto_id,
        cantidad,
        total,
        fecha,
      });
    }
  );
});

app.delete("/ventas/:id", (req, res) => {
  db.query("DELETE FROM ventas WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    res.json({ success: true });
  });
});

// ================== SERVIDOR ==================
app.listen(4000, () => {
  console.log("✅ Servidor backend corriendo en http://localhost:4000");
});
