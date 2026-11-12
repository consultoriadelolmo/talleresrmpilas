// Formulario de presupuesto: valida los campos y compone un mensaje de WhatsApp.
// Así el taller recibe solicitudes reales sin necesidad de servidor ni base de datos.

const WHATSAPP_TALLER = "34625124016"; // Número del taller (sin + ni espacios)

const form = document.getElementById("form-presupuesto");
const okPanel = document.getElementById("form-ok");
const okLink = document.getElementById("form-ok-link");

function marcarCampo(nombre, valido) {
  const field = form.querySelector(`[data-field="${nombre}"]`);
  field.classList.toggle("invalid", !valido);
  return valido;
}

function validar() {
  const nombre = form.nombre.value.trim();
  const telefono = form.telefono.value.replace(/[\s-]/g, "");
  const averia = form.averia.value.trim();

  const okNombre = marcarCampo("nombre", nombre.length >= 2);
  const okTelefono = marcarCampo("telefono", /^\+?\d{9,}$/.test(telefono));
  const okAveria = marcarCampo("averia", averia.length >= 10);

  return okNombre && okTelefono && okAveria
    ? { nombre, telefono, averia }
    : null;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const datos = validar();
  if (!datos) {
    const primeroInvalido = form.querySelector(".field.invalid input, .field.invalid textarea");
    if (primeroInvalido) primeroInvalido.focus();
    return;
  }

  const mensaje =
    `Hola, soy ${datos.nombre} (${datos.telefono}). ` +
    `Me gustaría pedir presupuesto: ${datos.averia}`;
  const url = `https://wa.me/${WHATSAPP_TALLER}?text=${encodeURIComponent(mensaje)}`;

  okLink.href = url;
  window.open(url, "_blank", "noopener");

  form.style.display = "none";
  okPanel.classList.add("show");
  okPanel.querySelector("strong").focus?.();
});

// Limpia el error de un campo en cuanto el usuario corrige
form.addEventListener("input", (e) => {
  const field = e.target.closest(".field");
  if (field && field.classList.contains("invalid")) {
    field.classList.remove("invalid");
  }
});
