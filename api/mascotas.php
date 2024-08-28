<?php
array_shift($rutas);

if ($method == "GET") {
  if (sizeof($rutas) === 1 && $rutas[0] === "obtener") {
    try {
      $db = new DBConnection();
      $query_mascota = $db->prepare("SELECT * FROM mascotas");
      $query_mascota->execute();
      $req =  $query_mascota->get_result();
      $data = $req->fetch_all(MYSQLI_ASSOC);
      $res = [
        "status" => 200,
        "rows" => $db->affected_rows,
        "data" => $data,
      ];
    } catch (Throwable $th) {
      $res = [
        "status" => 500,
        "msg_error" => "error al listar mascotas",
      ];
    }
    echo json_encode($res, http_response_code($res["status"]));
    return;
  }
}

if ($method == "POST") {
  if (sizeof($rutas) === 2 && $rutas[0] === "editar") {
    $id = $rutas[1];
    $a_codigo = $_POST["a_codigo"];
    $a_fecha = $_POST["a_fecha"];
    $a_propietario = $_POST["a_propietario"];
    $a_zona = $_POST["a_zona"];
    $a_latitud = !empty($_POST["a_latitud"]) && trim($_POST["a_latitud"]) != "" ? $_POST["a_latitud"] : null;
    $a_longitud = !empty($_POST["a_longitud"]) && trim($_POST["a_longitud"]) != "" ? $_POST["a_longitud"] : null;
    $a_motivo = !empty($_POST["a_motivo"]) && trim($_POST["a_motivo"]) != "" ? $_POST["a_motivo"] : null;
    $a_motivo_otro = !empty($_POST["a_motivo_otro"]) && trim($_POST["a_motivo_otro"]) != "" ? $_POST["a_motivo_otro"] : null;
    $b_nombre = $_POST["b_nombre"];
    $b_raza = $_POST["b_raza"];
    $b_color = $_POST["b_color"];
    $b_especie = $_POST["b_especie"];
    $b_sexo = $_POST["b_sexo"];
    $c_estado_animal = $_POST["c_estado_animal"];
    $c_observacion = $_POST["c_observacion"];
    $e_nombre = !empty($_POST["e_nombre"]) && trim($_POST["e_nombre"]) != "" ? $_POST["e_nombre"] : null;
    $e_fecha = !empty($_POST["e_fecha"]) && trim($_POST["e_fecha"]) != "" ? $_POST["e_fecha"] : null;
    $f_nombre = !empty($_POST["f_nombre"]) && trim($_POST["f_nombre"]) != "" ? $_POST["f_nombre"] : null;
    $f_fecha = !empty($_POST["f_fecha"]) && trim($_POST["f_fecha"]) != "" ? $_POST["f_fecha"] : null;
    // $f_ps_normativa = $_POST["f_ps_normativa"];
    $f_fecha_dos = !empty($_POST["f_fecha_dos"]) && trim($_POST["f_fecha_dos"]) != "" ? $_POST["f_fecha_dos"] : null;
    $g_carnet = $_POST["g_carnet"];
    $g_fecha_vcr = $_POST["g_fecha_vcr"];

    $res = [];
    try {
      require_once './archivos.php';
      $valid = new Archivos();
      $old_image = null;
      $is_image = $valid->handleImage("b_imagen");
      $b_imagen = null;
      if ($is_image === "no-existe") {
        $b_imagen = null;
      } else if ($is_image === "no-imagen") {
        $b_imagen = null;
      } else {
        $old_data = $db->prepare("SELECT b_imagen FROM mascotas WHERE id = ?");
        $old_data->bind_param("i", $id);
        $old_data->execute();
        $old_image = $old_data->get_result()->fetch_assoc();
        $old_image = $old_image["b_imagen"];

        $b_imagen = $is_image["name"];
      }

      $db = new DBConnection();
      $query_update = [];
      if ($b_imagen) {
        $query_update = $db->prepare(
          "UPDATE mascotas SET a_codigo = ?, a_fecha = ?, a_propietario = ?, a_zona = ?, a_latitud = ?, a_longitud = ?, a_motivo = ?, a_motivo_otro = ?, b_imagen = ?, b_nombre = ?, b_raza = ?, b_color = ?, b_especie = ?, b_sexo = ?, c_estado_animal = ?, c_observacion = ?, e_nombre = ?, e_fecha = ?, f_nombre = ?, f_fecha = ?, f_fecha_dos = ?, g_carnet = ?, g_fecha_vcr = ? WHERE id = ?"
        );
        $query_update->bind_param("sssssssssssssssssssssssi", $a_codigo, $a_fecha, $a_propietario, $a_zona, $a_latitud, $a_longitud, $a_motivo, $a_motivo_otro, $b_imagen, $b_nombre, $b_raza, $b_color, $b_especie, $b_sexo, $c_estado_animal, $c_observacion, $e_nombre, $e_fecha, $f_nombre, $f_fecha, $f_fecha_dos, $g_carnet, $g_fecha_vcr, $id);
        $query_update->execute();
      } else {
        $query_update = $db->prepare(
          "UPDATE mascotas SET a_codigo = ?, a_fecha = ?, a_propietario = ?, a_zona = ?, a_latitud = ?, a_longitud = ?, a_motivo = ?, a_motivo_otro = ?, b_nombre = ?, b_raza = ?, b_color = ?, b_especie = ?, b_sexo = ?, c_estado_animal = ?, c_observacion = ?, e_nombre = ?, e_fecha = ?, f_nombre = ?, f_fecha = ?, f_fecha_dos = ?, g_carnet = ?, g_fecha_vcr = ? WHERE id = ?"
        );
        $query_update->bind_param("ssssssssssssssssssssssi", $a_codigo, $a_fecha, $a_propietario, $a_zona, $a_latitud, $a_longitud, $a_motivo, $a_motivo_otro, $b_nombre, $b_raza, $b_color, $b_especie, $b_sexo, $c_estado_animal, $c_observacion, $e_nombre, $e_fecha, $f_nombre, $f_fecha, $f_fecha_dos, $g_carnet, $g_fecha_vcr, $id);
        $query_update->execute();
      }

      if ($query_update->affected_rows > 0) {
        if ($b_imagen) {
          $file_path = '../imagenes/mascota/';
          if (!file_exists($file_path)) mkdir($file_path, 0777, true);
          move_uploaded_file($is_image["image"], $file_path . $is_image["name"]);
        }
        if ($b_imagen && $old_image) {
          $file_path = "../imagenes/mascota/". $old_image;
          if (file_exists($file_path)) unlink($file_path);
        }
        $res = [
          "status" => 200,
          "message" => "Registro actualizado."
        ];
      } else {
        $res = [
          "status" => 500,
          "message" => "Error al actualizar el registro."
        ];
      }
    } catch (Throwable $th) {
      $res = [
        "status" => 500,
        "message" => "Error al actualizar el registro."
      ];
    }
    echo json_encode($res, http_response_code($res["status"]));
    return;
  }

  if (sizeof($rutas) === 1 && $rutas[0] === "guardar") {
    $a_codigo = $_POST["a_codigo"];
    $a_fecha = $_POST["a_fecha"];
    $a_propietario = $_POST["a_propietario"];
    $a_zona = $_POST["a_zona"];
    $a_latitud = !empty($_POST["a_latitud"]) && trim($_POST["a_latitud"]) != "" ? $_POST["a_latitud"] : null;
    $a_longitud = !empty($_POST["a_longitud"]) && trim($_POST["a_longitud"]) != "" ? $_POST["a_longitud"] : null;
    $a_motivo = !empty($_POST["a_motivo"]) && trim($_POST["a_motivo"]) != "" ? $_POST["a_motivo"] : null;
    $a_motivo_otro = !empty($_POST["a_motivo_otro"]) && trim($_POST["a_motivo_otro"]) != "" ? $_POST["a_motivo_otro"] : null;
    $b_nombre = $_POST["b_nombre"];
    $b_raza = $_POST["b_raza"];
    $b_color = $_POST["b_color"];
    $b_especie = $_POST["b_especie"];
    $b_sexo = $_POST["b_sexo"];
    $c_estado_animal = $_POST["c_estado_animal"];
    $c_observacion = $_POST["c_observacion"];
    $e_nombre = !empty($_POST["e_nombre"]) && trim($_POST["e_nombre"]) != "" ? $_POST["e_nombre"] : null;
    $e_fecha = !empty($_POST["e_fecha"]) && trim($_POST["e_fecha"]) != "" ? $_POST["e_fecha"] : null;
    $f_nombre = !empty($_POST["f_nombre"]) && trim($_POST["f_nombre"]) != "" ? $_POST["f_nombre"] : null;
    $f_fecha = !empty($_POST["f_fecha"]) && trim($_POST["f_fecha"]) != "" ? $_POST["f_fecha"] : null;
    // $f_ps_normativa = $_POST["f_ps_normativa"];
    $f_fecha_dos = !empty($_POST["f_fecha_dos"]) && trim($_POST["f_fecha_dos"]) != "" ? $_POST["f_fecha_dos"] : null;
    $g_carnet = $_POST["g_carnet"];
    $g_fecha_vcr = $_POST["g_fecha_vcr"];

    $res = [];
    try {
      require_once './archivos.php';
      $valid = new Archivos();
      $is_image = $valid->handleImage("b_imagen");
      $b_imagen = null;
      if ($is_image === "no-existe") {
        $b_imagen = null;
      } else if ($is_image === "no-imagen") {
        $b_imagen = null;
      } else {
        $b_imagen = $is_image["name"];
      }

      $db = new DBConnection();
      $query_insert = $db->prepare(
        "INSERT INTO mascotas (a_codigo, a_fecha, a_propietario, a_zona, a_latitud, a_longitud, a_motivo, a_motivo_otro, b_imagen, b_nombre, b_raza, b_color, b_especie, b_sexo, c_estado_animal, c_observacion, e_nombre, e_fecha, f_nombre, f_fecha, f_fecha_dos , g_carnet, g_fecha_vcr)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
      );
      $query_insert->bind_param("sssssssssssssssssssssss", $a_codigo, $a_fecha, $a_propietario, $a_zona, $a_latitud, $a_longitud, $a_motivo, $a_motivo_otro, $b_imagen, $b_nombre, $b_raza, $b_color, $b_especie, $b_sexo, $c_estado_animal, $c_observacion, $e_nombre, $e_fecha, $f_nombre, $f_fecha, $f_fecha_dos, $g_carnet, $g_fecha_vcr);
      $query_insert->execute();

      if ($query_insert->affected_rows > 0) {
        if ($b_imagen) {
          $file_path = '../imagenes/mascota/';
          if (!file_exists($file_path)) mkdir($file_path, 0777, true);
          move_uploaded_file($is_image["image"], $file_path . $is_image["name"]);
        }
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
    } catch (Throwable $th) {
      $res = [
        "status" => 500,
        "message" => "Error al insertar el registro."
      ];
    }
    echo json_encode($res, http_response_code($res["status"]));
    return;
  }

  if (sizeof($rutas) === 1 && ($rutas[0] === "reporte" || $rutas[0] === "reporte-pdf")) {
    try {
      $quer = "";
      $types = "";
      $bp_value = [];
      if (isset($_POST["fecha_inicial"]) && trim($_POST["fecha_inicial"])) {
          $types.="s";
          array_push($bp_value, $_POST["fecha_inicial"]);
          if ($quer === "") {
            $quer .= " WHERE a_fecha >= ?";
          } else {
            $quer .= " AND a_fecha >= ?";
          }
      }
      if (isset($_POST["fecha_final"]) && trim($_POST["fecha_final"])) {
          $types.="s";
          array_push($bp_value, $_POST["fecha_final"]);
          if ($quer === "") {
            $quer .= " WHERE a_fecha <= ?";
          } else {
            $quer .= " AND a_fecha <= ?";
          }
      }

      $db = new DBConnection();
      $query_mascota = $db->prepare("SELECT * FROM mascotas $quer");
      if ($types) {
        $query_mascota->bind_param($types, ...$bp_value);
      }
      $query_mascota->execute();
      $req =  $query_mascota->get_result();
      $data = $req->fetch_all(MYSQLI_ASSOC);
      $res = [
        "status" => 200,
        "rows" => $db->affected_rows,
        "data" => $data,
      ];
      if ($rutas[0] === "reporte-pdf") {
        require_once "./reportes.php";
        $object = new PDFFile();
        $object->reporte($res);
        return;
      }
    } catch (Throwable $th) {
      $res = [
        "status" => 500,
        "msg_error" => "error al listar mascotas",
      ];
    }
    echo json_encode($res, http_response_code($res["status"]));
    return;
  }
}

if ($method == "DELETE") {
  if (sizeof($rutas) === 1) {
    $id = $rutas[0];
    $res = [];
    try {
      $db = new DBConnection();
      $old_data = $db->prepare("SELECT b_imagen FROM mascotas WHERE id = ?");
      $old_data->bind_param("i", $id);
      $old_data->execute();
      $old_image = $old_data->get_result()->fetch_assoc();
      $old_image = $old_image["b_imagen"];

      $query_delete = $db->prepare("DELETE FROM mascotas WHERE id = ?");
      $query_delete->bind_param("i", $id);
      $query_delete->execute();
      if ($query_delete->affected_rows > 0) {
        
        if ($old_image) {
          $file_path = "../imagenes/mascota/". $old_image;
          if (file_exists($file_path)) unlink($file_path);
        }
        $res = [
          "status" => 200,
          "message" => "Registro eliminado."
        ];
      } else {
        $res = [
          "status" => 500,
          "message" => "Error al eliminar el registro."
        ];
      }
    } catch (Throwable $th) {
      $res = [
        "status" => 500,
        "message" => "Error al eliminar el registro."
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
