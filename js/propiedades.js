// Carga, filtra y muestra las propiedades guardadas en /data/propiedades.json
// (ese archivo lo edita el panel /admin). No requiere servidor ni backend.

const TIPO_LABEL = { casa: "Casa", departamento: "Departamento", terreno: "Terreno", local: "Local comercial", nave_industrial: "Nave industrial", oficina: "Oficina" };
const OPERACION_LABEL = { venta: "Venta", renta: "Renta" };

function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function tienePrecio(p) {
  return p.precio !== undefined && p.precio !== null && p.precio !== "" && Number(p.precio) > 0;
}

function formatPrecio(p) {
  if (!tienePrecio(p)) return "Precio a consultar";
  const n = Number(p.precio);
  const monto = n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
  return p.operacion === "renta" ? `${monto} /mes` : monto;
}

function metaLine(p) {
  const parts = [];
  if (p.recamaras) parts.push(`${p.recamaras} rec.`);
  if (p.banos) parts.push(`${p.banos} baños`);
  if (p.m2_construccion) parts.push(`${p.m2_construccion} m² const.`);
  if (p.m2_terreno) parts.push(`${p.m2_terreno} m² terreno`);
  return parts.join(" · ");
}

function direccionLine(p) {
  const parts = [];
  if (p.direccion) parts.push(p.direccion);
  if (p.codigo_postal) parts.push(`CP ${p.codigo_postal}`);
  return parts.join(" · ");
}

let _promise = null;
function loadPropiedades() {
  if (_promise) return _promise;
  _promise = fetch("/data/propiedades.json", { cache: "no-store" })
    .then((res) => res.json())
    .then((json) => (Array.isArray(json.propiedades) ? json.propiedades : []))
    .catch(() => []);
  return _promise;
}

function getParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}

function setParam(key, value) {
  const url = new URL(window.location.href);
  if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
  window.history.pushState({}, "", url);
}

