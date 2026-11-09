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

  addNavidadDecor();
});

// Detalles de temporada (muérdago/acebo, esferas, copos de nieve) sobre el
// hero/banner de cada página. Para quitarlos: borrar esta función, la línea
// que la llama arriba, y el bloque "Detalles de Navidad" en css/site.css.
function addNavidadDecor() {
  const host = qs(".hero, .banner");
  if (!host) return;
  host.insertAdjacentHTML("beforeend", `
    <div class="xmas-decor" aria-hidden="true">
      <svg class="xmas-corner tl" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.0 50.0 Q15.9 28.8 6.0 10.0 Q4.1 31.2 14.0 50.0 Z" fill="#2f6e4a" stroke="#1f4a32" stroke-width=".6"/>
        <path d="M14.0 50.0 Q27.2 30.0 28.0 6.0 Q14.8 26.0 14.0 50.0 Z" fill="#3a8259" stroke="#1f4a32" stroke-width=".6"/>
        <circle cx="14" cy="46" r="3.2" fill="#c23b3b"/>
        <circle cx="19" cy="49" r="3" fill="#c23b3b"/>
        <circle cx="10" cy="50" r="2.8" fill="#c23b3b"/>
        <circle cx="13" cy="45" r=".9" fill="#fff" opacity=".6"/>
      </svg>
      <svg class="xmas-corner tr" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.0 50.0 Q15.9 28.8 6.0 10.0 Q4.1 31.2 14.0 50.0 Z" fill="#2f6e4a" stroke="#1f4a32" stroke-width=".6"/>
        <path d="M14.0 50.0 Q27.2 30.0 28.0 6.0 Q14.8 26.0 14.0 50.0 Z" fill="#3a8259" stroke="#1f4a32" stroke-width=".6"/>
        <circle cx="14" cy="46" r="3.2" fill="#c23b3b"/>
        <circle cx="19" cy="49" r="3" fill="#c23b3b"/>
        <circle cx="10" cy="50" r="2.8" fill="#c23b3b"/>
        <circle cx="13" cy="45" r=".9" fill="#fff" opacity=".6"/>
      </svg>
      <svg class="xmas-bauble b1" viewBox="0 0 24 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="0" x2="12" y2="13" stroke="#d8c9a3" stroke-width="1"/>
        <rect x="9.5" y="10" width="5" height="4" rx="1" fill="#d8b23a"/>
        <circle cx="12" cy="27" r="11" fill="#c23b3b"/>
        <ellipse cx="8.5" cy="22" rx="3" ry="4" fill="#fff" opacity=".35"/>
      </svg>
      <svg class="xmas-bauble b2" viewBox="0 0 24 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="0" x2="12" y2="13" stroke="#d8c9a3" stroke-width="1"/>
        <rect x="9.5" y="10" width="5" height="4" rx="1" fill="#c23b3b"/>
        <circle cx="12" cy="27" r="11" fill="#d8b23a"/>
        <ellipse cx="8.5" cy="22" rx="3" ry="4" fill="#fff" opacity=".35"/>
      </svg>
      <svg class="xmas-snow s1" viewBox="-16 -16 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#fffcf7" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M-14 0 L14 0 M-7 -12.1 L7 12.1 M7 -12.1 L-7 12.1"/>
          <path d="M9.2 3 L11.2 0 L9.2 -3 M-9.2 3 L-11.2 0 L-9.2 -3 M2 9.5 L5.6 9.7 L7.2 6.5 M-7.2 -6.5 L-5.6 -9.7 L-2 -9.5 M-7.2 6.5 L-5.6 9.7 L-2 9.5 M2 -9.5 L5.6 -9.7 L7.2 -6.5"/>
        </g>
        <circle cx="0" cy="0" r="1.3" fill="#fffcf7"/>
      </svg>
      <svg class="xmas-snow s2" viewBox="-16 -16 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#fffcf7" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M-14 0 L14 0 M-7 -12.1 L7 12.1 M7 -12.1 L-7 12.1"/>
          <path d="M9.2 3 L11.2 0 L9.2 -3 M-9.2 3 L-11.2 0 L-9.2 -3 M2 9.5 L5.6 9.7 L7.2 6.5 M-7.2 -6.5 L-5.6 -9.7 L-2 -9.5 M-7.2 6.5 L-5.6 9.7 L-2 9.5 M2 -9.5 L5.6 -9.7 L7.2 -6.5"/>
        </g>
        <circle cx="0" cy="0" r="1.3" fill="#fffcf7"/>
      </svg>
    </div>
  `);
}
