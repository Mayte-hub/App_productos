<?php
require_once("../conexion.php");

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Leer datos JSON enviados
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case "GET":
        $result = $conn->query("SELECT * FROM categorias");
        $categorias = [];
        while ($row = $result->fetch_assoc()) {
            $categorias[] = $row;
        }
        echo json_encode($categorias);
        break;

    case "POST":
        $nombre = $conn->real_escape_string($input["nombre"]);
        $descripcion = $conn->real_escape_string($input["descripcion"]);

        $sql = "INSERT INTO categorias (nombre, descripcion) VALUES ('$nombre', '$descripcion')";
        if ($conn->query($sql)) {
            echo json_encode(["id" => $conn->insert_id, "nombre" => $nombre, "descripcion" => $descripcion]);
        } else {
            echo json_encode(["error" => $conn->error]);
        }
        break;

    case "DELETE":
        parse_str(file_get_contents("php://input"), $params);
        $id = intval($params["id"] ?? 0);
        $sql = "DELETE FROM categorias WHERE id=$id";
        echo json_encode(["success" => $conn->query($sql)]);
        break;

    case "PUT":
        $id = intval($_GET["id"]);
        $nombre = $conn->real_escape_string($input["nombre"]);
        $descripcion = $conn->real_escape_string($input["descripcion"]);
        $sql = "UPDATE categorias SET nombre='$nombre', descripcion='$descripcion' WHERE id=$id";
        echo json_encode(["success" => $conn->query($sql)]);
        break;

    default:
        echo json_encode(["error" => "Método no soportado"]);
}
?>
