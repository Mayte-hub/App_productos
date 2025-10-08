<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Conexión
include_once("../conexion.php");

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

if ($method === "OPTIONS") {
    exit(); // Respuesta para preflight requests
}

$data = json_decode(file_get_contents("php://input"), true);

if ($method === "POST") {
    // FILTRAR reportes
    $fechaInicio = $data["fechaInicio"] ?? "";
    $fechaFin = $data["fechaFin"] ?? "";
    $cliente = $data["cliente"] ?? "";
    $tipoReporte = $data["tipoReporte"] ?? "general";

    $where = [];

    if (!empty($fechaInicio) && !empty($fechaFin)) {
        $where[] = "fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
    }

    if (!empty($cliente)) {
        $where[] = "descripcion LIKE '%$cliente%'";
    }

    $sql = "SELECT fecha, descripcion, total FROM reportes";

    if (!empty($where)) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }

    $sql .= " ORDER BY fecha DESC";

    $result = $conn->query($sql);

    $reportes = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $reportes[] = $row;
        }
    }

    echo json_encode($reportes);
    exit();
}

if ($method === "PUT") {
    // AGREGAR nuevo reporte
    $fecha = $data["fecha"] ?? "";
    $descripcion = $data["descripcion"] ?? "";
    $total = $data["total"] ?? "";

    if (empty($fecha) || empty($descripcion) || empty($total)) {
        echo json_encode(["error" => "Faltan datos obligatorios"]);
        exit();
    }

    $fecha = $conn->real_escape_string($fecha);
    $descripcion = $conn->real_escape_string($descripcion);
    $total = floatval($total);

    $sql = "INSERT INTO reportes (fecha, descripcion, total) VALUES ('$fecha', '$descripcion', '$total')";

    if ($conn->query($sql)) {
        echo json_encode([
            "success" => true,
            "id" => $conn->insert_id,
            "fecha" => $fecha,
            "descripcion" => $descripcion,
            "total" => $total
        ]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
    exit();
}

echo json_encode(["error" => "Método no soportado"]);
