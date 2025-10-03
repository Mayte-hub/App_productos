<?php
$host = "localhost";
$user = "root";
$pass = ""; // contraseña vacía
$db   = "inventario";
$port = 3315; // puerto correcto de tu MySQL en XAMPP

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("❌ Conexión fallida: " . $conn->connect_error);
}

header("Content-Type: application/json; charset=UTF-8");
?>
