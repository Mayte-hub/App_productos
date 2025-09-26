<?php
include "../conexion.php";

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method == "GET") {
    $result = $conn->query("SELECT * FROM productos");
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    echo json_encode($productos);
}

if ($method == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $nombre      = $conn->real_escape_string($data["nombre"]);
    $descripcion = $conn->real_escape_string($data["descripcion"]);
    $precio      = $conn->real_escape_string($data["precio"]);
    $imagen      = $conn->real_escape_string($data["imagen"]);
    $categoria   = $conn->real_escape_string($data["categoria"]);

    $sql = "INSERT INTO productos (nombre, descripcion, precio, imagen, categoria) VALUES ('$nombre', '$descripcion', '$precio', '$imagen', '$categoria')";
    if ($conn->query($sql) === TRUE) {
        $id = $conn->insert_id;
        echo json_encode([
            "id" => $id,
            "nombre" => $nombre,
            "descripcion" => $descripcion,
            "precio" => $precio,
            "imagen" => $imagen,
            "categoria" => $categoria
        ]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}

if ($method == "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);

    $id          = $conn->real_escape_string($data["id"]);
    $nombre      = $conn->real_escape_string($data["nombre"]);
    $descripcion = $conn->real_escape_string($data["descripcion"]);
    $precio      = $conn->real_escape_string($data["precio"]);
    $imagen      = $conn->real_escape_string($data["imagen"]);
    $categoria   = $conn->real_escape_string($data["categoria"]);

    $sql = "UPDATE productos SET nombre='$nombre', descripcion='$descripcion', precio='$precio', imagen='$imagen', categoria='$categoria' WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            "id" => $id,
            "nombre" => $nombre,
            "descripcion" => $descripcion,
            "precio" => $precio,
            "imagen" => $imagen,
            "categoria" => $categoria
        ]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}

if ($method == "DELETE") {
    parse_str(file_get_contents("php://input"), $data);
    $id = $conn->real_escape_string($data["id"]);

    $sql = "DELETE FROM productos WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}
?>
