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
