<?php
    class DBConnection extends mysqli{

        public function __construct() {
                $this->connection();
        }

        // conexión a la base de datos	
        public function connection($server = "localhost", $user = "root", $pass = "", $schema = "zoonosis"){ 
            try {
                parent::__construct($server, $user, $pass, $schema);
                $this->query("SET NAMES 'utf8';");
                $this->query("SET CHARACTER SET utf8;");
                $this->query("SET SESSION collation_connection = 'utf8_unicode_ci';");
            } catch (Throwable $e) {
                if($this->connect_errno){
                    $res = [
                        "message" => "connection failed",
                        "info" => mysqli_connect_error(),
                        "status" => 500
                    ];

                    die(json_encode($res, http_response_code($res["status"]) | JSON_UNESCAPED_UNICODE));
                }
            }
        }
    }
?>