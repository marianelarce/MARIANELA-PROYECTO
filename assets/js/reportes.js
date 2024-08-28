const logOut = document.getElementById("nav_btn_logout");
logOut.addEventListener("click", async () => {
  try {
    const res = await fetch("./api/cerrar-sesion");
    const data = await res.json();
    if (res.status === 200) {
      window.location.href = "./";
    } else {
      alert("Error al cerrar sesión");
    }
  } catch (error) {
    alert("Ocurrió un error");
  }
});

const tBody = document.getElementById("cuerpo_tabla_reporte");
const VerRegistros = async () => {
  try {
    const res = await fetch("./api/mascotas/obtener");
    const data = await res.json();

    if (res.status === 200) {
      const datoMascota = data.data;
      const tBody = document.querySelector("tbody"); 
      if (datoMascota.length === 0) {
        tBody.innerHTML = `<tr><td class="text-center" colspan="100%">Sin registros</td></tr>`;
        return
      }
      tBody.innerHTML = "";
      const propiedades = [
        "a_codigo",
        "a_fecha",
        "a_propietario",
        "a_zona",
        "a_motivo",
        "a_motivo_otro",
        "b_nombre",
        "b_raza",
        "b_color",
        "b_especie",
        "b_sexo",
        "g_carnet",
        "g_fecha_vcr",
        "c_estado_animal",
        "c_observacion",
        "e_nombre",
        "e_fecha",
        "f_nombre",
        "f_fecha",
        // "f_ps_normativa",
        "f_fecha_dos",
      ];

      const fragment = document.createDocumentFragment();
      datoMascota.forEach((mascota) => {
        const tr = document.createElement("tr");
        for (const prop of propiedades) {
          const td = document.createElement("td");
          td.textContent = mascota[prop] || "-";
          tr.appendChild(td);
        }
        fragment.appendChild(tr);
      });
      tBody.appendChild(fragment);
    } else {
      alert("Error al obtener los registros");
    }
  } catch (error) {
    alert("Ocurrió un error");
  }
};

if (tBody) {
  VerRegistros();
}

const formFiltro = document.getElementById("form_filtro_mascota");
const btnReporte = document.getElementById("btn_pdf_mascota");

const fechaInicial = document.getElementById("fecha_inicial");
const fechaFinal = document.getElementById("fecha_final");

btnReporte.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const body = new FormData(formFiltro);
    const res = await fetch("./api/mascotas/reporte-pdf", {
        method: "POST",
        body
    });

    if (!res.ok) {
        const response = await res.json();
    } else {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
  } catch (error) {
    alert("Ocurrió un error");
  }
});

const btnFiltrar = document.getElementById("btn_filtrar_mascota");

btnFiltrar.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const body = new FormData(formFiltro);
    const res = await fetch("./api/mascotas/reporte", {
        method: "POST",
        body
    });
    const data = await res.json();

    if (res.status === 200) {
      const datoMascota = data.data;
      console.log(datoMascota);
      
      const tBody = document.querySelector("tbody"); 
      if (datoMascota.length === 0) {
        tBody.innerHTML = `<tr><td class="text-center" colspan="100%">Sin registros</td></tr>`;
        return
      }
      tBody.innerHTML = "";
      const propiedades = [
        "a_codigo",
        "a_fecha",
        "a_propietario",
        "a_zona",
        "a_motivo",
        "a_motivo_otro",
        "b_nombre",
        "b_raza",
        "b_color",
        "b_especie",
        "b_sexo",
        "g_carnet",
        "g_fecha_vcr",
        "c_estado_animal",
        "c_observacion",
        "e_nombre",
        "e_fecha",
        "f_nombre",
        "f_fecha",
        // "f_ps_normativa",
        "f_fecha_dos",
      ];

      const fragment = document.createDocumentFragment();
      datoMascota.forEach((mascota) => {
        const tr = document.createElement("tr");
        for (const prop of propiedades) {
          const td = document.createElement("td");
          td.textContent = mascota[prop] || "-";
          tr.appendChild(td);
        }
        fragment.appendChild(tr);
      });
      tBody.appendChild(fragment);
    } else {
      alert("Error al obtener los registros");
    }
  } catch (error) {
    alert("Ocurrió un error");
  }
});