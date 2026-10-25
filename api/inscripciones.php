<?php
require __DIR__ . '/bootstrap.php';

$usuario = $_SESSION['usuario'] ?? null;
if (!$usuario) {
    responder(401, ['error' => 'Inicia sesión para acceder a las inscripciones.']);
}

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $consulta = $pdo->prepare(
        'SELECT i.id, i.nombre, i.correo, c.nombre AS curso, i.modalidad
         FROM inscripciones i
         INNER JOIN cursos c ON c.id = i.curso_id
         WHERE i.user_id = ?
         ORDER BY i.fecha_inscripcion DESC, i.id DESC'
    );
    $consulta->execute([$usuario['id']]);
    responder(200, $consulta->fetchAll());
}

if ($metodo === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);
    if (!is_array($datos)) {
        responder(400, ['error' => 'El cuerpo de la solicitud no es válido.']);
    }

    $curso = trim($datos['curso'] ?? '');
    $modalidad = $datos['modalidad'] ?? '';
    $acepta = filter_var($datos['acepta'] ?? false, FILTER_VALIDATE_BOOLEAN);

    if (!in_array($modalidad, ['Presencial', 'Virtual'], true) || !$acepta) {
        responder(422, ['error' => 'La modalidad o la aceptación no son válidas.']);
    }

    $consultaCurso = $pdo->prepare('SELECT id FROM cursos WHERE nombre = ? LIMIT 1');
    $consultaCurso->execute([$curso]);
    $cursoId = $consultaCurso->fetchColumn();
    if (!$cursoId) {
        responder(422, ['error' => 'No se encontró el curso seleccionado en la base de datos.']);
    }

    $consultaExistente = $pdo->prepare(
        'SELECT id FROM inscripciones WHERE user_id = ? AND curso_id = ? LIMIT 1'
    );
    $consultaExistente->execute([$usuario['id'], $cursoId]);
    $idExistente = $consultaExistente->fetchColumn();

    if ($idExistente) {
        responder(409, ['error' => 'Ya estás inscrito en este curso.']);
    }

    $insertar = $pdo->prepare(
        'INSERT INTO inscripciones (user_id, nombre, correo, curso_id, modalidad, acepta)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $insertar->execute([
        $usuario['id'],
        $usuario['nombre'],
        $usuario['correo'],
        $cursoId,
        $modalidad,
        (int) $acepta,
    ]);

    responder(201, [
        'id' => (int) $pdo->lastInsertId(),
        'nombre' => $usuario['nombre'],
        'correo' => $usuario['correo'],
        'curso' => $curso,
        'modalidad' => $modalidad,
    ]);
}

if ($metodo === 'DELETE') {
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    if (!$id) {
        responder(400, ['error' => 'Falta un id de inscripción válido.']);
    }

    $eliminar = $pdo->prepare('DELETE FROM inscripciones WHERE id = ? AND user_id = ?');
    $eliminar->execute([$id, $usuario['id']]);
    responder(200, ['eliminada' => $eliminar->rowCount() > 0]);
}

header('Allow: GET, POST, DELETE');
responder(405, ['error' => 'Método no permitido.']);
