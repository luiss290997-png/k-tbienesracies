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
});
