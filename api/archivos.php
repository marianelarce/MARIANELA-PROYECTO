<?php 

    class Archivos {
        public function handleImage($name) {
            if (!file_exists($_FILES[$name]['tmp_name']) || !is_uploaded_file($_FILES[$name]['tmp_name']))
            {
                return "no-existe";
            }
            else
            {
                $ext = explode(".", $_FILES[$name]["name"]);  # image.jpg = [image , jpg]
                $allowedFileType = ["image/jpg", "image/jpeg", "image/png"];
                if (in_array( $_FILES[$name]['type'], $allowedFileType))
                {
                    $imagen = uniqid('img_', true) . time() . '_' . rand(1000, 9999) .".". end($ext);
                    return ["name" => $imagen, "image" => $_FILES[$name]["tmp_name"]];
                } else {
                    return "no-imagen";
                }
            }
        }
    }
?>