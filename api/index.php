<?php
    session_start();
    
    header('Access-Control-Allow-Origin:*');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Content-Type: application/json; charset=UTF-8");

    date_default_timezone_set("America/La_Paz");
    
    if ($_GET["ver"] == "cerrar-sesion") {
        session_unset();
        session_destroy();
        $response = [
            "status" => 200,
            "message" => "Sesión cerrada"
        ];
        echo json_encode($response, http_response_code($response["status"]) | JSON_UNESCAPED_UNICODE);
        return;
    }

    $uri=isset($_GET["ver"]) ? $_GET["ver"] : "";
    if($uri) {
        $uri = strtok($uri, '?');
    } else {
        $response = [
            "message" => "La ruta no existe",
            "route" => ""
        ];
        echo json_encode($response,  http_response_code(404));
        return;
    }

    $rutas = array_filter(explode("/",$uri));
    $my_route = implode(",", $rutas); // string
    $method = $_SERVER['REQUEST_METHOD'];
    if (isset($method)) {
    
        require_once "./connection.php";

        if ($rutas[0] == "login") {
            require_once "./login_register.php";
            return;
        }

        if ((isset($_SESSION["correo"]) && isset($_SESSION["contrasena"]))) {
            $s_correo = $_SESSION["correo"];
            $s_contrasena = $_SESSION["contrasena"];
            $db = new DBConnection();
            $query = $db->prepare("SELECT contrasena FROM usuarios WHERE correo = ?");
            $query->bind_param("s", $s_correo);
            $query->execute();
            $query->store_result();
            if ($query->num_rows > 0) {
                $query->bind_result($contrasena_hash);
                $query->fetch();
                if (!password_verify($s_contrasena, $contrasena_hash)) {
                    $response = [
                    "status" => 409,
                    "message" => "Necesita iniciar sesión"
                    ];
                    echo json_encode($response, http_response_code($response["status"]) | JSON_UNESCAPED_UNICODE);
                    return;
                }
            } else {
                $response = [
                    "status" => 409,
                    "message" => "Necesita iniciar sesión"
                ];
                echo json_encode($response, http_response_code($response["status"]) | JSON_UNESCAPED_UNICODE);
                return;
            }
        } else {
            $response = [
                "status" => 409,
                "message" => "Necesita iniciar sesión"
            ];
            echo json_encode($response, http_response_code($response["status"]) | JSON_UNESCAPED_UNICODE);
            return;
        }
        if ($rutas[0] == "is-logged") {
            $response = [
                "status" => 200,
                "message" => "Sesión iniciada",
            ];
            echo json_encode($response, http_response_code($response["status"]) | JSON_UNESCAPED_UNICODE);
            return;
        }

        if ($rutas[0] == "mascotas") {
            require_once "./mascotas.php";
            return;
        }
    
        $response = [
            "message" => "La ruta no existe",
            "route" => $rutas[0]
        ];
        echo json_encode($response, http_response_code(404));
    } else {
        $response = [
            "status" => 400,
            "message" => "No se pudo reconer el método de la petición"
        ];
        echo json_encode($response, http_response_code($response["status"]) | JSON_UNESCAPED_UNICODE);
    }
?>