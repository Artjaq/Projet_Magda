# Tout au Chaud

**Site vitrine statique avec CMS headless pour une artisane textile**

![Eleventy](https://img.shields.io/badge/Eleventy-v3-black?logo=eleventy)
![Decap CMS](https://img.shields.io/badge/Decap_CMS-v3-FF6B6B)
![Netlify](https://img.shields.io/badge/Netlify-deployed-00C7B7?logo=netlify)
![Licence MIT](https://img.shields.io/badge/Licence-MIT-blue)

## Aperçu

Site vitrine 3 pages pour Magda, créatrice de vêtements artisanaux en Suisse romande, avec interface d'administration autonome. Zéro dépendance front-end, hébergement à 0 CHF/mois.

🔗 [projetmagda.netlify.app](https://projetmagda.netlify.app)

![Aperçu du site](./docs/screenshot.png)

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

## Le projet en bref

**Commanditaire :** Magda, 65 ans, artisane textile non-technique. Aucune connaissance en développement web.

**Problème :** présenter ses créations en ligne et pouvoir en ajouter ou modifier sans dépendre d'un développeur pour chaque changement de texte ou de photo.

**Fonctionnalités :**
- 3 pages (accueil, à propos, contact) avec design artisanal en CSS vanilla
- Grille de pièces dynamique, triée et éditables via CMS
- Interface d'administration en français, accessible depuis un navigateur
- Formulaire de contact (prêt à brancher sur Formspree)
- Navigation responsive avec menu hamburger

Le formulaire est actuellement en mode "démo" (affiche un message de confirmation sans envoyer).

## Stack technique

| Technologie | Rôle | Pourquoi |
|---|---|---|
| **Eleventy v3** | Générateur de site statique | Minimaliste, sans opinion sur le CSS/JS, templates proches du HTML |
| **Nunjucks** | Moteur de templates | Syntaxe lisible, boucles et filtres suffisants pour ce projet |
| **YAML** (`src/_data/`) | Données éditables | Format lisible par un humain, natif dans Eleventy |
| **Decap CMS v3** | Interface d'édition | CMS headless open source, s'intègre à n'importe quel repo Git |
| **DecapBridge** | Authentification PKCE | Remplace Netlify Identity, aucun secret côté client |
| **Netlify** | Hébergement + CI/CD | Build déclenché par chaque push, CDN global, tier gratuit suffisant |
| **CSS / JS vanilla** | Style et interactions | Aucune dépendance, rendu identique au prototype initial |

### Comment accéder à l'interface d'administration

## Décisions & trade-offs

### Site statique plutôt que CMS classique

Le premier réflexe pour un client non-technique est souvent WordPress ou Shopify. Ces outils gèrent bien l'édition de contenu, mais ils embarquent une infrastructure (base de données, serveur PHP, mises à jour de sécurité, plugins) dont les besoins de ce projet ne justifient pas le coût — ni en argent (5–30 CHF/mois pour un hébergement WordPress décent), ni en maintenance. Un site de trois pages sans stock, sans panier et sans commentaires n'a pas besoin d'un CMS à part entière : il a besoin qu'une non-technicienne puisse changer un texte ou uploader une photo. L'architecture statique répond à ce besoin avec un coût d'hébergement nul, une surface d'attaque quasi inexistante (pas de base de données, pas de PHP, pas de sessions) et des performances CDN par défaut.

Le compromis accepté : pas de recherche dynamique, pas de filtrage en temps réel sur les pièces. Ces fonctionnalités n'étaient pas dans le cahier des charges.

### Eleventy plutôt que Hugo, Astro ou Next.js

Hugo aurait été plus rapide à compiler, mais son langage de templates Go devient difficile à déboguer dès qu'on sort des cas standards — et le projet nécessitait des filtres personnalisés (rendu Markdown avec classe CSS injectée, formatage de numéros). Next.js est surdimensionné pour un site statique sans interactivité côté client ; son export statique ajoute une couche de configuration sans bénéfice ici. Astro est une option sérieuse, mais son modèle par composants aurait imposé de réécrire le CSS existant autour de styles scopés, perdant le bénéfice d'une feuille de styles vanilla déjà travaillée.

Eleventy a été retenu pour sa posture minimaliste : il compile des templates Nunjucks en HTML statique, copie les fichiers CSS/JS sans les transformer, et ne prend aucune opinion sur l'architecture front-end. Le seul point de friction rencontré : le support des fichiers `.yaml` pour les données globales n'est plus activé par défaut en v3, contrairement à v2 — résolu par un appel à `addDataExtension("yaml,yml", ...)` dans la configuration.

### DecapBridge plutôt que Netlify Identity

Le projet a démarré avec Netlify Identity + Git Gateway, la combinaison historiquement recommandée pour Decap CMS. Deux raisons ont motivé la migration. D'abord, Netlify Identity est une fonctionnalité secondaire pour Netlify, progressivement déprioritisée et d'avenir incertain. Ensuite, l'architecture qu'elle impose charge le widget `netlify-identity-widget.js` sur chaque page du site public, y compris pour les visiteurs qui n'ont aucune raison de s'authentifier.

DecapBridge est une solution dédiée à l'écosystème Decap CMS, maintenue activement, qui utilise un flux PKCE. Le résultat : aucun JavaScript d'authentification sur le site public, aucun secret stocké dans le dépôt, une interface admin qui reste à `/admin`. Le compromis est une dépendance supplémentaire envers un service tiers — acceptable pour un site vitrine à faible criticité, à réévaluer pour un contexte plus sensible.

### Authentification PKCE plutôt qu'OAuth maison

Implémenter soi-même un flux OAuth pour donner accès au CMS implique un serveur, la gestion de secrets et une surface d'attaque à maintenir dans le temps. Le PKCE via DecapBridge délègue ce problème à un service spécialisé : le dépôt ne contient aucune clé privée, aucun token, aucune credential. Le seul élément semi-public dans le repo est l'identifiant de site dans les endpoints d'authentification — ce qui est attendu et sans risque dans un flux PKCE, où la sécurité repose sur un code verifier éphémère et non sur un secret statique.

---

## Architecture

```mermaid
flowchart LR
    M(["Magda\n(navigateur)"])
    A["/admin\nDecap CMS"]
    DB["DecapBridge\nPKCE auth"]
    GH["GitHub\nrepo"]
    NB["Netlify\nbuild"]
    CDN["CDN\nNetlify Edge"]
    V(["Visiteur\n(navigateur)"])

    M -->|édite le contenu| A
    A -->|authentification| DB
    DB -->|commit Git| GH
    GH -->|webhook push| NB
    NB -->|npm run build| CDN
    V -->|visite le site| CDN
```

---

## Structure du projet

```
src/
├── _data/              → Contenu éditable (YAML, lu par Eleventy)
│   ├── site.yaml           Logo, email, Instagram (données globales)
│   ├── accueil.yaml        Hero, grille de pièces, section présentation
│   ├── apropos.yaml        Bio, photo, processus en 3 étapes
│   └── contact.yaml        Textes et coordonnées de la page contact
├── _includes/          → Templates partagés (Nunjucks)
│   ├── base.njk            Layout de base : <head>, header, footer, scripts
│   ├── header.njk          Navigation + menu hamburger
│   └── footer.njk          Pied de page
├── pieces/             → Collection : un fichier .md par pièce
├── uploads/            → Images uploadées via Decap CMS
├── admin/              → Interface Decap CMS
│   ├── index.html          Page d'administration
│   └── config.yml          Définition des collections et champs éditables
├── index.njk           → Page accueil
├── apropos.njk         → Page à propos
├── contact.njk         → Page contact
├── styles.css          → CSS vanilla (responsive, accessible)
└── scripts.js          → JS vanilla (menu mobile)
```

---

## Lancer en local

```bash
git clone https://github.com/Artjaq/Projet_Magda.git
cd Projet_Magda
npm install
npm run dev
# → http://localhost:8080
```

---

## Documentation détaillée

- [docs/DEPLOY.md](docs/DEPLOY.md) — déploiement Netlify, configuration DecapBridge, ajout de champs et collections
- [docs/EDITION.md](docs/EDITION.md) — guide d'utilisation pour Magda (pas à pas, sans jargon technique)

---

## Licence

[MIT](LICENSE) — Arthur Jaquier, 2025

---

## Auteur

**Arthur Jaquier**
[GitHub](https://github.com/Artjaq) · [LinkedIn](#) <!-- Remplacer # par l'URL LinkedIn -->
