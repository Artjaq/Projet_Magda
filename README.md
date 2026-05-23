# Tout au Chaud — Site vitrine

Site vitrine de Magda, créatrice de vêtements faits main en Suisse romande.
Construit avec **Eleventy** (générateur de site statique) et **Decap CMS** (interface d'édition web).

---

## Pour Arthur — Guide technique

### Structure du projet

```
src/
├── _data/          → Fichiers YAML : tout le contenu éditable
│   ├── site.yaml       Données globales (logo, email, Instagram)
│   ├── accueil.yaml    Contenu page Accueil
│   ├── apropos.yaml    Contenu page À propos
│   └── contact.yaml    Contenu page Contact
├── _includes/      → Templates partagés
│   ├── base.njk        Layout de base (head, body, scripts)
│   ├── header.njk      En-tête + navigation
│   └── footer.njk      Pied de page
├── pieces/         → Un fichier .md par pièce de la collection
├── uploads/        → Images uploadées via Decap CMS
├── admin/          → Interface Decap CMS
│   ├── index.html      Page admin
│   └── config.yml      Collections et champs Decap
├── styles.css      → CSS identique au site original
└── scripts.js      → JS identique (menu hamburger)
```

### Installation locale

```bash
# Cloner le dépôt puis :
npm install
npm run dev
# → Site disponible sur http://localhost:8080
```

### Build de production

```bash
npm run build
# → Fichiers générés dans _site/
```

### Déploiement sur Netlify

**Étape 1 — Connecter le dépôt**
- Va sur [netlify.com](https://netlify.com) → "Add new site" → "Import an existing project"
- Sélectionne le dépôt GitHub
- Netlify lit automatiquement `netlify.toml` : commande `npm run build`, dossier de publication `_site`
- Lance le premier déploiement

**Étape 2 — Activer Netlify Identity**
- Dashboard du site → "Site settings" → "Identity" → **Enable Identity**
- Dans "Registration preferences" → sélectionne **Invite only**
  *(seule Magda peut se connecter, pas n'importe qui)*

**Étape 3 — Activer Git Gateway**
- Toujours dans "Identity" → "Services" → **Enable Git Gateway**
- Cela permet à Decap CMS de committer directement sur GitHub au nom de Magda

**Étape 4 — Inviter Magda**
- "Identity" → "Invite users" → entre l'adresse email de Magda
- Elle reçoit un email avec un lien pour définir son mot de passe
- Elle accède ensuite à `toutauchaudme.ch/admin`

### Ajouter un nouveau champ éditable

1. Ouvre [src/admin/config.yml](src/admin/config.yml)
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
Référence complète : https://decapcms.org/docs/widgets/

### Ajouter une nouvelle collection de pièces

Dans [.eleventy.js](.eleventy.js), duplique le bloc `addCollection` :
```js
eleventyConfig.addCollection("nomCollection", function (collectionApi) {
  return collectionApi
    .getFilteredByGlob("src/nomCollection/*.md")
    .sort((a, b) => (a.data.ordre || 0) - (b.data.ordre || 0));
});
```
Puis ajoute la collection dans `src/admin/config.yml` en suivant le modèle existant.

### Mettre à jour Decap CMS

Dans [src/admin/index.html](src/admin/index.html), remplace le numéro de version :
```html
<script src="https://unpkg.com/decap-cms@^3.X.X/dist/decap-cms.js"></script>
```
Dernières versions : https://github.com/decaporg/decap-cms/releases

### Brancher le formulaire de contact

Le formulaire est actuellement en mode "démo" (affiche un message de confirmation sans envoyer).

**Option recommandée — Formspree** (gratuit jusqu'à 50 messages/mois) :
1. Crée un compte sur https://formspree.io et copie ton URL de formulaire
2. Dans [src/contact.njk](src/contact.njk), remplace `action="#"` par `action="https://formspree.io/f/XXXXXXXX"`
3. Supprime l'attribut `onsubmit="gererEnvoi(event)"` sur `<form>` et le bloc `<script>` en bas du fichier

---

## Pour Magda — Guide d'édition

### Comment accéder à l'interface d'administration

1. Ouvre ton navigateur (Safari, Chrome ou Firefox)
2. Va à l'adresse : **toutauchaudme.ch/admin**
3. Connecte-toi avec ton adresse email et ton mot de passe

> Si c'est ta première connexion, tu as reçu un email d'invitation d'Arthur.
> Clique sur le lien dans cet email pour définir ton mot de passe.

---

### Comment modifier un texte du site

1. Dans l'admin, clique sur **"Pages et données du site"** dans le menu de gauche
2. Choisis la page à modifier (ex. : "Page Accueil")
3. Clique sur le champ à changer et tape ton nouveau texte
4. Quand tu as fini, clique sur **"Enregistrer"** en haut à droite
5. Le site se met à jour automatiquement en quelques minutes

---

### Comment ajouter une nouvelle pièce

1. Dans l'admin, clique sur **"Pièces"** dans le menu de gauche
2. Clique sur **"Nouvelle Pièce"** (bouton en haut à droite)
3. Remplis les champs :
   - **Titre de la pièce** : ex. "Veste en lin naturel"
   - **Photo de la pièce** : clique sur le champ, puis sur "Upload" pour envoyer ta photo depuis ton ordinateur
   - **Description** : une courte légende pour la photo
   - **Ordre d'affichage** : un numéro (1 = en premier sur le site, 2 = deuxième, etc.)
4. Clique sur **"Enregistrer"**

> La photo sera affichée dans la grille sur la page d'accueil.
> Si tu n'as pas encore de photo, laisse le champ vide — un espace coloré sera affiché à la place.

---

### Comment modifier une pièce existante

1. Dans l'admin, clique sur **"Pièces"**
2. Dans la liste, clique sur la pièce à modifier
3. Change ce que tu veux (titre, photo, description)
4. Clique sur **"Enregistrer"**

---

### Comment supprimer une pièce

1. Dans l'admin, clique sur **"Pièces"**
2. Dans la liste, clique sur la pièce à supprimer
3. Clique sur les **trois petits points** (⋮) en haut à droite
4. Choisis **"Supprimer"**

> La suppression est définitive. En cas d'erreur, contacte Arthur.

---

### Comment changer l'ordre des pièces

Les pièces sont affichées sur le site dans l'ordre croissant de leur numéro "Ordre d'affichage".

**Exemple :** pour afficher le châle en premier :
1. Ouvre la fiche du châle → change son ordre à **1** → Enregistrer
2. Ouvre la fiche du manteau → change son ordre à **2** → Enregistrer
3. Continue pour toutes les pièces

---

### Comment changer ta photo biographique (page À propos)

1. Clique sur **"Pages et données du site"** → **"Page À propos"**
2. Clique sur le champ **"Photo biographie"**
3. Clique sur **"Upload"** et choisis ta nouvelle photo
4. Clique sur **"Enregistrer"**

---

### Ce qu'il ne faut pas modifier

- **Le formulaire de contact** (les champs Prénom, Nom, Email, Message) — c'est du code, pas du contenu.
- **La structure générale** du site : en-tête, navigation, pied de page.
- **Le titre biographique** s'il contient `<br>` — demande à Arthur si tu veux le changer.

En cas de doute, contacte Arthur avant de faire une modification.

---

*Site développé par Arthur Jaquier. Propulsé par [Eleventy](https://www.11ty.dev) et [Decap CMS](https://decapcms.org).*
