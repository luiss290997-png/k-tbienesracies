const WA = "528442293608";

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function openWA(lines) {
  const url = `https://wa.me/${WA}?text=${encodeURIComponent(lines.filter(Boolean).join("\n"))}`;
  window.open(url, "_blank", "noopener,noreferrer");
  return url;
}

document.addEventListener("DOMContentLoaded", () => {
  const header = qs("header.site");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 16);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuBtn = qs("[data-menu]");
  const mobile = qs(".mobile");
  menuBtn?.addEventListener("click", () => {
    const open = mobile.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  const searchPop = qs("[data-search-pop]");
  qs("[data-search-toggle]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    searchPop?.classList.toggle("open");
    searchPop?.querySelector("input")?.focus();
  });
  document.addEventListener("click", (e) => {
    if (searchPop && !searchPop.parentElement.contains(e.target)) searchPop.classList.remove("open");
  });
  qs("[data-header-search]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    const url = q ? `/propiedades/?q=${encodeURIComponent(String(q))}` : "/propiedades/";
    window.location.href = url;
  });

  qsa("[data-open-cita]").forEach((el) => el.addEventListener("click", () => qs("#cita")?.classList.add("open")));
  qsa("[data-close-cita]").forEach((el) => el.addEventListener("click", () => qs("#cita")?.classList.remove("open")));

  qs("#cita-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries());
    openWA([
      "Hola, quiero agendar una cita con K&T Bienes Raíces.",
      "",
      `Nombre: ${d.name}`,
      `Teléfono: ${d.phone}`,
      `Correo: ${d.email}`,
      `Fecha: ${d.date}`,
      `Hora: ${d.time}`,
      `Tipo: ${d.type}`,
      d.note && `Notas: ${d.note}`,
    ]);
    e.currentTarget.closest(".box").innerHTML = `<p class="eyebrow">Agenda</p><h2>Tu cita está lista para enviarse</h2><p>Confirma el envío en WhatsApp.</p><button class="btn btn-green" data-close-cita type="button">Cerrar</button>`;
    qsa("[data-close-cita]").forEach((el) => el.addEventListener("click", () => qs("#cita")?.classList.remove("open")));
  });

  qsa("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form).entries());
      openWA([
        "Hola, solicito información de K&T Bienes Raíces.",
        "",
        `Nombre: ${d.name}`,
        `Teléfono: ${d.phone}`,
        `Correo: ${d.email}`,
        d.interest && `Interés: ${d.interest}`,
        "",
        d.message,
      ]);
      form.outerHTML = `<p style="font-family:var(--display);font-size:1.6rem;margin:0">Tu mensaje está listo en WhatsApp.</p><p style="color:var(--muted)">Confirma el envío ahí para que lo reciba la oficina.</p>`;
    });
  });

  qs("[data-filter]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries());
    const params = new URLSearchParams();
    if (d.tipo && d.tipo !== "todos") params.set("tipo", d.tipo);
    if (d.operacion && d.operacion !== "todas") params.set("operacion", d.operacion);
    if (d.zona && d.zona !== "todas") params.set("zona", d.zona);
    if (d.precio) params.set("precio", d.precio);
    window.location.href = `/propiedades/${params.toString() ? `?${params}` : ""}`;
  });

  const slides = qsa(".hero img.slide");
  if (slides.length > 1) {
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove("on");
      i = (i + 1) % slides.length;
      slides[i].classList.add("on");
    }, 7000);
  }

  addHalloweenDecor();
});

// Detalles de temporada (telarañas, fantasmita, araña) sobre el hero/banner
// de cada página. Para quitarlos: borrar esta función, la línea que la
// llama arriba, y el bloque "Detalles de Halloween" en css/site.css.
function addHalloweenDecor() {
  const host = qs(".hero, .banner");
  if (!host) return;
  host.insertAdjacentHTML("beforeend", `
    <div class="hw-decor" aria-hidden="true">
      <svg class="hw-corner tl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 L100 0 M0 0 L0 100" stroke="#fffcf7" stroke-width="1.2" opacity=".6"/>
        <path d="M0 14 Q 40 14 14 40 Q 14 70 0 70" stroke="#fffcf7" stroke-width="1.1"/>
        <path d="M0 28 Q 28 28 28 56" stroke="#fffcf7" stroke-width="1"/>
        <path d="M14 0 Q 14 40 40 14 Q 70 14 70 0" stroke="#fffcf7" stroke-width="1.1"/>
        <path d="M28 0 Q 28 28 56 28" stroke="#fffcf7" stroke-width="1"/>
        <path d="M0 0 L22 22 M0 0 L38 7 M0 0 L7 38" stroke="#fffcf7" stroke-width=".8" opacity=".8"/>
      </svg>
      <svg class="hw-corner tr" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 L100 0 M0 0 L0 100" stroke="#fffcf7" stroke-width="1.2" opacity=".6"/>
        <path d="M0 14 Q 40 14 14 40 Q 14 70 0 70" stroke="#fffcf7" stroke-width="1.1"/>
        <path d="M0 28 Q 28 28 28 56" stroke="#fffcf7" stroke-width="1"/>
        <path d="M14 0 Q 14 40 40 14 Q 70 14 70 0" stroke="#fffcf7" stroke-width="1.1"/>
        <path d="M28 0 Q 28 28 56 28" stroke="#fffcf7" stroke-width="1"/>
        <path d="M0 0 L22 22 M0 0 L38 7 M0 0 L7 38" stroke="#fffcf7" stroke-width=".8" opacity=".8"/>
      </svg>
      <svg class="hw-spider" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="0" x2="12" y2="18" stroke="#fffcf7" stroke-width="1" opacity=".7"/>
        <circle cx="12" cy="24" r="5" fill="#1b2420"/>
        <circle cx="12" cy="18" r="3" fill="#1b2420"/>
        <g stroke="#1b2420" stroke-width="1.1" stroke-linecap="round">
          <path d="M7 21 L2 18 M7 23 L1 23 M7 26 L2 29 M17 21 L22 18 M17 23 L23 23 M17 26 L22 29"/>
        </g>
      </svg>
      <svg class="hw-ghost g1" viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2C10 2 3 10 3 20v20l5-4 5 4 7-4 7 4 5-4 5 4V20C32 10 30 2 20 2Z" fill="#fffcf7"/>
        <circle cx="14" cy="20" r="2.4" fill="#1b2420"/>
        <circle cx="26" cy="20" r="2.4" fill="#1b2420"/>
      </svg>
      <svg class="hw-ghost g2" viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2C10 2 3 10 3 20v20l5-4 5 4 7-4 7 4 5-4 5 4V20C32 10 30 2 20 2Z" fill="#fffcf7"/>
        <circle cx="14" cy="20" r="2.4" fill="#1b2420"/>
        <circle cx="26" cy="20" r="2.4" fill="#1b2420"/>
      </svg>
    </div>
  `);
}
