/**
 * BIC — Web Components partagés
 * ================================
 * Définit <bic-nav> et <bic-footer> comme custom elements.
 * Une seule source de vérité pour le menu, le pied de page et la config (liens, traductions).
 *
 * USAGE dans une page :
 *   <bic-nav lang="fr" active="home"></bic-nav>
 *   ... contenu de la page ...
 *   <bic-footer lang="fr"></bic-footer>
 *
 * `lang`  = "fr" ou "en"
 * `active` = "home" | "about" | "committees" | "events" | "volunteer" | "contact"
 *           (correspond à la clé dans PAGES ci-dessous)
 */

/* ============================================================
   CONFIG — la seule place où vous modifiez quoi que ce soit
   ============================================================ */

// Liens sociaux — un seul endroit à mettre à jour
const SOCIAL = {
  facebook: 'https://www.facebook.com/p/B%C3%A9n%C3%A9voles-Ivoiriens-du-Canada-BIC-100091865238462/',
  instagram: 'https://www.instagram.com/benevolesivoirienscanada/',
  tiktok: 'https://www.tiktok.com/@benevolesivoirienscanada',
};

// Formulaires externes
const LINKS = {
  membership: 'https://docs.google.com/forms/d/e/1FAIpQLSeyP3Xbd5FzhOpRIKziCccbdvLP6KICEwFavPIlwAEpana7tA/viewform?usp=header',
  donate: 'https://www.zeffy.com/fr-CA/ticketing/cotisation-annuelle-2026-2027-benevoles-ivoiriens-du-canada-bic',
};

// Mapping des pages : clé interne → chemin FR + chemin EN
// Les chemins sont absolus depuis la racine du site (fonctionne sur Cloudflare Pages)
const PAGES = {
  home:       { fr: '/index.html',        en: '/en/index.html' },
  about:      { fr: '/a-propos.html',     en: '/en/about.html' },
  committees: { fr: '/comites.html',      en: '/en/committees.html' },
  events:     { fr: '/evenements.html',   en: '/en/events.html' },
  volunteer:  { fr: '/benevoles.html',    en: '/en/volunteer.html' },
  contact:    { fr: '/contact.html',      en: '/en/contact.html' },
};

// Traductions — texte par langue
const T = {
  fr: {
    brandLine: 'Bénévoles Ivoiriens du Canada',
    logoAlt: 'Logo BIC',
    join: 'Rejoindre BIC',
    openMenu: 'Ouvrir le menu',
    langToggleLabel: 'English version',
    nav: {
      home: 'Accueil',
      about: 'À propos',
      committees: 'Comités',
      events: 'Événements',
      volunteer: 'Devenir bénévole',
      contact: 'Contact',
    },
    footer: {
      tagline: "Ensemble, construisons l'avenir. Une communauté ivoirienne au Canada.",
      navTitle: 'Navigation',
      navLinks: [
        { key: 'about',      label: 'À propos' },
        { key: 'committees', label: 'Nos comités' },
        { key: 'events',     label: 'Événements' },
        { key: 'volunteer',  label: 'Devenir bénévole' },
      ],
      communityTitle: 'Communauté',
      communityLinks: [
        { key: 'contact', label: 'Contact' },
      ],
      membershipLabel: 'Adhésion',
      socialTitle: 'Réseaux',
      copyright: 'Bénévoles Ivoiriens du Canada. Tous droits réservés.',
      regions: 'Montréal · Gatineau · Québec',
    },
  },
  en: {
    brandLine: 'Bénévoles Ivoiriens du Canada',
    logoAlt: 'BIC logo',
    join: 'Join BIC',
    openMenu: 'Open menu',
    langToggleLabel: 'Version française',
    nav: {
      home: 'Home',
      about: 'About',
      committees: 'Committees',
      events: 'Events',
      volunteer: 'Volunteer',
      contact: 'Contact',
    },
    footer: {
      tagline: 'Together, we shape the future. An Ivorian community in Canada.',
      navTitle: 'Navigation',
      navLinks: [
        { key: 'about',      label: 'About' },
        { key: 'committees', label: 'Committees' },
        { key: 'events',     label: 'Events' },
        { key: 'volunteer',  label: 'Volunteer' },
      ],
      communityTitle: 'Community',
      communityLinks: [
        { key: 'contact', label: 'Contact' },
      ],
      membershipLabel: 'Membership',
      socialTitle: 'Social',
      copyright: 'Ivorian Volunteers of Canada. All rights reserved.',
      regions: 'Montréal · Gatineau · Québec',
    },
  },
};

/* ============================================================
   HELPERS
   ============================================================ */

// Échappe une chaîne pour usage sécurisé dans du HTML
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Détermine la langue par défaut depuis l'URL si l'attribut n'est pas fourni
function detectLang() {
  return window.location.pathname.startsWith('/en/') ? 'en' : 'fr';
}

