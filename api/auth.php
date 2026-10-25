<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    responder(200, ['usuario' => $_SESSION['usuario'] ?? null]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST');
    responder(405, ['error' => 'Método no permitido.']);
}

$datos = json_decode(file_get_contents('php://input'), true);
if (!is_array($datos)) {
    responder(400, ['error' => 'El cuerpo de la solicitud no es válido.']);
}

$accion = $datos['accion'] ?? '';

if ($accion === 'logout') {
    $_SESSION = [];
    session_destroy();
    setcookie(session_name(), '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    responder(200, ['usuario' => null]);
}

$correo = strtolower(trim($datos['correo'] ?? ''));
$password = $datos['password'] ?? '';

if (!filter_var($correo, FILTER_VALIDATE_EMAIL) || !is_string($password)) {
    responder(422, ['error' => 'Ingresa un correo y contraseña válidos.']);
}

if ($accion === 'registro') {
    $nombre = trim($datos['nombre'] ?? '');
    if (mb_strlen($nombre) < 3) {
        responder(422, ['error' => 'El nombre debe tener al menos 3 caracteres.']);
    }
    if (strlen($password) < 8) {
        responder(422, ['error' => 'La contraseña debe tener al menos 8 caracteres.']);
    }

    try {
        $crear = $pdo->prepare(
            'INSERT INTO usuarios (nombre, correo, password_hash) VALUES (?, ?, ?)'
        );
        $crear->execute([$nombre, $correo, password_hash($password, PASSWORD_DEFAULT)]);
        $usuario = [
            'id' => (int) $pdo->lastInsertId(),
            'nombre' => $nombre,
            'correo' => $correo,
        ];
    } catch (PDOException $error) {
        if ($error->getCode() === '23000') {
            responder(409, ['error' => 'Ya existe una cuenta con ese correo.']);
        }
        error_log($error->getMessage());
        responder(500, ['error' => 'No se pudo crear la cuenta.']);
    }
} elseif ($accion === 'login') {
    $buscar = $pdo->prepare(
        'SELECT id, nombre, correo, password_hash FROM usuarios WHERE correo = ? LIMIT 1'
    );
    $buscar->execute([$correo]);
    $fila = $buscar->fetch();

    if (!$fila || !password_verify($password, $fila['password_hash'])) {
        responder(401, ['error' => 'El correo o la contraseña son incorrectos.']);
    }

    $usuario = [
        'id' => (int) $fila['id'],
        'nombre' => $fila['nombre'],
        'correo' => $fila['correo'],
    ];
} else {
    responder(400, ['error' => 'Acción no válida.']);
}

session_regenerate_id(true);
$_SESSION['usuario'] = $usuario;
responder(200, ['usuario' => $usuario]);
