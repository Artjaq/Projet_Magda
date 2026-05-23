# Tout au Chaud — Site vitrine

Site vitrine pour Magda, créatrice de vêtements artisanaux en Suisse romande.  
Adresse prévue : **toutauchaud.ch**

---

## Ouvrir le site en local

Aucune installation requise. Double-cliquez simplement sur `index.html` dans votre explorateur de fichiers — le site s'ouvre dans votre navigateur.

Pour naviguer entre les pages, utilisez les liens du menu comme sur un vrai site.

---

## Structure des fichiers

```
Projet_Magda/
├── index.html       → Page d'accueil
├── apropos.html     → Page "À propos" (histoire de Magda, processus)
├── contact.html     → Page de contact (formulaire + coordonnées)
├── styles.css       → Tous les styles visuels du site
├── scripts.js       → Menu mobile et comportement du formulaire
└── README.md        → Ce fichier
```

---

## Comment modifier le contenu

### Changer un texte

Ouvrez le fichier `.html` correspondant avec un éditeur de texte (TextEdit sur Mac, Notepad sur Windows).  
Les textes à remplacer sont signalés par des commentaires comme :

```html
<!-- À remplacer par le texte réel -->
```

Modifiez uniquement ce qui se trouve entre les balises, par exemple entre `<p>` et `</p>`, sans toucher aux balises elles-mêmes.

---

### Ajouter une vraie photo

Les blocs d'images sont actuellement des rectangles colorés avec du texte descriptif.  
Pour les remplacer par de vraies photos :

1. Placez vos photos dans le dossier du projet (ex. `manteau.jpg`)
2. Dans le fichier HTML, remplacez le bloc :
   ```html
   <div class="piece-image img-placeholder" aria-hidden="true">
     <span>Photo : manteau en laine naturelle</span>
   </div>
   ```
   Par :
   ```html
   <img src="manteau.jpg" alt="Manteau en laine naturelle fait main" class="piece-image">
   ```
3. Adaptez le texte `alt="..."` pour décrire la photo (utile pour les personnes malvoyantes et Google).

---

### Changer l'adresse e-mail

Dans chaque fichier HTML, cherchez :
```html
href="mailto:contact@toutauchaud.ch"
```
Remplacez `contact@toutauchaud.ch` par la vraie adresse. Il y en a plusieurs occurrences (header, footer, page contact) — pensez à toutes les mettre à jour.

---

### Changer le lien Instagram

Cherchez dans les fichiers HTML :
```html
href="https://instagram.com"
```
Remplacez par l'URL complète du profil Instagram (ex. `https://instagram.com/toutauchaud`).

---

### Changer une couleur

Ouvrez `styles.css`. Toutes les couleurs sont regroupées en haut du fichier, dans la section `:root` :

```css
:root {
  --fond:          #F4EFE6;   /* Fond crème principal */
  --sable:         #EAE2D6;   /* Fond des sections alternées */
  --texte:         #2A2420;   /* Couleur du texte */
  --texte-doux:    #7A6E68;   /* Texte secondaire, labels */
  --accent:        #B0583A;   /* Terre cuite — boutons, liens */
  --accent-clair:  #C97A58;   /* Terre cuite claire — survol */
}
```

Changez le code hexadécimal (`#B0583A` etc.) pour modifier la couleur sur tout le site d'un seul coup.

---

## Brancher le formulaire de contact

Le formulaire est prêt à recevoir les messages — il lui manque juste une destination.

### Option 1 — Formspree (recommandé, gratuit jusqu'à 50 messages/mois)

1. Créez un compte gratuit sur [formspree.io](https://formspree.io)
2. Créez un nouveau formulaire et copiez votre URL (format `https://formspree.io/f/XXXXXXXX`)
3. Dans `contact.html`, remplacez la ligne :
   ```html
   action="#"
   ```
   Par :
   ```html
   action="https://formspree.io/f/XXXXXXXX"
   ```
4. Supprimez également l'attribut `onsubmit="gererEnvoi(event)"` sur la balise `<form>` et le bloc `<script>` en bas de la page — Formspree gère la confirmation lui-même.

### Option 2 — Firebase Function

Renseignez l'URL de votre fonction à la place de `action="#"`, de la même façon qu'avec Formspree.

---

## Déploiement sur Firebase Hosting

Le site est prêt pour Firebase Hosting. Aucun build nécessaire.

```bash
# Installer Firebase CLI si ce n'est pas déjà fait
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser le projet (choisir "Hosting", pointer vers le dossier courant)
firebase init hosting

# Déployer
firebase deploy
```

Lors de l'initialisation, Firebase demande quel dossier contient le site : répondez `.` (point) pour le dossier courant.

---

## Crédits

Site conçu et développé pour Magda — Tout au Chaud, Suisse romande.  
HTML / CSS / JavaScript vanilla, sans dépendances.  
Polices : [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) et [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts.
