<?php
session_start();
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$db = "tienda_online";
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión a la BD"]));
}

// --- SISTEMA DE USUARIOS Y SESIONES ---
if (!isset($_SESSION['usuario'])) {
    $_SESSION['usuario'] = "Juan Pérez";
}
if (!isset($_SESSION['carritos'])) {
    $_SESSION['carritos'] = [];
}

$currentUser = $_SESSION['usuario'];

if (!isset($_SESSION['carritos'][$currentUser])) {
    $_SESSION['carritos'][$currentUser] = [];
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'get_usuario':
        echo json_encode(["usuario" => $currentUser]);
        break;

    case 'switch_user':
        $nuevoUsuario = $_POST['username'];
        $_SESSION['usuario'] = $nuevoUsuario;
        if (!isset($_SESSION['carritos'][$nuevoUsuario])) {
            $_SESSION['carritos'][$nuevoUsuario] = [];
        }
        echo json_encode(["status" => "success", "usuario" => $nuevoUsuario]);
        break;

    case 'get_productos':
        $sql = "SELECT * FROM productos";
        $result = $conn->query($sql);
        $productos = [];
        while ($row = $result->fetch_assoc()) {
            $productos[] = $row;
        }
        echo json_encode($productos);
        break;

    case 'get_cart_count':
        echo json_encode(["count" => count($_SESSION['carritos'][$currentUser])]);
        break;

    case 'add_carrito':
        $id = $_POST['id'];
        $nombre = $_POST['nombre'];
        $precio = $_POST['precio'];

        if (isset($_SESSION['carritos'][$currentUser][$id])) {
            $_SESSION['carritos'][$currentUser][$id]['cantidad']++;
        } else {
            $_SESSION['carritos'][$currentUser][$id] = [
                'nombre' => $nombre,
                'precio' => $precio,
                'cantidad' => 1
            ];
        }
        echo json_encode(["status" => "success", "total_items" => count($_SESSION['carritos'][$currentUser])]);
        break;

    case 'get_carrito':
        echo json_encode($_SESSION['carritos'][$currentUser]);
        break;

    case 'update_carrito':
        $id = $_POST['id'];
        $cantidad = intval($_POST['cantidad']);
        
        if ($cantidad > 0) {
            $_SESSION['carritos'][$currentUser][$id]['cantidad'] = $cantidad;
        } else {
            unset($_SESSION['carritos'][$currentUser][$id]);
        }
        echo json_encode(["status" => "success"]);
        break;

    case 'delete_carrito':
        $id = $_POST['id'];
        unset($_SESSION['carritos'][$currentUser][$id]);
        echo json_encode(["status" => "success"]);
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
$conn->close();
?>