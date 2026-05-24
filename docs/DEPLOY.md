# Guide technique — Déploiement et maintenance

Ce document couvre l'installation locale, le déploiement sur Netlify, la configuration de DecapBridge et les opérations courantes d'évolution du projet.

---

## Installation locale

```bash
git clone https://github.com/Artjaq/Projet_Magda.git
cd Projet_Magda
npm install
npm run dev
# → http://localhost:8080
```

### Build de production

```bash
npm run build
# → Fichiers générés dans _site/
```

---

## Déploiement sur Netlify

**Étape 1 — Connecter le dépôt**
- Va sur [netlify.com](https://netlify.com) → "Add new site" → "Import an existing project"
- Sélectionne le dépôt GitHub `Artjaq/Projet_Magda`
- Netlify lit automatiquement `netlify.toml` : commande `npm run build`, dossier de publication `_site`
- Lance le premier déploiement

**Étape 2 — Configurer DecapBridge**
- Crée un compte sur [decapbridge.com](https://decapbridge.com)
- Ajoute le site et autorise l'accès au repo GitHub via OAuth
- Le bloc `backend:` est déjà intégré dans `src/admin/config.yml`
- Quand le domaine custom sera branché, mettre à jour `site_url` et `display_url` dans `src/admin/config.yml` (les deux valeurs sont marquées d'un commentaire)

**Étape 3 — Inviter Magda via DecapBridge**
- Dashboard DecapBridge → "Users" → "Invite"
- Entre l'adresse email de Magda et envoie l'invitation
- Magda reçoit un email de DecapBridge pour définir son mot de passe
- Elle accède ensuite à `projetmagda.netlify.app/admin` (ou le domaine custom une fois branché)

---

## Ajouter un champ éditable

1. Ouvre `src/admin/config.yml`
2. Trouve la collection ou le fichier concerné (cherche le `label` en français)
3. Ajoute un bloc dans la liste `fields:` :
   ```yaml
   - label: "Nom affiché dans l'interface"
     name: "cle_dans_le_yaml"
     widget: "string"   # ou : text, markdown, image, number…
     hint: "Explication pour Magda"
     required: false
   ```
4. Ajoute la même clé dans le fichier YAML correspondant (`src/_data/xxx.yaml`)
5. Utilise la variable dans le template Nunjucks : `{{ accueil.nouvelle_cle }}`

Widgets disponibles : `string`, `text`, `markdown`, `image`, `number`, `boolean`, `list`, `object`.
Référence : https://decapcms.org/docs/widgets/

---

## Ajouter une nouvelle collection de pièces

Dans `.eleventy.js`, duplique le bloc `addCollection` :
```js
eleventyConfig.addCollection("nomCollection", function (collectionApi) {
  return collectionApi
    .getFilteredByGlob("src/nomCollection/*.md")
    .sort((a, b) => (a.data.ordre || 0) - (b.data.ordre || 0));
});
```
Puis ajoute la collection dans `src/admin/config.yml` en suivant le modèle de la collection `pieces`.

---

## Mettre à jour Decap CMS

Dans `src/admin/index.html`, remplace le numéro de version :
```html
<script src="https://unpkg.com/decap-cms@^3.X.X/dist/decap-cms.js"></script>
```
Dernières versions : https://github.com/decaporg/decap-cms/releases

---

## Brancher le formulaire de contact

Le formulaire est actuellement en mode démo (affiche une confirmation sans envoyer).

**Option recommandée — Formspree** (gratuit jusqu'à 50 messages/mois) :
1. Crée un compte sur https://formspree.io et copie l'URL du formulaire
2. Dans `src/contact.njk`, remplace `action="#"` par `action="https://formspree.io/f/XXXXXXXX"`
3. Supprime l'attribut `onsubmit="gererEnvoi(event)"` sur `<form>` et le bloc `<script>` en bas du fichier
