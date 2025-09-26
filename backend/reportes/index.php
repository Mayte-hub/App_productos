<?php
// index.php — reportes

header("Access-Control-Allow-Origin: *"); // Permite acceso desde cualquier origen
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Configuración de conexión a la base de datos
$host = "localhost";
$db   = "nombre_de_tu_base"; // Cambia esto
$user = "root";              // Cambia si tu usuario es distinto
$pass = "";                  // Cambia si tienes contraseña

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error de conexión: " . $e->getMessage()]);
    exit;
}

// Obtener datos enviados desde React
$data = json_decode(file_get_contents("php://input"), true);

$fechaInicio = $data["fechaInicio"] ?? null;
$fechaFin     = $data["fechaFin"] ?? null;
$cliente      = $data["cliente"] ?? null;
$tipoReporte  = $data["tipoReporte"] ?? "general";

try {
    $query = "";
    $params = [];

    if ($tipoReporte === "cliente" && $cliente) {
        $query = "SELECT id, fecha, CONCAT(cliente_nombre, ' - ', cliente_id) AS descripcion, total
                  FROM ventas
                  WHERE fecha BETWEEN :fechaInicio AND :fechaFin
                  AND cliente_nombre LIKE :cliente";
        $params = [
            ":fechaInicio" => $fechaInicio,
            ":fechaFin" => $fechaFin,
            ":cliente" => "%$cliente%"
        ];
    } elseif ($tipoReporte === "producto") {
        $query = "SELECT id, fecha, CONCAT('Producto: ', producto_nombre) AS descripcion, total
                  FROM ventas
                  WHERE fecha BETWEEN :fechaInicio AND :fechaFin";
        $params = [
            ":fechaInicio" => $fechaInicio,
            ":fechaFin" => $fechaFin
        ];
    } elseif ($tipoReporte === "categoria") {
        $query = "SELECT id, fecha, CONCAT('Categoría: ', categoria_nombre) AS descripcion, total
                  FROM ventas
                  WHERE fecha BETWEEN :fechaInicio AND :fechaFin";
        $params = [
            ":fechaInicio" => $fechaInicio,
            ":fechaFin" => $fechaFin
        ];
    } else {
        // Reporte general
        $query = "SELECT id, fecha, 'Reporte general' AS descripcion, SUM(total) AS total
                  FROM ventas
                  WHERE fecha BETWEEN :fechaInicio AND :fechaFin
                  GROUP BY fecha";
        $params = [
            ":fechaInicio" => $fechaInicio,
            ":fechaFin" => $fechaFin
        ];
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    $reportes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($reportes);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error en consulta: " . $e->getMessage()]);
}
?>
