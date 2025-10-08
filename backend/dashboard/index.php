<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once("../conexion.php");

// ====================
// 👥 Total de Clientes
// ====================
$clientesResult = $conn->query("SELECT COUNT(*) AS totalClientes FROM clientes");
$clientesCount = $clientesResult->fetch_assoc()["totalClientes"] ?? 0;

// ====================
// 📦 Total de Productos
// ====================
$productosResult = $conn->query("SELECT COUNT(*) AS totalProductos FROM productos");
$productosCount = $productosResult->fetch_assoc()["totalProductos"] ?? 0;

// ====================
// 🏷️ Total de Categorías
// ====================
$categoriasResult = $conn->query("SELECT COUNT(*) AS totalCategorias FROM categorias");
$categoriasCount = $categoriasResult->fetch_assoc()["totalCategorias"] ?? 0;

// ====================
// 💰 Suma total de ventas
// ====================
$ventasResult = $conn->query("SELECT SUM(total) AS totalVentas FROM ventas");
$totalVentas = $ventasResult->fetch_assoc()["totalVentas"] ?? 0;

// ====================
// 🕓 Últimas ventas
// ====================
$ultimasVentasResult = $conn->query("
    SELECT producto, fecha, total
    FROM ventas
    ORDER BY fecha DESC
    LIMIT 5
");
$ultimasVentas = [];
while ($row = $ultimasVentasResult->fetch_assoc()) {
    $ultimasVentas[] = $row;
}

// ====================
// 🏆 Productos más vendidos
// ====================
$masVendidosResult = $conn->query("
    SELECT producto, COUNT(*) AS ventas
    FROM ventas
    GROUP BY producto
    ORDER BY ventas DESC
    LIMIT 3
");
$masVendidos = [];
while ($row = $masVendidosResult->fetch_assoc()) {
    $masVendidos[] = $row;
}

// ====================
// 📊 Ventas mensuales
// ====================
$ventasMensualesResult = $conn->query("
    SELECT DATE_FORMAT(fecha, '%Y-%m') AS mes, SUM(total) AS total
    FROM ventas
    GROUP BY mes
    ORDER BY mes ASC
");
$ventasMensuales = [];
while ($row = $ventasMensualesResult->fetch_assoc()) {
    $ventasMensuales[] = $row;
}

// ====================
// 📤 Respuesta final
// ====================
echo json_encode([
    "clientes" => (int)$clientesCount,
    "productos" => (int)$productosCount,
    "categorias" => (int)$categoriasCount,
    "totalVentas" => (float)$totalVentas,
    "ultimasVentas" => $ultimasVentas,
    "masVendidos" => $masVendidos,
    "ventasMensuales" => $ventasMensuales
]);
?>
