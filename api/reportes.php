<?php

class PDFFile
{
    public function reporte($datos)
    {
        $table_body = "";
        $data = $datos["data"];

        foreach ($data as $key => $value) {
            $table_body .= '<tr>
                    <td>'. $value["a_fecha"] . '</td>
                    <td>'. $value["a_propietario"] . '</td>
                    <td>'. $value["a_zona"] . '</td>
                    <td>'. $value["b_nombre"] . '</td>
                    <td>'. $value["b_raza"] . '</td>
                    <td>'. $value["b_color"] . '</td>
                    <td>'. $value["b_especie"] . '</td>
                    <td>'. $value["b_sexo"] . '</td>
                    <td>'. $value["c_estado_animal"] . '</td>
                    <td>'. $value["c_observacion"] . '</td>
                </tr>';
        }

        $html = '
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>Ventas</title>
                <link rel="stylesheet" href="./style.css"/>                
            </head>
            <body>

                <h1> Reporte Mascota </h1>

                <h2> Datos: </h2>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Propietario</th>
                            <th>Zona</th>
                            <th>Nombre Mascota</th>
                            <th>Raza</th>
                            <th>Color</th>
                            <th>Especie</th>
                            <th>Sexo</th>
                            <th>Estado</th>
                            <th>Observación</th>
                        </tr>
                    </thead>
                    <tbody>
                        ' . $table_body . '
                    </tbody>
              </table>
              
            </body>
            </html>';

        require_once '../vendor/autoload.php';
        $mpdf = new \Mpdf\Mpdf(['format' => 'Letter-L']);

        $mpdf->WriteHTML($html);

        $mpdf->Output("reporte.pdf", "I");
        return;
    }
}
