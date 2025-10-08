<?php
include "../conexion.php";
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "GET":
        // Obtener todas las ventas
        $result = $conn->query("SELECT * FROM ventas");
        $ventas = [];
        while ($row = $result->fetch_assoc()) {
            $ventas[] = $row;
        }
        echo json_encode($ventas);
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);

        // Obtener los nombres desde los IDs
        $cliente_id = $conn->real_escape_string($data["cliente_id"]);
        $producto_id = $conn->real_escape_string($data["producto_id"]);
        $cantidad = $conn->real_escape_string($data["cantidad"]);
        $total = $conn->real_escape_string($data["total"]);
        $fecha = $conn->real_escape_string($data["fecha"]);

        // Buscar nombres reales
        $cliente = "";
        $producto = "";

        $resCliente = $conn->query("SELECT nombre FROM clientes WHERE id = '$cliente_id'");
        if ($resCliente && $resCliente->num_rows > 0) {
            $cliente = $resCliente->fetch_assoc()["nombre"];
        }

        $resProducto = $conn->query("SELECT nombre FROM productos WHERE id = '$producto_id'");
        if ($resProducto && $resProducto->num_rows > 0) {
            $producto = $resProducto->fetch_assoc()["nombre"];
        }

        $sql = "INSERT INTO ventas (cliente, producto, cantidad, total, fecha)
                VALUES ('$cliente', '$producto', '$cantidad', '$total', '$fecha')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode([
                "id" => $conn->insert_id,
                "cliente" => $cliente,
                "producto" => $producto,
                "cantidad" => $cantidad,
                "total" => $total,
                "fecha" => $fecha
            ]);
        } else {
            echo json_encode(["error" => $conn->error]);
        }
        break;

    case "DELETE":
        parse_str(file_get_contents("php://input"), $data);
        $id = $conn->real_escape_string($data["id"]);

        $sql = "DELETE FROM ventas WHERE id = $id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => $conn->error]);
        }
        break;

    default:
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
?>
