# Refactoring — Web Components (Mai 2026, v2)

Cette livraison **refactore** votre site pour éliminer la duplication du menu/pied de page. **Le rendu visuel est identique** — seule la structure interne du code change.

## 🎯 Ce qui change

### Avant (duplication)
Le menu et le pied de page étaient écrits en dur dans chacune des 14 pages. Modifier un lien social = 14 fichiers à éditer.

### Après (composants)
Un seul fichier `assets/components.js` définit `<bic-nav>` et `<bic-footer>` comme **custom elements**. Chaque page contient juste :

```html
<bic-nav lang="fr" active="home"></bic-nav>
<!-- contenu de la page -->
<bic-footer lang="fr"></bic-footer>
```

Modifier un lien social, un libellé, un menu = **1 seul endroit à toucher** dans `components.js`.

## 📊 Économies

- **Avant :** ~2 400 lignes HTML cumulées (avec duplications)
- **Après :** ~1 750 lignes HTML + 230 lignes JS
- **~700 lignes de code dupliqué éliminées**
- Ajouter une nouvelle page = ~5 lignes au lieu de ~50

## 📁 Fichiers de cette livraison

### Nouveau
- `assets/components.js` — les composants `<bic-nav>` et `<bic-footer>` + toute la config

### Modifié
- Les **14 pages HTML** : leurs `<header>` et `<footer>` remplacés par `<bic-nav>` et `<bic-footer>`. Le `<script>` à la fin pointe maintenant vers `components.js`.
- `contact.html` : 3 liens sociaux internes corrigés (étaient encore `href="#"`)

### Supprimé
- `assets/script.js` — ses 3 fonctions (menu mobile, animations scroll, année) sont absorbées dans `components.js`

## 🔧 Comment modifier le site maintenant

### Changer un lien social
Ouvrez `assets/components.js`, modifiez l'objet `SOCIAL` en haut. C'est tout — toutes les pages sont mises à jour automatiquement.

```js
const SOCIAL = {
  facebook: 'https://...',
  instagram: 'https://...',
  tiktok: 'https://...',
};
```

### Changer le lien du formulaire d'adhésion ou de don
Modifiez l'objet `LINKS` :

```js
const LINKS = {
  membership: 'https://docs.google.com/forms/...',
  donate: 'https://www.zeffy.com/...',
};
```

### Changer un libellé de menu (par ex. "Comités" → "Nos comités")
Modifiez l'objet `T` (traductions), dans `T.fr.nav` ou `T.en.nav` selon la langue.

### Ajouter une nouvelle page (par ex. "Galerie")
1. Ajoutez une entrée dans `PAGES` :
   ```js
   gallery: { fr: '/galerie.html', en: '/en/gallery.html' }
   ```
2. Ajoutez un libellé dans `T.fr.nav` et `T.en.nav` :
   ```js
   gallery: 'Galerie'  // en FR
   gallery: 'Gallery'  // en EN
   ```
3. Créez les fichiers HTML avec :
   ```html
   <bic-nav lang="fr" active="gallery"></bic-nav>
   ... contenu ...
   <bic-footer lang="fr"></bic-footer>
   ```

## 🚀 Comment pousser

Pareil que la dernière fois — décompressez le ZIP, glissez les fichiers dans GitHub, commit.

**Important — fichier à supprimer** : `assets/script.js` n'est plus utilisé. Quand vous uploadez sur GitHub :
- Soit vous le supprimez manuellement
- Soit vous le laissez : il sera simplement ignoré (aucun HTML ne le référence). Pas idéal mais sans conséquence.

## ⚠️ Considération technique : flash au chargement

Les composants s'injectent en JavaScript, donc au tout premier chargement il y a un délai imperceptible (~30-50ms en moyenne) avant que le menu n'apparaisse. Sur connexion correcte, l'œil ne le voit pas. Le script est chargé avec `defer` pour minimiser cet effet.

Si jamais ça devient un problème, on pourra ajouter un placeholder rectangle pendant le chargement.

## ✅ Tests effectués

- 14 pages HTML validées (parser HTML strict)
- Composants testés : génération correcte du logo, des liens FR↔EN, des libellés actifs, des URLs sociaux, de l'année
- Pas de régression visuelle (le HTML rendu par le composant est identique au HTML qui était écrit en dur)

## 🔮 Suite : Google Calendar

Voir mon message de réponse pour la planification.
