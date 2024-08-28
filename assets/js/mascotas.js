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

const formMascotas = document.getElementById("form_mascotas");
if (formMascotas) {
  formMascotas.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
    const formData = new FormData(formMascotas);
    const res = await fetch("./api/mascotas/guardar", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.status === 200) {
      alert("Mascota guardada exitosamente");
      formMascotas.reset();
    } else {
      alert("Error al guardar la mascota");
    }
    } catch (error) {
      alert("Ocurrió un error");
    }
  });
}

const tBody = document.getElementById("cuerpo_tabla_mascotas");
const VerRegistros = async () => {
  try {
    const res = await fetch("./api/mascotas/obtener");
    const data = await res.json();

    if (res.status === 200) {
      const datoMascota = data.data;
      const tBody = document.querySelector("tbody");
      if (datoMascota.length === 0) {
        tBody.innerHTML = `<tr><td class="text-center" colspan="100%">Sin registros</td></tr>`;
        return;
      }
      tBody.innerHTML = "";
      const propiedades = [
        "a_codigo",
        "a_fecha",
        "a_propietario",
        "a_zona",
        "mapa",
        "a_motivo",
        "a_motivo_otro",
        "b_imagen",
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
        "opciones",
      ];

      const fragment = document.createDocumentFragment();

      datoMascota.forEach((mascota) => {
        const tr = document.createElement("tr");
        for (const prop of propiedades) {
          const td = document.createElement("td");
          if (prop == "b_imagen") {
            tr.appendChild(td);
            MostrarImagen(mascota[prop], td);
            continue;
          }
          if (prop == "mapa") {
            tr.appendChild(td);
            MostrarMapa(td, mascota["a_latitud"], mascota["a_longitud"]);
            continue;
          }
          if (prop == "opciones") {
            tr.appendChild(td);
            opcionesTabla(mascota, td);
            continue;
          }
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

const modalImagen = (urlImagen, alt = "Imagen") => {
  const imagen = document.createElement("img");
  imagen.src = urlImagen;
  imagen.alt = alt;
  imagen.classList.add("img-fluid", "img-thumbnail");
  imagen.style.maxHeight = "100%";

  const i = document.createElement("i");
  i.classList.add("bi", "bi-x-lg");
  const cerrar = document.createElement("button");
  cerrar.classList.add(
    "position-absolute",
    "top-0",
    "start-50",
    "translate-middle-x",
    "btn",
    "btn-dark",
    "btn-lg",
    "mt-3"
  );
  cerrar.appendChild(i);

  const contenedorModal = document.createElement("div");
  contenedorModal.classList.add(
    "inner-div",
    "d-flex",
    "align-items-center",
    "justify-content-center"
  );
  contenedorModal.style.backgroundColor = "#000000e6";
  contenedorModal.appendChild(imagen);
  contenedorModal.appendChild(cerrar);
  contenedorModal.addEventListener("click", function (event) {
    if (
      (imagen && !imagen.contains(event.target)) ||
      (cerrar && cerrar.contains(event.target))
    ) {
      contenedorModal.remove();
    }
  });
  return contenedorModal;
};

const MostrarImagen = (datoImagen, td) => {
  td.classList.add("py-1", "text-center");
  if (datoImagen === null) {
    td.innerHTML = "-";
    return;
  }
  const urlImagen = `./imagenes/mascota/${datoImagen}`;
  const img = document.createElement("img");
  img.src = urlImagen;
  img.alt = "imagen";
  img.width = "60";
  img.height = "40";
  img.classList.add("rounded-2", "border", "border-primary-subtle");
  img.role = "button";

  td.append(img);

  img.addEventListener("click", () => {
    const imagen = modalImagen(urlImagen);
    document.body.appendChild(imagen);
  });
};

const MostrarMapa = (td, latitud, longitud) => {
  if (latitud && longitud) {
    const iconoMapa = document.createElement("i");
    iconoMapa.classList.add("bi", "bi-geo-alt-fill");
    const btnMapa = document.createElement("button");
    btnMapa.classList.add("btn", "btn-success", "btn-sm");
    btnMapa.appendChild(iconoMapa);
    td.appendChild(btnMapa);

    btnMapa.addEventListener("click", async () => {
      const innerDiv = document.createElement("div");
      innerDiv.classList.add("inner-div");
      const floatingDiv = document.createElement("div");
      floatingDiv.classList.add("floating-message", "p-md-4");
      floatingDiv.setAttribute("style", "width: 100%;");

      const div = document.createElement("div");
      div.classList.add("overflow-y-auto");
      div.style.height = "70vh";
      div.style.minHeight = "200px";
      div.style.width = "100%";
      const h4 = document.createElement("h4");
      h4.classList.add("text-center");
      h4.textContent = "MAPA";

      const iconoCerrar = document.createElement("i");
      iconoCerrar.classList.add("bi", "bi-x-lg", "fw-bold");
      const btnCerrar = document.createElement("button");
      btnCerrar.classList.add("btn", "p-0");
      btnCerrar.appendChild(iconoCerrar);
      const divCerrar = document.createElement("div");
      divCerrar.classList.add("text-end");
      divCerrar.appendChild(btnCerrar);
      btnCerrar.addEventListener("click", () => {
        innerDiv.remove();
      });

      const divContenedor = document.createElement("div");
      divContenedor.append(divCerrar, h4, div);

      const { Map } = await google.maps.importLibrary("maps");
      const initialLocation = {
        lat: parseFloat(latitud),
        lng: parseFloat(longitud),
      };
      const map = new Map(div, {
        center: initialLocation,
        zoom: 18,
        mapId: "DEMO_MAP_ID",
      });
      const { AdvancedMarkerElement, PinElement } =
        await google.maps.importLibrary("marker");
      const beachFlagImg = document.createElement("img");
      beachFlagImg.src = "./assets/images/marcador.png";
      beachFlagImg.setAttribute("style", "width: 40px; height: 40px;");
      beachFlagImg.setAttribute("alt", "Ubicación");
      marker = new AdvancedMarkerElement({
        map,
        position: initialLocation,
        content: beachFlagImg,
        title: "Ubicación",
      });

      floatingDiv.appendChild(divContenedor);
      innerDiv.appendChild(floatingDiv);

      document.body.appendChild(innerDiv);
    });
  }
};

const opcionesTabla = (datoMascota, td) => {
  const id = datoMascota["id"];
  td.setAttribute("class", "text-start text-nowrap");
  const btnEditar = document.createElement("a");
  btnEditar.setAttribute("class", "btn btn-warning btn-sm");
  btnEditar.setAttribute("title", "Editar");
  const iconoEditar = document.createElement("i");
  iconoEditar.setAttribute("class", "bi bi-pencil-square m-0 p-0");
  btnEditar.appendChild(iconoEditar);

  const btnEliminar = document.createElement("a");
  btnEliminar.setAttribute("class", "btn btn-danger btn-sm");
  btnEliminar.setAttribute("title", "Eliminar");
  const iconoEliminar = document.createElement("i");
  iconoEliminar.setAttribute("class", "bi bi-trash-fill");
  btnEliminar.appendChild(iconoEliminar);

  td.append(btnEditar, " ", btnEliminar);

  btnEditar.addEventListener("click", async (e) => {
    e.preventDefault();
    formularioEditar(datoMascota);
  });

  btnEliminar.addEventListener("click", async (e) => {
    e.preventDefault();
    if (confirm("¿Está seguro de eliminar el registro?")) {
      try {
        const res = await fetch(`./api/mascotas/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.status === 200) {
          const filaTabla = td.closest("tr");
          const cuerpoTabla = td.closest("tbody");
          filaTabla.remove();
          if (!cuerpoTabla.hasChildNodes()) {
            cuerpoTabla.innerHTML = `<tr><td class="text-center" colspan="100%">Sin registros</td></tr>`;
          }
        } else {
          alert("Error al eliminar el registro");
        }
      } catch (error) {
        alert("Ocurrió un error");
      }
    }
  });
};

const formularioEditar = async (mascota) => {
  const formEditar = `
    <div class="row justify-content-center mb-5">
      <div class="col-8 bg-white shadow rounded py-2">
        <h1 class="text-center pb-4">Editar mascota</h1>
        <form id="form_mascotas_edit">
          <!-- 1: a -->
          <fieldset class="border p-3 rounded">
            <div class="row">
              <div class="col-6">
                <div class="row mb-3">
                  <label for="a_codigo" class="col-sm-3 col-form-label">Código:</label>
                  <div class="col-sm-9">
                    <input type="text" class="form-control" id="a_codigo" name="a_codigo" value="${mascota["a_codigo"] || ""}" required>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row mb-3">
                  <label for="a_fecha" class="col-sm-3 col-form-label">Fecha:</label>
                  <div class="col-sm-9">
                    <input type="date" class="form-control" id="a_fecha" value="${mascota["a_fecha"] || ""}" name="a_fecha" required>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row mb-3">
                  <label for="a_propietario" class="col-sm-3 col-form-label">Propietario:</label>
                  <div class="col-sm-9">
                    <input type="text" class="form-control" id="a_propietario" value="${mascota["a_propietario"] || ""}" name="a_propietario" required>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row mb-3">
                  <label for="a_zona" class="col-sm-4 col-form-label">Zona (Dirección):</label>
                  <div class="col-sm-8">
                    <input type="text" class="form-control" id="a_zona" value="${mascota["a_zona"] || ""}" name="a_zona" required>
                  </div>
                </div>
              </div>
            </div>

            <fieldset class="p-0">
              <div id="map-edit" style="width: 100%; height: 500px;"></div>
              <p id="location">Latitud: ${mascota["a_latitud"] || "-"}, Longitud: ${mascota["a_longitud"] || "-"}</p>
              <input type="hidden" class="form-control" id="a_latitud" value="${mascota["a_latitud"] || ""}" name="a_latitud">
              <input type="hidden" class="form-control" id="a_longitud" value="${mascota["a_longitud"] || ""}" name="a_longitud">
            </fieldset>

            <div class="row">
              <div class="col-8">
                <div class="row mb-3">
                  <label for="a_motivo" class="col-sm-2 col-form-label">Motivo:</label>
                  <div class="col-sm-10">
                    <select class="form-control" id="a_motivo" name="a_motivo">
                      <option value="">-- elija una opción --</option>
                      <option value="Entrega" ${mascota["a_motivo"] === "Entrega" ? "selected" : ""}>Entrega</option>
                      <option value="Denuncia" ${mascota["a_motivo"] === "Denuncia" ? "selected" : ""}>Denuncia</option>
                      <option value="Captura" ${mascota["a_motivo"] === "Captura" ? "selected" : ""}>Captura</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <input type="text" class="form-control" id="a_motivo_otro" value="${mascota["a_motivo_otro"] || ""}" name="a_motivo_otro" placeholder="( otro motivo )">
              </div>
            </div>

          </fieldset>

          <!-- 2: b -->
          <fieldset class="border p-3 rounded mt-3">
            <legend class="float-none w-auto px-3">Características del animal</legend>

            <div class="row">
              <div class="col-12">
                <div class="row mb-3">
                  <label for="b_imagen" class="col-sm-2 col-form-label">Fotografía:</label>
                  <div class="col-sm-10">
                    <input type="file" class="form-control" id="b_imagen" name="b_imagen">
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-4">
                <div class="row mb-3">
                  <label for="b_nombre" class="col-sm-3 col-form-label">Nombre:</label>
                  <div class="col-sm-9">
                    <input type="text" class="form-control" id="b_nombre" value="${mascota["b_nombre"] || ""}" name="b_nombre" required>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="row mb-3">
                  <label for="b_raza" class="col-sm-3 col-form-label">Raza:</label>
                  <div class="col-sm-9">
                    <input type="text" class="form-control" id="b_raza" value="${mascota["b_raza"] || ""}" name="b_raza" required>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="row mb-3">
                  <label for="b_color" class="col-sm-3 col-form-label">Color:</label>
                  <div class="col-sm-9">
                    <input type="text" class="form-control" id="b_color" value="${mascota["b_color"] || ""}" name="b_color" required>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-6">
                <div class="row mb-3">
                  <label for="b_especie" class="col-sm-3 col-form-label">Especie:</label>
                  <div class="col-sm-9">
                    <select class="form-select" id="b_especie" name="b_especie" required>
                      <option value="">-- elija una opción --</option>
                      <option value="Canino" ${mascota["b_especie"] === "Canino" ? "selected" : ""}>Canino</option>
                      <option value="Felino" ${mascota["b_especie"] === "Felino" ? "selected" : ""}>Felino</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row mb-3">
                  <label for="b_sexo" class="col-sm-3 col-form-label">Sexo:</label>
                  <div class="col-sm-9">
                    <select class="form-select" id="b_sexo" name="b_sexo" required>
                      <option value="">-- elija una opción --</option>
                      <option value="Hembra" ${mascota["b_sexo"] === "Hembra" ? "selected" : ""}>Hembra</option>
                      <option value="Macho" ${mascota["b_sexo"] === "Macho" ? "selected" : ""}>Macho</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          <!-- 7: g -->
          <fieldset class="border p-3 rounded mt-3">
            <legend class="float-none w-auto px-3">Carnet de vacunación</legend>

            <div class="row">
              <div class="col-4">
                <div class="row mb-3">
                  <label for="g_carnet" class="col-sm-4 col-form-label">Carnet:</label>
                  <div class="col-sm-8">
                    <select class="form-select" id="g_carnet" name="g_carnet" required>
                      <option value="">-- elija una opción --</option>
                      <option value="Si" ${mascota["g_carnet"] === "Si" ? "selected" : ""}>Si</option>
                      <option value="No" ${mascota["g_carnet"] === "No" ? "selected" : ""}>No</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-8">
                <div class="row mb-3">
                  <label for="g_fecha_vcr" class="col-sm-7 col-form-label text-end">Fecha vacunación contra la rabia:</label>
                  <div class="col-sm-5">
                    <input type="date" class="form-control" id="g_fecha_vcr" value="${mascota["g_fecha_vcr"] || ""}" name="g_fecha_vcr" required>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          <!-- 3: c -->
          <fieldset class="border p-3 rounded mt-3">
            <legend class="float-none w-auto px-3">Estado del animal</legend>

            <div class="row px-3">
              <select class="form-select" id="c_estado_animal" name="c_estado_animal" required>
                <option value="">-- elija una opción --</option>
                <option value="Sano" ${mascota["c_estado_animal"] === "Sano" ? "selected" : ""}>Sano</option>
                <option value="Celo" ${mascota["c_estado_animal"] === "Celo" ? "selected" : ""}>Celo</option>
                <option value="Enfermedad leve" ${mascota["c_estado_animal"] === "Enfermedad leve" ? "selected" : ""}>Enfermedad leve</option>
                <option value="Enfermedad grave" ${mascota["c_estado_animal"] === "Enfermedad grave" ? "selected" : ""}>Enfermedad grave</option>
                <option value="Enfermedad terminal" ${mascota["c_estado_animal"] === "Enfermedad terminal" ? "selected" : ""}>Enfermedad terminal</option>
                <option value="Moribundo" ${mascota["c_estado_animal"] === "Moribundo" ? "selected" : ""}>Moribundo</option>
                <option value="Recojo de restos cadavericos" ${mascota["c_estado_animal"] === "Recojo de restos cadavericos" ? "selected" : ""}>Recojo de restos cadavéricos</option>
                <option value="Miasis" ${mascota["c_estado_animal"] === "Miasis" ? "selected" : ""}>Miasis</option>
                <option value="Atropellado" ${mascota["c_estado_animal"] === "Atropellado" ? "selected" : ""}>Atropellado</option>
              </select>
            </div>
          </fieldset>

          <!-- 4: d -->
          <fieldset class="border p-3 rounded mt-3">
            <legend class="float-none w-auto px-3">Observaciones</legend>
            <div>
              <textarea class="form-control" id="d_observacion" rows="3" name="c_observacion" required>${mascota["c_observacion"]}</textarea>
            </div>
          </fieldset>

          <!-- 5: e -->
          <fieldset class="border p-3 rounded mt-3">
            <legend class="float-none w-auto px-3">Retirado</legend>

            <div class="row">
              <div class="col-7">
                <div class="row mb-3">
                  <label for="e_nombre" class="col-sm-3 col-form-label">Nombre:</label>
                  <div class="col-sm-9">
                    <input type="text" class="form-control" id="e_nombre" value="${mascota["e_nombre"] || ""}" name="e_nombre">
                  </div>
                </div>
              </div>
              <div class="col-5">
                <div class="row mb-3">
                  <label for="e_fecha" class="col-sm-3 col-form-label">Fecha:</label>
                  <div class="col-sm-9">
                    <input type="date" class="form-control" id="e_fecha" value="${mascota["e_fecha"] || ""}" name="e_fecha">
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          <!-- 6: f -->
          <fieldset class="border p-3 rounded mt-3">
            <legend class="float-none w-auto px-3">Adopción</legend>

            <div class="row">
              <div class="col-7">
                <div class="row mb-3">
                  <label for="f_nombre" class="col-sm-3 col-form-label">Nombre:</label>
                  <div class="col-sm-9">
                    <input type="text" class="form-control" id="f_nombre" value="${mascota["f_nombre"] || ""}" name="f_nombre">
                  </div>
                </div>
              </div>
              <div class="col-5">
                <div class="row mb-3">
                  <label for="f_fecha" class="col-sm-3 col-form-label">Fecha:</label>
                  <div class="col-sm-9">
                    <input type="date" class="form-control" id="f_fecha" value="${mascota["f_fecha"] || ""}" name="f_fecha">
                  </div>
                </div>
              </div>
              <div class="col-5">
                <div class="row mb-3">
                  <label for="f_p_s_normativa" class="col-sm-12 col-form-label">Procedimiento según Normativa:</label>
                </div>
              </div>
              <div class="col-7">
                <div class="row mb-3">
                  <label for="f_fecha_dos" class="col-sm-2 col-form-label text-end">Fecha:</label>
                  <div class="col-sm-10">
                    <input type="date" class="form-control" id="f_fecha_dos" value="${mascota["f_fecha_dos"] || ""}" name="f_fecha_dos">
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          <div>
            <button type="submit" class="btn btn-warning mt-3 px-5">Editar</button>
            <button type="submit" class="btn btn-secondary mt-3 px-5" id="btn_cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>`;

  const divEditar = document.getElementById("div-editar");
  divEditar.innerHTML = formEditar;

  const mapEdit = divEditar.querySelector("#map-edit");
  const { Map } = await google.maps.importLibrary("maps");
  const initialLocation = {
    lat: (mascota["a_latitud"] ? parseFloat(mascota["a_latitud"]) : -17.406661645815724),
    lng: (mascota["a_longitud"] ? parseFloat(mascota["a_longitud"]) : -66.0456363912436),
  };
  const map = new Map(mapEdit, {
    center: initialLocation,
    zoom: 14,
    mapId: "DEMO_MAP_ID",
  });
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
  const beachFlagImg = document.createElement("img");
  beachFlagImg.src = "./assets/images/marcador.png";
  beachFlagImg.setAttribute("style", "width: 32px; height: 32px;");
  beachFlagImg.setAttribute("alt", "Ubicación");
  marker = new AdvancedMarkerElement({
    map,
    position: initialLocation,
    content: beachFlagImg,
    title: "Ubicación",
  });
  map.addListener("click", (event) => {
    const location = event.latLng;
    marker.position = location;


    divEditar.querySelector("#location").innerText =
      `Latitud: ${location.lat()}, Longitud: ${location.lng()}`;
    divEditar.querySelector("#a_latitud").value = location.lat();
    divEditar.querySelector("#a_longitud").value = location.lng();
  });

  divEditar.classList.remove("d-none");
  
  const divTabla = document.getElementById("div-listado");
  divTabla.classList.add("d-none");
  const elementoPrincipal = document.querySelector("body");
  elementoPrincipal.setAttribute("class", "bg-formulario-edit");

  const cancelar = divEditar.querySelector("#btn_cancelar");
  cancelar.addEventListener("click", (e) => {
    e.preventDefault();
    divEditar.classList.add("d-none");
    divTabla.classList.remove("d-none");
    elementoPrincipal.removeAttribute("class");
    divEditar.innerHTML = "";
  });

  const formEditarMascota = divEditar.querySelector("#form_mascotas_edit");
  formEditarMascota.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(formEditarMascota);
    try {
      const res = await fetch(`./api/mascotas/editar/${mascota["id"]}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.status === 200) {
        alert("Mascota editada exitosamente");
        divEditar.classList.add("d-none");
        divTabla.classList.remove("d-none");
        elementoPrincipal.removeAttribute("class");
        divEditar.innerHTML = "";
        VerRegistros();
      } else {
        alert("Error al editar la mascota");
      }
    } catch (error) {
      alert("Ocurrió un error");
    }
  });
};
