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
├── contact.html            ← Coordonnées
├── en/                     ← Version anglaise (mêmes pages, traduites)
│   ├── index.html
│   ├── about.html
│   ├── committees.html
│   ├── events.html
│   ├── volunteer.html
│   └── contact.html
├── assets/
│   ├── styles.css          ← Mise en forme (19 sections, sommaire en haut)
│   ├── icons.css           ← Bibliothèque d'icônes vectorielles (Lucide)
│   ├── components.js       ← Web Components : <bic-nav>, <bic-footer>
│   └── images/
│       └── logo.png        ← Logo BIC
├── _headers                ← Cache-Control HTTP (Cloudflare)
├── wrangler.jsonc          ← Config Cloudflare Workers
└── README.md               ← Ce fichier
```

Aucun build, aucune dépendance npm. Vous pouvez ouvrir `index.html` directement dans un navigateur pour visualiser le site.

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

### CSS — fichier unique, bien organisé

`assets/styles.css` contient toute la mise en forme du site, organisée en **19 sections numérotées** avec un sommaire en haut. Pour naviguer rapidement, faites `Cmd+F` (Mac) ou `Ctrl+F` (Windows) puis tapez `/* 05. NAVIGATION` (par exemple) pour sauter à la section voulue.

Sections principales :

| # | Section | Contenu |
|---|---------|---------|
| 01 | Reset & base | Reset CSS minimal |
| 02 | Design tokens | Variables (couleurs, fonts, mesures) |
| 03 | Typographie | h1-h4, eyebrow, italic-accent |
| 04 | Layout | Container, sections |
| 05 | Navigation | Header, brand, menu, boutons (refonte 3 zones) |
| 06 | Boutons | `.btn`, `.btn-primary`, `.btn-donate` |
| 07-13 | Composants | Hero, stats, events, comités, valeurs, CTA |
| 14-17 | Pages | Pages intérieures, socials, contact, footer |
| 18-19 | Animations / a11y | fadeUp, reduced-motion, focus-visible |

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

Le site est servi par Cloudflare Workers (mode "static assets"). Chaque `git push` sur la branche `main` déclenche un redéploiement automatique en ~30 secondes.

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

### Cache HTTP : le fichier `_headers`

Le fichier `_headers` à la racine du repo contrôle les en-têtes HTTP envoyés par Cloudflare :

- **Pages HTML** : `max-age=0, must-revalidate` → les changements sont visibles immédiatement après chaque déploiement, sans cache navigateur.
- **CSS / JS** : 1 heure de cache avec revalidation.
- **Images** : 7 jours.

⚠️ **Important** : si vous configurez Cloudflare zone-level "Browser Cache TTL", mettez-le sur **"Respect Existing Headers"** — sinon le `_headers` est ignoré.

En plus du cache HTTP, `_headers` configure également plusieurs en-têtes de sécurité modernes :

* `Content-Security-Policy` (CSP)
* `X-Frame-Options`
* `Referrer-Policy`
* `Permissions-Policy`
* `X-Content-Type-Options`

Ces protections sont appliquées globalement à toutes les pages du site via Cloudflare Workers.


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
// Liens sociaux : un seul endroit pour les changer
const SOCIAL = {
  facebook: 'https://facebook.com/...',
  instagram: 'https://instagram.com/...',
  tiktok: 'https://tiktok.com/...',
};

// Formulaires externes
const LINKS = {
  membership: 'https://docs.google.com/forms/...',
  donate: 'https://www.zeffy.com/...',
};

// Traductions FR / EN
const T = {
  fr: { nav: { home: 'Accueil', ... }, ... },
  en: { nav: { home: 'Home', ... }, ... },
};
```

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

## 📸 Ajouter des photos aux cartes d'événements

Pour remplacer les emojis temporaires des cartes d'événements par de vraies photos :

1. Placez vos photos optimisées dans `assets/images/` (WebP de préférence, max 1200px de large).
2. Dans le HTML, remplacez le bloc emoji par une balise `<img>` :

```html
<!-- Avant -->
<div class="event-card-img">🎉</div>

<!-- Après -->
<div class="event-card-img" style="background: none;">
  <img src="assets/images/kizomba.webp" alt="Soirée Kizomba"
       style="width: 100%; height: 100%; object-fit: cover;">
</div>
```
Pour convertir et optmiser les images : https://squoosh.app/

---

## 🖼️ Image Open Graph (aperçu des liens)

Le site utilise une image Open Graph (OG image) pour les aperçus lorsqu'un lien est partagé sur WhatsApp, Facebook, LinkedIn, iMessage, Discord, etc.

### Emplacement

```txt
assets/images/og-image.png
```

### Spécifications recommandées

* Format : PNG (préféré pour les logos et textes)
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

1. Déployez le site
2. Ouvrez :
   https://developers.facebook.com/tools/debug/
3. Cliquez sur **Scrape Again**

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

---

## 📜 Licence

© Bénévoles Ivoiriens du Canada — Tous droits réservés.
