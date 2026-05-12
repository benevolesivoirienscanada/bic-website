# BIC — Site web

Site officiel des **Bénévoles Ivoiriens du Canada** (BIC).
Site statique en HTML/CSS/JS pur — pensé pour être déployé sur **Cloudflare Pages** via GitHub.

---

## 📁 Structure du projet

```
bic-website/
├── index.html          ← Page d'accueil
├── a-propos.html       ← À propos (histoire, mission, valeurs, CA)
├── comites.html        ← Nos 5 comités
├── evenements.html     ← Événements à venir + archives
├── benevoles.html      ← Devenir bénévole
├── nous-suivre.html    ← Réseaux sociaux
├── contact.html        ← Coordonnées + formulaire
├── assets/
│   ├── styles.css      ← Toute la mise en forme
│   └── script.js       ← Menu mobile + petites animations
├── README.md           ← Ce fichier
└── .gitignore
```

Aucun build, aucune dépendance npm. Vous pouvez ouvrir `index.html` directement dans un navigateur pour visualiser le site.

---

## 🚀 Déploiement sur Cloudflare Pages

### Étape 1 — Pousser le code sur GitHub

```bash
# Dans le dossier du projet
git init
git add .
git commit -m "Initial commit — site BIC"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/bic-website.git
git push -u origin main
```

### Étape 2 — Connecter le repo à Cloudflare Pages

1. Allez sur [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → onglet **Pages** → **Connect to Git**.
2. Choisissez votre compte GitHub, autorisez Cloudflare, puis sélectionnez le repo `bic-website`.
3. À l'étape **Set up builds and deployments**, utilisez ces réglages :

   | Champ                         | Valeur                          |
   | ----------------------------- | ------------------------------- |
   | **Production branch**         | `main`                          |
   | **Framework preset**          | `None`                          |
   | **Build command**             | *(laissez vide)*                |
   | **Build output directory**    | `/` *(la racine du repo)*       |
   | **Root directory (advanced)** | *(laissez vide)*                |

4. Cliquez **Save and Deploy**. Cloudflare va déployer le site en ~30 secondes et vous donner une URL `*.pages.dev`.

### Étape 3 — Brancher votre nom de domaine

1. Dans le projet Pages → onglet **Custom domains** → **Set up a custom domain**.
2. Entrez votre domaine (ex: `bic-canada.org`).
3. Si le domaine est déjà géré par Cloudflare, le DNS se configure automatiquement.
   Sinon, Cloudflare vous donnera les enregistrements DNS à ajouter chez votre registrar.

### Étape 4 — Déploiements automatiques

À partir de maintenant, **chaque `git push` sur la branche `main`** redéploie automatiquement le site en production. Les autres branches créent des **previews** (URL de prévisualisation) — pratique pour tester avant de fusionner.

---

## ✏️ Éléments à compléter avant la mise en ligne

Recherchez `⚠ À COMPLÉTER` dans le code pour repérer tous les emplacements. En résumé :

- **`contact.html`** — remplacer `contact@bic.example` par la vraie adresse courriel
- **`nous-suivre.html`** — remplacer les `href="#"` par les vrais liens Facebook, Instagram, TikTok
- **`a-propos.html`** — remplacer `[Nom à compléter]` par les noms des membres du Conseil d'administration
- **Footers de toutes les pages** — mettre à jour les liens des réseaux sociaux (les `href="#"`)
- **Optionnel** — `contact.html` : remplacer le bloc placeholder par une `<iframe>` Google Forms de contact

### Astuce pour mettre à jour plusieurs pages d'un coup

Le menu de navigation et le pied de page sont dupliqués sur les 7 pages. Si vous modifiez un lien social ou un élément de menu, vous devez le faire sur chaque page. Pour un changement global, utilisez « Rechercher et remplacer » dans VS Code (`Ctrl+Shift+H`).

---

## 🎨 Personnaliser la palette de couleurs

Toutes les couleurs sont définies en CSS variables au début de `assets/styles.css` :

```css
:root {
  --orange: #C8693E;       /* Orange BIC principal */
  --orange-deep: #A8512A;
  --orange-soft: #E89A6E;
  --teal: #4AAB8C;         /* Vert teal accent */
  --teal-deep: #2F8A6E;
  --navy: #1F2D3D;         /* Bleu marine texte */
  --cream: #FAF6F0;        /* Fond crème */
  /* ... */
}
```

Changer une variable se répercute partout dans le site.

---

## 📸 Ajouter des photos

Pour remplacer les emojis des cartes d'événements par de vraies photos :

1. Créez un dossier `assets/images/`.
2. Ajoutez vos photos optimisées (WebP de préférence, max 1200px de large).
3. Dans le HTML, remplacez le bloc emoji par une balise `<img>` :

```html
<!-- Avant -->
<div class="event-card-img">🎉</div>

<!-- Après -->
<div class="event-card-img" style="background: none;">
  <img src="assets/images/kizomba.webp" alt="Soirée Kizomba"
       style="width: 100%; height: 100%; object-fit: cover;">
</div>
```

---

## 🛠️ Développement local

Pour tester le site en local, ouvrez simplement `index.html` dans un navigateur. Pour avoir un vrai serveur HTTP (utile pour certains tests) :

```bash
# Avec Python 3
python3 -m http.server 8000

# Ou avec Node.js
npx serve

# Ouvrez ensuite http://localhost:8000
```

---

## 📜 Licence

© Bénévoles Ivoiriens du Canada — Tous droits réservés.
