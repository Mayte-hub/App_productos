<?php
// index.php - CRUD de productos

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "";
$db   = "inventario_bebe"; // cambia este nombre si tu base es otra

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];

// ✅ LISTAR PRODUCTOS (GET)
if ($method === "GET") {
    $result = $conn->query("SELECT * FROM productos");
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    echo json_encode($productos);
}

// ✅ AGREGAR PRODUCTO (POST)
elseif ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["error" => "Datos no válidos"]);
        exit;
    }

    $nombre = $conn->real_escape_string($data["nombre"]);
    $descripcion = $conn->real_escape_string($data["descripcion"]);
    $precio = (float) $data["precio"];
    $imagen = $conn->real_escape_string($data["imagen"]);
    $categoria = $conn->real_escape_string($data["categoria"]);

    $sql = "INSERT INTO productos (nombre, descripcion, precio, imagen, categoria) 
            VALUES ('$nombre', '$descripcion', '$precio', '$imagen', '$categoria')";

    if ($conn->query($sql)) {
        $data["id"] = $conn->insert_id;
        echo json_encode($data);
    } else {
        echo json_encode(["error" => "Error al insertar: " . $conn->error]);
    }
}

// ✅ EDITAR PRODUCTO (PUT)
elseif ($method === "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data["id"])) {
        echo json_encode(["error" => "Datos inválidos"]);
        exit;
    }

    $id = (int) $data["id"];
    $nombre = $conn->real_escape_string($data["nombre"]);
    $descripcion = $conn->real_escape_string($data["descripcion"]);
    $precio = (float) $data["precio"];
    $imagen = $conn->real_escape_string($data["imagen"]);
    $categoria = $conn->real_escape_string($data["categoria"]);

    $sql = "UPDATE productos SET 
                nombre='$nombre',
                descripcion='$descripcion',
                precio='$precio',
                imagen='$imagen',
                categoria='$categoria'
            WHERE id=$id";

    if ($conn->query($sql)) {
        echo json_encode($data);
    } else {
        echo json_encode(["error" => "Error al actualizar: " . $conn->error]);
    }
}

// ✅ ELIMINAR PRODUCTO (DELETE)
elseif ($method === "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data["id"])) {
        echo json_encode(["error" => "ID inválido"]);
        exit;
    }

    $id = (int) $data["id"];
    $sql = "DELETE FROM productos WHERE id=$id";

    if ($conn->query($sql)) {
        echo json_encode(["success" => "Producto eliminado"]);
    } else {
        echo json_encode(["error" => "Error al eliminar: " . $conn->error]);
    }
}

$conn->close();
?>
