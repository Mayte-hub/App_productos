<?php
include "../conexion.php";

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method == "GET") {
    $result = $conn->query("SELECT * FROM ventas");
    $ventas = [];
    while ($row = $result->fetch_assoc()) {
        $ventas[] = $row;
    }
    echo json_encode($ventas);
}

if ($method == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $cliente   = $conn->real_escape_string($data["cliente"]);
    $producto  = $conn->real_escape_string($data["producto"]);
    $cantidad  = $conn->real_escape_string($data["cantidad"]);
    $total     = $conn->real_escape_string($data["total"]);
    $fecha     = $conn->real_escape_string($data["fecha"]);

    $sql = "INSERT INTO ventas (cliente, producto, cantidad, total, fecha) VALUES ('$cliente', '$producto', '$cantidad', '$total', '$fecha')";
    if ($conn->query($sql) === TRUE) {
        $id = $conn->insert_id;
        echo json_encode([
            "id" => $id,
            "cliente" => $cliente,
            "producto" => $producto,
            "cantidad" => $cantidad,
            "total" => $total,
            "fecha" => $fecha
        ]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}

if ($method == "DELETE") {
    parse_str(file_get_contents("php://input"), $data);
    $id = $conn->real_escape_string($data["id"]);

    $sql = "DELETE FROM ventas WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}
?>
