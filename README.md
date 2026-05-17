# BIC — Site web

Site officiel des **Bénévoles Ivoiriens du Canada** (BIC).
Site statique bilingue (FR / EN) en HTML, CSS et JavaScript pur — déployé sur **Cloudflare Workers** via GitHub.

---

## 📁 Structure du projet

```
bic-website/
├── index.html              ← Accueil (FR)
├── a-propos.html           ← À propos (histoire, mission, valeurs, CA)
├── comites.html            ← Nos 5 comités
├── evenements.html         ← Événements à venir + archives
├── benevoles.html          ← Devenir bénévole
├── adhesion.html           ← Formulaire d'adhésion (Google Forms intégré)
├── contact.html            ← Coordonnées + réseaux sociaux
├── en/                     ← Version anglaise (mêmes pages, traduites)
│   ├── index.html
│   ├── about.html
│   ├── committees.html
│   ├── events.html
│   ├── volunteer.html
│   ├── membership.html     ← équivalent EN de adhesion.html
│   └── contact.html
├── assets/
│   ├── styles.css          ← Mise en forme (20 sections, sommaire en haut)
│   ├── icons.css           ← Bibliothèque d'icônes vectorielles (Lucide)
│   ├── components.js       ← Web Components : <bic-nav>, <bic-footer>
│   ├── form-embed.js       ← Handler du bouton "Commencer le formulaire"
│   └── images/             ← Logo, OG image, photos d'événements (.webp)
├── _headers                ← Cache HTTP + CSP + en-têtes sécurité
├── wrangler.jsonc          ← Config Cloudflare Workers
├── .gitignore
└── README.md               ← Ce fichier
```

Aucun build, aucune dépendance npm. Vous pouvez ouvrir `index.html` directement dans un navigateur pour visualiser le site, mais pour un rendu fidèle (chemins absolus `/assets/...`) utilisez un petit serveur local — voir la section **Développement local** plus bas.

---

## 🧩 Architecture

### Web Components — un seul endroit pour modifier le nav et le footer

Plutôt que de dupliquer le menu et le pied de page sur chaque page HTML, ils sont définis **une seule fois** dans `assets/components.js` comme des custom elements HTML :

```html
<!-- Dans chaque page : -->
<bic-nav lang="fr" active="home"></bic-nav>
<!-- ... contenu de la page ... -->
<bic-footer lang="fr"></bic-footer>
```

Le composant `<bic-nav>` lit ses attributs `lang` (fr / en) et `active` (clé de la page courante) pour afficher le bon menu avec le bon lien actif, le sélecteur de langue qui pointe vers la page équivalente dans l'autre langue, etc.

**Pour modifier un lien social, un libellé de menu ou une URL** : ouvrez `components.js`, modifiez les objets `SOCIAL`, `LINKS`, `PAGES` ou `T` (traductions) en haut du fichier. Le changement se propage à toutes les pages.

### Header — structure 3 zones

Sur desktop (≥ 900 px), la navigation est organisée en grille à 3 colonnes pour une distinction visuelle claire :

```
[ Logo + nom organisme ]   [ Menu pages centré ]   [ EN | Rejoindre BIC ]
        gauche                    centre                  droite
```

Sur mobile (< 900 px), le menu central devient un panneau déroulant via le bouton hamburger ; les boutons EN et Rejoindre BIC restent visibles dans la barre du haut.

### Mobile — section CSS dédiée

À partir de **640 px et en-dessous**, la section `20. MOBILE UX REFINEMENTS` de `styles.css` réécrit les composants pour un rendu vraiment optimisé pour téléphone (plutôt que de simplement « rétrécir » le desktop) :

- **Carrousel événements** — swipe horizontal avec snap centré et peek symétrique : on voit toujours un fragment de la carte voisine, ce qui crée la sensation de "stack" iOS / Apple Music. Toutes les cartes du carrousel ont la même hauteur pour que le bas (lien "Détails →") soit aligné.
- **Comités** — pile verticale en flexbox au lieu du swipe horizontal du desktop (le contenu est trop dense pour swiper confortablement).
- **Valeurs et 5 raisons** — grille 2 colonnes en mode "chip" : icône + nom seulement, descriptions masquées sur mobile pour éviter les longues piles de texte. Une carte orpheline en fin de grille s'étend automatiquement sur les deux colonnes.
- **Réseaux sociaux (contact)** — 3 cartes compactes alignées en ligne plutôt que pleine largeur empilées.
- **Footer** — brand pleine largeur en haut, grille 2 colonnes pour Navigation/Communauté, et une ligne d'icônes-cercles pour les réseaux au lieu d'une 4e colonne texte.