function matches(p, params) {
  if (!p.publicada) return false;
  if (params.tipo && params.tipo !== "todos" && p.tipo !== params.tipo) return false;
  if (params.operacion && params.operacion !== "todas" && p.operacion !== params.operacion) return false;
  if (params.zona && params.zona !== "todas" && p.zona !== params.zona) return false;
  if (params.precio) {
    if (!tienePrecio(p)) return false;
    if (Number(p.precio) > Number(params.precio)) return false;
  }
  if (params.q) {
    const q = params.q.toLowerCase();
    const hay = `${p.titulo} ${p.zona} ${p.direccion || ""} ${p.codigo_postal || ""} ${p.descripcion || ""}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function cardHTML(p) {
  const foto = (p.fotos && p.fotos[0]) || "/og.jpg";
  return `
<article class="prop-card">
  <button class="prop-card-img" type="button" data-ver="${esc(p.id)}" aria-label="Ver detalles de ${esc(p.titulo)}">
    <img src="${esc(foto)}" alt="${esc(p.titulo)}" loading="lazy">
    <span class="prop-tag">${esc(TIPO_LABEL[p.tipo] || p.tipo)} · ${esc(OPERACION_LABEL[p.operacion] || p.operacion)}</span>
  </button>
  <div class="prop-card-body">
    <p class="prop-price">${formatPrecio(p)}</p>
    <h3>${esc(p.titulo)}</h3>
    <p class="prop-zona">${esc(p.zona)}</p>
    <p class="prop-meta">${esc(metaLine(p))}</p>
    <button class="btn btn-ink" type="button" data-ver="${esc(p.id)}">Ver detalles</button>
  </div>
</article>`;
}

function renderGrid(grid, list) {
  grid.innerHTML = list.map(cardHTML).join("");
}

function syncFilterForm(params) {
  const form = document.querySelector("[data-filter]");
  if (!form) return;
  if (params.tipo && form.tipo) form.tipo.value = params.tipo;
  if (params.operacion && form.operacion) form.operacion.value = params.operacion;
  if (params.zona && form.zona) form.zona.value = params.zona;
  if (params.precio && form.precio) form.precio.value = params.precio;
}

// Llena el selector de "Zona" con las colonias que realmente existen en las
// propiedades publicadas, para que una colonia nueva capturada en /admin
// aparezca sola en el buscador sin tocar código.
async function initZonaFilter() {
  const selects = document.querySelectorAll('[data-filter] select[name="zona"]');
  if (!selects.length) return;
  const data = await loadPropiedades();
  const zonas = [...new Set(data.filter((p) => p.publicada).map((p) => p.zona).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));
  const params = getParams();
  selects.forEach((select) => {
    const actual = params.zona || select.value;
    select.innerHTML = `<option value="todas">Todas las zonas</option>` +
      zonas.map((z) => `<option value="${esc(z)}">${esc(z)}</option>`).join("");
    if (actual && zonas.includes(actual)) select.value = actual;
  });
}

// --- Modal de detalle ---

function ensureModal() {
  if (document.getElementById("prop-modal")) return;
  const wrap = document.createElement("div");
  wrap.innerHTML = `
<div class="modal" id="prop-modal">
  <button class="bg" data-close-prop type="button" aria-label="Cerrar"></button>
  <div class="box prop-modal-box">
    <button class="icon-btn prop-modal-close" data-close-prop type="button" aria-label="Cerrar">×</button>
    <div id="prop-gallery"></div>
    <div class="prop-modal-info">
      <p class="prop-tag-inline" id="prop-modal-tag"></p>
      <p class="prop-price" id="prop-modal-price"></p>
      <h2 id="prop-modal-title"></h2>
      <p class="prop-zona" id="prop-modal-zona"></p>
      <p class="prop-meta" id="prop-modal-meta"></p>
      <p class="prop-direccion" id="prop-modal-direccion"></p>
      <p id="prop-modal-desc"></p>
      <button class="btn btn-green" type="button" id="prop-modal-wa">Preguntar por WhatsApp</button>
    </div>
  </div>
</div>`;
  document.body.appendChild(wrap.firstElementChild);
  document.querySelectorAll("#prop-modal [data-close-prop]").forEach((el) => el.addEventListener("click", closeModal));
}

function renderGallery(fotos, titulo) {
  const list = fotos && fotos.length ? fotos : ["/og.jpg"];
  const thumbs = list.length > 1
    ? `<div class="prop-thumbs">${list.map((f, i) => `<button type="button" data-thumb="${i}" class="${i === 0 ? "on" : ""}"><img src="${esc(f)}" alt=""></button>`).join("")}</div>`
    : "";
  return `<img class="prop-gallery-main" id="prop-gallery-main" src="${esc(list[0])}" alt="${esc(titulo)}">${thumbs}`;
}

function attachThumbEvents(fotos) {
  document.querySelectorAll("#prop-gallery [data-thumb]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-thumb"));
      document.getElementById("prop-gallery-main").src = fotos[i];
      document.querySelectorAll("#prop-gallery [data-thumb]").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
    });
  });
}

function renderModalContent(p) {
  document.getElementById("prop-gallery").innerHTML = renderGallery(p.fotos, p.titulo);
  attachThumbEvents(p.fotos && p.fotos.length ? p.fotos : ["/og.jpg"]);
  document.getElementById("prop-modal-tag").textContent = `${TIPO_LABEL[p.tipo] || p.tipo} · ${OPERACION_LABEL[p.operacion] || p.operacion}`;
  document.getElementById("prop-modal-price").textContent = formatPrecio(p);
  document.getElementById("prop-modal-title").textContent = p.titulo;
  document.getElementById("prop-modal-zona").textContent = p.zona;
  document.getElementById("prop-modal-meta").textContent = metaLine(p);
  const direccionEl = document.getElementById("prop-modal-direccion");
  const direccionTxt = direccionLine(p);
  direccionEl.textContent = direccionTxt;
  direccionEl.style.display = direccionTxt ? "" : "none";
  document.getElementById("prop-modal-desc").textContent = p.descripcion || "";
  const waBtn = document.getElementById("prop-modal-wa");
  waBtn.onclick = () => {
    if (typeof openWA === "function") {
      openWA([
        "Hola, me interesa esta propiedad de K&T Bienes Raíces:",
        "",
        p.titulo,
        `${p.zona} — ${formatPrecio(p)}`,
        `${window.location.origin}/propiedades/?p=${encodeURIComponent(p.id)}`,
      ]);
    }
  };
}

function showModal(p) {
  ensureModal();
  renderModalContent(p);
  document.getElementById("prop-modal").classList.add("open");
}

function hideModal() {
  document.getElementById("prop-modal")?.classList.remove("open");
}

function openModal(p) {
  showModal(p);
  setParam("p", p.id);
}

function closeModal() {
  hideModal();
  setParam("p", null);
}

window.addEventListener("popstate", () => {
  const params = getParams();
  if (!params.p) { hideModal(); return; }
  loadPropiedades().then((data) => {
    const p = data.find((x) => x.id === params.p);
    if (p) showModal(p); else hideModal();
  });
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-ver]");
  if (!btn) return;
  const id = btn.getAttribute("data-ver");
  loadPropiedades().then((data) => {
    const p = data.find((x) => x.id === id);
    if (p) openModal(p);
  });
});

// --- Inicialización por página ---

async function initListado() {
  const grid = document.getElementById("prop-grid");
  if (!grid) return;
  const empty = document.getElementById("prop-empty");
  const data = await loadPropiedades();
  const params = getParams();
  syncFilterForm(params);
  const list = data.filter((p) => matches(p, params));
  renderGrid(grid, list);
  grid.style.display = list.length ? "" : "none";
  if (empty) empty.style.display = list.length ? "none" : "";
  if (params.p) {
    const found = data.find((p) => p.id === params.p && p.publicada);
    if (found) showModal(found);
  }
}

async function initDestacadas() {
  const grid = document.getElementById("prop-destacadas");
  if (!grid) return;
  const empty = document.getElementById("prop-destacadas-empty");
  const data = await loadPropiedades();
  const list = data.filter((p) => p.publicada && p.destacada).slice(0, 3);
  renderGrid(grid, list);
  grid.style.display = list.length ? "" : "none";
  if (empty) empty.style.display = list.length ? "none" : "";
}

document.addEventListener("DOMContentLoaded", () => {
  initZonaFilter();
  initListado();
  initDestacadas();
});
