/* ===================================================
   TOUT AU CHAUD — Scripts principaux
   =================================================== */

/* --- Navigation mobile (hamburger) --- */
const btnToggle = document.querySelector('.nav-toggle');
const navPrincipale = document.querySelector('.nav-principale');

if (btnToggle && navPrincipale) {
  btnToggle.addEventListener('click', () => {
    const estOuverte = navPrincipale.classList.toggle('ouverte');
    btnToggle.setAttribute('aria-expanded', String(estOuverte));
    btnToggle.setAttribute(
      'aria-label',
      estOuverte ? 'Fermer le menu' : 'Ouvrir le menu'
    );
  });

  /* Fermer le menu si on clique en dehors */
  document.addEventListener('click', (e) => {
    if (!btnToggle.contains(e.target) && !navPrincipale.contains(e.target)) {
      navPrincipale.classList.remove('ouverte');
      btnToggle.setAttribute('aria-expanded', 'false');
      btnToggle.setAttribute('aria-label', 'Ouvrir le menu');
    }
  });

  /* Fermer le menu si la fenêtre est redimensionnée en desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      navPrincipale.classList.remove('ouverte');
      btnToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Carousel ─
(function () {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const piste = document.getElementById('carousel-piste');
  const items = Array.from(piste.querySelectorAll('.carousel-item'));
  const btnPrev = carousel.querySelector('.carousel-fleche--prev');
  const btnNext = carousel.querySelector('.carousel-fleche--next');
  const nb = items.length;

  let indexCourant = 0;
  let timerResize;

  function decalagePiste() {
    const gap = parseFloat(getComputedStyle(piste).gap) || 0;
    return items[0].offsetWidth + gap;
  }

  function allerA(index) {
    if (index < 0) index = nb - 1;
    if (index >= nb) index = 0;
    indexCourant = index;
    piste.style.transform = `translateX(-${indexCourant * decalagePiste()}px)`;
  }

  btnNext.addEventListener('click', () => allerA(indexCourant + 1));
  btnPrev.addEventListener('click', () => allerA(indexCourant - 1));

  /* Debounce maison — recalcule le décalage après redimensionnement */
  window.addEventListener('resize', () => {
    clearTimeout(timerResize);
    timerResize = setTimeout(() => allerA(indexCourant), 150);
  });
}());