Le tout pour donner un look premium sur mobile sans toucher à la version desktop qui est gérée plus haut dans le fichier.

### Page d'adhésion (`adhesion.html` / `en/membership.html`)

Cette page contient un encart d'introduction premium ("Quelques minutes, et vous êtes des nôtres") suivi d'un bouton qui, au clic, charge le formulaire Google Forms dans une iframe. Le formulaire n'est pas chargé tant que l'utilisateur ne clique pas — ça évite de tirer la lourde page Google sur chaque visite.

Le handler du bouton vit dans `assets/form-embed.js` (script externe, **pas** inline — voir la section CSP plus bas pour comprendre pourquoi).

**Fallback** : sous le bouton, un lien "Ouvrir le formulaire" propose d'ouvrir le Google Form dans un nouvel onglet. Si l'iframe ne charge pas pour une raison ou une autre (allowlist Google, blocage corporate, etc.), le visiteur a toujours un chemin.

### CSS — fichier unique, bien organisé

`assets/styles.css` contient toute la mise en forme du site, organisée en **20 sections numérotées** avec un sommaire en haut. Pour naviguer rapidement, faites `Cmd+F` (Mac) ou `Ctrl+F` (Windows) puis tapez `/* 05. NAVIGATION` (par exemple) pour sauter à la section voulue.

Sections principales :

| # | Section | Contenu |
|---|---------|---------|
| 01 | Reset & base | Reset CSS minimal |
| 02 | Design tokens | Variables (couleurs, fonts, mesures) |
| 03 | Typographie | h1-h4, eyebrow, italic-accent |
| 04 | Layout | Container, sections |
| 05 | Navigation | Header, brand, menu, boutons (3 zones) |
| 06 | Boutons | `.btn`, `.btn-primary`, `.btn-donate` |
| 07-13 | Composants | Hero, stats, events, comités, valeurs, CTA |
| 14-17 | Pages | Pages intérieures, socials, contact, footer |
| 18-19 | Animations / a11y | fadeUp, reduced-motion, focus-visible |
| **20** | **Mobile UX refinements** | **Surcouche mobile premium (≤ 640 px)** |

### Icônes — Lucide en CSS

