// script.js - posicionamiento fiable de la underline y navegación + partículas

// ===== PARTICULAS (igual que antes) =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function fitCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', fitCanvas);
fitCanvas();

let particles = [];
function initParticles(count = 120) {
  particles = [];
  const colors = ['rgba(0,238,255,0.9)', 'rgba(102,204,255,0.85)', 'rgba(51,153,255,0.8)'];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.6,
      speedY: Math.random() * 0.9 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}
initParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    p.y += p.speedY;
    if (p.y > canvas.height + 5) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVEGACION Y UNDERLINE FIABLE =====
const navItems = Array.from(document.querySelectorAll('.nav-item'));
const sections = Array.from(document.querySelectorAll('section'));
const underline = document.querySelector('.underline');

// calcula y coloca la underline centrada bajo el elemento `item`
function positionUnderline(item) {
  if (!item || !underline) return;
  const parentRect = item.parentElement.getBoundingClientRect(); // barra
  const itemRect = item.getBoundingClientRect(); // icono
  const underlineWidth = underline.offsetWidth || 40; // fallback
  // left relativo dentro del parent
  const left = itemRect.left - parentRect.left + itemRect.width / 2 - underlineWidth / 2;
  underline.style.left = `${left}px`;
}

// mostrar sección por id con slide (usa clases existentes)
function showSection(id) {
  sections.forEach(s => {
    if (s.id === id) {
      s.classList.add('active', 'slide-in');
    } else {
      s.classList.remove('active', 'slide-in');
    }
  });
}

// manejo de click en iconos
navItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    // clases activas en iconos
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // mover underline
    positionUnderline(item);

    // cambiar sección
    const target = item.getAttribute('data-target');
    if (target) showSection(target);
  });
});

// posicionar underline inicialmente (cuando la página carga)
window.addEventListener('load', () => {
  const active = document.querySelector('.nav-item.active') || navItems[0];
  // esperar un tick para que offsets estén calculados
  requestAnimationFrame(() => positionUnderline(active));
});

// reposicionar underline al redimensionar (mantener bajo el icono activo)
window.addEventListener('resize', () => {
  const active = document.querySelector('.nav-item.active') || navItems[0];
  // recomputar canvas y particles también
  fitCanvas();
  initParticles();
  requestAnimationFrame(() => positionUnderline(active));
});
