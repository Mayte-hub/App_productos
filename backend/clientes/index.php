<?php
require_once("../conexion.php");

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Leer datos JSON enviados
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case "GET":
        $result = $conn->query("SELECT * FROM clientes");
        $clientes = [];
        while ($row = $result->fetch_assoc()) {
            $clientes[] = $row;
        }
        echo json_encode($clientes);
        break;

    case "POST":
        $nombre = $conn->real_escape_string($input["nombre"]);
        $correo = $conn->real_escape_string($input["correo"]);
        $telefono = $conn->real_escape_string($input["telefono"]);
        $direccion = $conn->real_escape_string($input["direccion"]);

        $sql = "INSERT INTO clientes (nombre, correo, telefono, direccion) 
                VALUES ('$nombre', '$correo', '$telefono', '$direccion')";

        if ($conn->query($sql)) {
            echo json_encode([
                "id" => $conn->insert_id,
                "nombre" => $nombre,
                "correo" => $correo,
                "telefono" => $telefono,
                "direccion" => $direccion
            ]);
        } else {
            echo json_encode(["error" => $conn->error]);
        }
        break;

    case "DELETE":
        parse_str(file_get_contents("php://input"), $params);
        $id = intval($params["id"] ?? 0);
        $sql = "DELETE FROM clientes WHERE id=$id";
        echo json_encode(["success" => $conn->query($sql)]);
        break;

    default:
        echo json_encode(["error" => "Método no soportado"]);
}
?>