Les icônes du site (courriel, réseaux sociaux, valeurs, comités, etc.) sont des SVG vectoriels de la bibliothèque [Lucide](https://lucide.dev), embarqués dans `assets/icons.css` en tant que masks CSS. Avantages : rendu identique sur tous les navigateurs, couleur héritée du contexte via `currentColor`, aucun emoji à gérer.

```html
<!-- Usage -->
<i class="icon icon-mail" aria-hidden="true"></i>
<i class="icon icon-facebook icon-xl" aria-hidden="true"></i>
```

Tailles disponibles : par défaut (1em), `.icon-lg` (1.5em), `.icon-xl` (2em), `.icon-2xl` (2.5em), `.icon-3xl` (3em).

---

## 🚀 Déploiement sur Cloudflare Workers

Le site est servi par Cloudflare Workers (mode "static assets" — voir `wrangler.jsonc`). Chaque `git push` sur la branche `main` déclenche un redéploiement automatique en ~30 secondes.

### Configuration initiale (à faire une seule fois)

1. **Allez sur [dash.cloudflare.com](https://dash.cloudflare.com)** → **Workers & Pages** → **Create application**.
2. Onglet **Workers** → **Connect to Git** → choisissez le repo `bic-website`.
3. À l'étape **Set up builds and deployments** :

   | Champ | Valeur |
   | --- | --- |
   | **Production branch** | `main` |
   | **Framework preset** | `None` |
   | **Build command** | *(vide)* |
   | **Deploy command** | *(vide)* |
   | **Root directory** | `/` |

4. Cliquez **Save and Deploy**. Une URL `*.workers.dev` est générée.

### Brancher le domaine custom

1. Projet Workers → onglet **Settings** → **Domains & Routes** → **Add Custom Domain**.
2. Tapez votre domaine (ex: `benevolesivoirienscanada.com`).
3. Cloudflare configure le DNS automatiquement si le domaine est déjà sur Cloudflare.

### En-têtes HTTP : le fichier `_headers`

Le fichier `_headers` à la racine du repo contrôle les en-têtes HTTP envoyés par Cloudflare. Il fait deux choses :

**1. Politique de cache.**

- **Pages HTML** : `max-age=0, must-revalidate` → les changements sont visibles immédiatement après chaque déploiement, sans cache navigateur.
- **CSS / JS** : 1 heure de cache avec revalidation.
- **Images** : 7 jours.

⚠️ **Important** : si vous configurez Cloudflare zone-level "Browser Cache TTL", mettez-le sur **"Respect Existing Headers"** — sinon le `_headers` est ignoré.

**2. En-têtes de sécurité.**

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` (empêche votre site d'être embarqué dans une iframe ailleurs)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- `Content-Security-Policy` — voir ci-dessous.

### ⚠️ Content Security Policy : un piège connu

Le CSP actuel est :

```
default-src 'self';
img-src 'self' data: https:;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
script-src 'self';
font-src 'self' https://fonts.gstatic.com;
frame-src 'self' https://docs.google.com;
form-action 'self';
```

Ce qu'il faut savoir :

- **`script-src 'self'` interdit les scripts inline.** Aucun `<script>...</script>` directement dans une page HTML ne s'exécutera. Tout JS doit être dans un fichier `.js` séparé chargé via `<script src="...">`. C'est pour cela que le handler du formulaire vit dans `assets/form-embed.js` et pas directement dans `adhesion.html`.

  Si vous avez besoin d'ajouter du JS à une page, créez un fichier dans `assets/` et liez-le. Évitez d'ajouter `'unsafe-inline'` au CSP — ça ouvrirait la porte aux attaques XSS.

- **`frame-src https://docs.google.com`** autorise spécifiquement l'iframe Google Forms de la page d'adhésion. Si un jour vous changez de formulaire (Tally, Typeform, etc.), ajoutez le domaine correspondant ici, sinon l'iframe sera bloquée.

- **Google Fonts** est autorisé via `style-src` (la feuille CSS) et `font-src` (les fichiers `.woff2`).

### Branches de preview

Toute branche autre que `main` est déployée sur une URL de preview du genre `<branche>-bic-website.<compte>.workers.dev`. Pratique pour tester un changement avant de fusionner sur `main`.

---

## ✏️ Workflow pour modifier le site

### Petits changements (texte, lien, couleur)

Directement sur GitHub web :

1. Ouvrir le fichier → cliquer sur le crayon ✏️
2. Modifier → en bas : **Commit changes**
3. Cloudflare redéploie en ~30 secondes

### Changements multi-fichiers (nouvelle page, refonte section)

Téléchargez le repo en ZIP via GitHub (`Code → Download ZIP`), modifiez en local avec votre éditeur favori, puis uploadez les fichiers modifiés via **Add file → Upload files** (cocher « Replace existing files »).

### Modifier le nav, le footer, les liens sociaux

**Une seule édition** dans `assets/components.js`. Cherchez les objets en haut du fichier :

```js
// Liens sociaux — un seul endroit à mettre à jour
const SOCIAL = {
  facebook: 'https://www.facebook.com/...',
  instagram: 'https://www.instagram.com/...',
  tiktok: 'https://www.tiktok.com/...',
};

// Liens externes (le formulaire d'adhésion est local — voir adhesion.html)
const LINKS = {
  donate: 'https://www.zeffy.com/...',
};

// Mapping des pages : clé interne → chemin FR + chemin EN
const PAGES = {
  home:       { fr: '/index.html',      en: '/en/index.html' },
  about:      { fr: '/a-propos.html',   en: '/en/about.html' },
  // ...
};

// Traductions FR / EN
const T = {
  fr: { nav: { home: 'Accueil', ... }, ... },
  en: { nav: { home: 'Home', ... }, ... },
};
```

### Changer le formulaire d'adhésion

L'URL du Google Form est intégrée directement dans deux pages : `adhesion.html` (FR) et `en/membership.html` (EN). Cherchez `data-src="https://docs.google.com/forms/..."` dans chacune.

**Si le bouton "Commencer le formulaire" cesse de fonctionner** :

1. Ouvrez la console du navigateur (F12 → Console). Si vous voyez `Refused to execute inline script` ou `Refused to frame because…`, c'est le CSP qui bloque. Voir la section CSP plus haut.
2. Si la console est propre mais l'iframe affiche un blanc ou "Host not in allowlist", c'est un blocage côté Google : le formulaire restreint son intégration à certains domaines. Allez dans le Google Form → Paramètres → vérifiez les restrictions de domaine.
3. En dernier recours, le lien "Ouvrir le formulaire" sous le bouton ouvre le formulaire dans un nouvel onglet et marche toujours.

### Si quelque chose casse

Chaque commit est sauvegardé. Pour annuler un changement :

1. GitHub → onglet **Commits** (sous le nom du repo)
2. Trouvez le commit problématique → bouton **Revert** en haut à droite
3. Confirmez → Cloudflare redéploie la version précédente en ~30 secondes

### Voir vos changements immédiatement (cache navigateur)

Grâce au `_headers`, vos **visiteurs** voient les changements tout de suite. Mais **votre** navigateur peut avoir mis en cache l'ancienne version pendant que vous travaillez. Réflexes :

- **Hard refresh** : `Cmd+Shift+R` (Mac) ou `Ctrl+Shift+R` (Windows)
- Ou **DevTools ouvert avec "Disable cache" coché** dans l'onglet Network

---

## 🎨 Personnaliser la palette de couleurs

Toutes les couleurs sont définies en variables CSS dans la section **02. DESIGN TOKENS** de `assets/styles.css` :

```css
:root {
  --orange: #C8693E;       /* Orange BIC principal */
  --orange-deep: #A8512A;
  --orange-soft: #E89A6E;
  --teal: #4AAB8C;         /* Vert teal accent */
  --teal-deep: #2F8A6E;
  --navy: #1F2D3D;         /* Bleu marine texte / fond */
  --cream: #FAF6F0;        /* Fond crème principal */
  /* ... */
}
```

Changer une variable se répercute partout dans le site.

---

## 📸 Photos d'événements

Les cartes d'événements sont illustrées par des photos optimisées en WebP, stockées dans `assets/images/`. Pour remplacer une photo existante :

1. Optimisez votre nouvelle photo (max 1200 px de large, < 200 KB idéalement). Outil recommandé : [squoosh.app](https://squoosh.app/).
2. Sauvegardez-la avec **exactement le même nom** que celle qu'elle remplace (ex: `kizomba.webp`).
3. Uploadez dans `assets/images/` via GitHub.
4. Si le nom est différent, mettez aussi à jour le `<img src="...">` correspondant dans la page HTML.

Pour ajouter une nouvelle photo dans une carte :

```html
<div class="event-card-img">
  <img src="assets/images/votre-photo.webp" alt="Description de la photo">
</div>
```

---

## 🖼️ Image Open Graph (aperçu des liens)

Le site utilise une image Open Graph pour les aperçus lorsqu'un lien est partagé sur WhatsApp, Facebook, LinkedIn, iMessage, Discord, etc.

### Emplacement

```
assets/images/og-image.png
```

### Spécifications recommandées

* Format : **PNG** (préféré pour les logos et textes)
* Dimensions : `1200 × 630 px`
* Taille idéale : `< 300 KB`

⚠️ Évitez WebP pour l'OG image : certains crawlers sociaux ne le supportent pas correctement.

### Métadonnées HTML

Les balises Open Graph et Twitter fallback sont définies directement dans toutes les pages HTML FR et EN :

```html
<meta property="og:image" content="https://benevolesivoirienscanada.com/assets/images/og-image.png">
<meta name="twitter:image" content="https://benevolesivoirienscanada.com/assets/images/og-image.png">
```

### Rafraîchir les aperçus après un changement

Les plateformes sociales gardent souvent une copie en cache de l'ancienne image. Après mise à jour :

1. Déployez le site.
2. Ouvrez [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/).
3. Collez l'URL de votre site → cliquez **Scrape Again**.

---

## 🛠️ Développement local

Pour tester le site en local avec un serveur HTTP (recommandé pour que les chemins absolus comme `/assets/...` fonctionnent) :

```bash
# Avec Python 3
python3 -m http.server 8000

# Ou avec Node.js
npx serve

# Puis ouvrez http://localhost:8000
```

⚠️ Le CSP n'est **pas** appliqué quand vous servez via `python3 -m http.server` — il vit dans le fichier `_headers` qui n'est lu que par Cloudflare. Concrètement, un `<script>` inline qui marche en local sera **bloqué** en production. Si vous ajoutez du JS, externalisez-le dès le début pour éviter la surprise.

---

## 📜 Licence

© Bénévoles Ivoiriens du Canada — Tous droits réservés.
