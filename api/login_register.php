<?php
array_shift($rutas);

if ($method == "POST") {
  if (sizeof($rutas) === 1 && $rutas[0] === "registro") {
    $db = new DBConnection();
    $nombre = $_POST["nombre_apellido"];
    $correo = $_POST["correo"];
    $usuario = $_POST["usuario"];
    $contrasena = password_hash($_POST["contrasena"], PASSWORD_BCRYPT); // Hasheamos la contraseña

    $res = [];

    try {
      // Verificar si el usuario existe
      $col_usuario = $db->prepare("SELECT id FROM usuarios WHERE usuario = ?");
      $col_usuario->bind_param("s", $usuario);
      $col_usuario->execute();
      $col_usuario->store_result();
      // Verificar si el correo ya existe
      $col_correo = $db->prepare("SELECT id FROM usuarios WHERE correo = ?");
      $col_correo->bind_param("s", $correo);
      $col_correo->execute();
      $col_correo->store_result();

      if ($col_usuario->num_rows > 0) {
        $res = [
          "status" => 409, // Código de conflicto
          "message" => "El usuario ya existe"
        ];
      } else if ($col_correo->num_rows > 0) {
        $res = [
          "status" => 409, // Código de conflicto
          "message" => "El correo ya existe"
        ];
      } else {
        // Si no existen duplicados, procedemos a la inserción
        $query_insert = $db->prepare("INSERT INTO usuarios (nombre_apellido, correo, usuario, contrasena) VALUES (?, ?, ?, ?)");
        $query_insert->bind_param("ssss", $nombre, $correo, $usuario, $contrasena);
        $query_insert->execute();

        if ($query_insert->affected_rows > 0) {
          $res = [
            "status" => 200,
            "message" => "Registro exitoso.",
            "id" => $query_insert->insert_id
          ];
        } else {
          $res = [
            "status" => 500,
            "message" => "Error al insertar el registro."
          ];
        }
      }
    } catch (Throwable $th) {
      $res = [
        "status" => 500,
        "message" => "Error: " . $th->getMessage()
      ];
    }

    echo json_encode($res, http_response_code($res["status"]));
    return;
  }

  if (sizeof($rutas) === 1 && $rutas[0] === "log-in") {
    $db = new DBConnection();
    $correo = $_POST["correo"];
    $contrasena = $_POST["contrasena"];

    $res = [];

    try {
      $query = $db->prepare("SELECT id, nombre_apellido, correo, usuario, contrasena FROM usuarios WHERE correo = ?");
      $query->bind_param("s", $correo);
      $query->execute();
      $query->store_result();

      if ($query->num_rows > 0) {
        $query->bind_result($id, $nombre, $correo, $usuario, $contrasena_hash);
        $query->fetch();

        if (password_verify($contrasena, $contrasena_hash)) {
          $_SESSION["correo"] = $correo;
          $_SESSION["contrasena"] = $contrasena;
          $res = [
            "status" => 200,
            "message" => "Inicio de sesión exitoso.",
            "id" => $id,
            "nombre" => $nombre,
            "correo" => $correo,
            "usuario" => $usuario
          ];
        } else {
          $res = [
            "status" => 401,
            "message" => "Contraseña incorrecta."
          ];
        }
      } else {
        $res = [
          "status" => 404,
          "message" => "Usuario no encontrado."
        ];
      }
    } catch (Throwable $th) {
      $res = [
        "status" => 500,
        "message" => "Error: " . $th->getMessage()
      ];
    }

    echo json_encode($res, http_response_code($res["status"]));
    return;
  }
}

$response = [
  "status" => 404,
  "message" => "la ruta '$uri' es incorrecta",
];
echo json_encode($response, http_response_code($response["status"]));