/* ============================================================
   <bic-nav lang="fr|en" active="home|about|...">
   ============================================================ */

class BicNav extends HTMLElement {
  connectedCallback() {
    const lang = this.getAttribute('lang') || detectLang();
    const active = this.getAttribute('active') || '';
    const t = T[lang];
    if (!t) {
      console.warn(`<bic-nav>: lang inconnu "${lang}"`);
      return;
    }

    const otherLang = lang === 'fr' ? 'en' : 'fr';
    const currentPage = PAGES[active];
    const otherLangUrl = currentPage ? currentPage[otherLang] : PAGES.home[otherLang];
    const otherLangLabel = otherLang.toUpperCase();

    // Construit les éléments <li> du menu
    const navItems = Object.entries(t.nav).map(([key, label]) => {
      const path = PAGES[key][lang];
      const cls = key === active ? ' class="active"' : '';
      return `<li><a href="${path}"${cls}>${esc(label)}</a></li>`;
    }).join('');

    this.innerHTML = `
<header class="nav">
  <div class="container nav-inner">

    <!-- Zone GAUCHE : Logo + nom de l'organisme -->
    <a href="${PAGES.home[lang]}" class="brand">
      <img src="/assets/images/logo.png" alt="${esc(t.logoAlt)}" class="brand-logo" width="44" height="44">
      <span class="brand-text multi-line">
        <span>BENEVOLES</span>
        <span>IVOIRIENS</span>
        <span>DU CANADA</span>
      </span>
    </a>

    <!-- Zone CENTRE : Menu de navigation -->
    <nav class="nav-menu">
      <ul class="nav-links">
        ${navItems}
      </ul>
    </nav>

    <!-- Zone DROITE : Actions (langue + CTA + hamburger mobile) -->
    <div class="nav-actions">
      <a class="nav-lang" href="${otherLangUrl}" hreflang="${otherLang}" aria-label="${esc(t.langToggleLabel)}">${otherLangLabel}</a>
      <a class="nav-cta" href="${LINKS.membership}" target="_blank" rel="noopener">${esc(t.join)}</a>
      <button class="nav-toggle" aria-label="${esc(t.openMenu)}" aria-expanded="false"><span></span></button>
    </div>

  </div>
</header>
`;
  }
}

/* ============================================================
   <bic-footer lang="fr|en">
   ============================================================ */

class BicFooter extends HTMLElement {
  connectedCallback() {
    const lang = this.getAttribute('lang') || detectLang();
    const t = T[lang];
    if (!t) {
      console.warn(`<bic-footer>: lang inconnu "${lang}"`);
      return;
    }

    const year = new Date().getFullYear();

    const navLinks = t.footer.navLinks.map(item =>
      `<li><a href="${PAGES[item.key][lang]}">${esc(item.label)}</a></li>`
    ).join('');

    const communityLinks = t.footer.communityLinks.map(item =>
      `<li><a href="${PAGES[item.key][lang]}">${esc(item.label)}</a></li>`
    ).join('');

    this.innerHTML = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="${PAGES.home[lang]}" class="brand">
          <span class="brand-logo-footer-badge"><img src="/assets/images/logo.png" alt="${esc(t.logoAlt)}" width="52" height="52"></span>
          <span class="brand-text multi-line">
             <span>BENEVOLES</span>
             <span>IVOIRIENS</span>
             <span>DU CANADA</span>
          </span>
        </a>
        <p>${esc(t.footer.tagline)}</p>
      </div>
      <div>
        <h4>${esc(t.footer.navTitle)}</h4>
        <ul>${navLinks}</ul>
      </div>
      <div>
        <h4>${esc(t.footer.communityTitle)}</h4>
        <ul>
          ${communityLinks}
          <li><a href="${LINKS.membership}" target="_blank" rel="noopener">${esc(t.footer.membershipLabel)}</a></li>
        </ul>
      </div>
      <div>
        <h4>${esc(t.footer.socialTitle)}</h4>
        <ul>
          <li><a href="${SOCIAL.facebook}" target="_blank" rel="noopener">Facebook</a></li>
          <li><a href="${SOCIAL.instagram}" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="${SOCIAL.tiktok}" target="_blank" rel="noopener">TikTok</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${year} ${esc(t.footer.copyright)}</span>
      <span>${esc(t.footer.regions)}</span>
    </div>
  </div>
</footer>
`;
  }
}

/* ============================================================
   Enregistrement des custom elements
   ============================================================ */

customElements.define('bic-nav', BicNav);
customElements.define('bic-footer', BicFooter);

/* ============================================================
   Comportements globaux après injection des composants
   (équivalent de l'ancien script.js : menu mobile, année, animations)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const nav = document.querySelector('header.nav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(expanded));
    });
    nav.querySelectorAll('.nav-links a').forEach((a) => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Animations d'apparition au scroll (pour les éléments [data-animate])
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
  }

  // Année dans le pied de page (au cas où une page utiliserait encore [data-year])
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
