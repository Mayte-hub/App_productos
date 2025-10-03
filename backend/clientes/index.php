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
        $email = $conn->real_escape_string($input["email"]);
        $telefono = $conn->real_escape_string($input["telefono"]);

        $sql = "INSERT INTO clientes (nombre, email, telefono) 
                VALUES ('$nombre', '$email', '$telefono')";

        if ($conn->query($sql)) {
            echo json_encode([
                "id" => $conn->insert_id,
                "nombre" => $nombre,
                "email" => $email,
                "telefono" => $telefono
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
