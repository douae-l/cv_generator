# Générateur de CV - Application Web

Application web complète pour créer, gérer et télécharger des CVs professionnels avec plusieurs modèles de design.

## 📋 Fonctionnalités

- ✅ **Authentification utilisateur** (inscription/connexion)
- ✅ **Formulaire complet** pour créer un CV avec :
  - Informations personnelles (photo, nom, prénom, téléphone, email)
  - Expériences professionnelles (multiples)
  - Diplômes (multiples)
  - Certificats (multiples)
  - Langues avec niveaux
  - Loisirs
- ✅ **4 modèles de CV professionnels** :
  - Classic Blue
  - Modern Dark
  - Creative Green
  - Professional Purple
- ✅ **Gestion de collection** : visualiser, imprimer et supprimer vos CVs
- ✅ **Export PDF** via impression
- ✅ **Validation des formulaires** (téléphone +212, email, noms sans chiffres)
- ✅ **Interface en français**
- ✅ **Design responsive**

## 🚀 Installation

### Prérequis

- XAMPP (Apache + MySQL + PHP)
- Navigateur web moderne

### Étapes d'installation

1. **Démarrer XAMPP**
   - Ouvrez XAMPP Control Panel
   - Démarrez Apache et MySQL

2. **Créer la base de données**
   - Ouvrez phpMyAdmin : `http://localhost/phpmyadmin`
   - Cliquez sur "Importer"
   - Sélectionnez le fichier `database.sql`
   - Cliquez sur "Exécuter"

3. **Accéder à l'application**
   - Ouvrez votre navigateur
   - Allez à : `http://localhost/CV.DONE/pages/login.html`

## 📁 Structure du projet

```
CV.DONE/
│
├── css/                      # Fichiers CSS
│   ├── style.css            # Styles globaux
│   ├── login.css            # Styles page de connexion
│   ├── accueil.css          # Styles page d'accueil
│   ├── formulaire.css       # Styles formulaire
│   ├── templates.css        # Styles sélection de templates
│   ├── preview.css          # Styles prévisualisation
│   ├── collection.css       # Styles collection de CVs
│   └── cv-templates.css     # Styles des templates de CV
│
├── js/                       # Fichiers JavaScript
│   ├── login.js             # Logique connexion/inscription
│   ├── accueil.js           # Logique page d'accueil
│   ├── formulaire.js        # Logique formulaire
│   ├── templates.js         # Logique sélection templates
│   ├── preview.js           # Logique prévisualisation
│   └── collection.js        # Logique collection de CVs
│
├── php/                      # Fichiers PHP
│   ├── config.php           # Configuration base de données
│   ├── auth.php             # Authentification
│   ├── check_session.php    # Vérification session
│   └── cv_operations.php    # Opérations sur les CVs
│
├── pages/                    # Pages HTML
│   ├── login.html           # Page de connexion
│   ├── accueil.html         # Page d'accueil
│   ├── formulaire.html      # Formulaire de création
│   ├── templates.html       # Sélection de template
│   ├── preview.html         # Prévisualisation du CV
│   └── collection.html      # Collection de CVs
│
├── uploads/                  # Dossier pour les photos de profil
│
├── database.sql             # Script SQL de création de la base
└── README.md                # Ce fichier
```

## 🗄️ Structure de la base de données

### Tables principales

1. **utilisateurs** : Informations des utilisateurs
2. **cvs** : Informations principales des CVs
3. **experiences** : Expériences professionnelles
4. **diplomes** : Diplômes et formations
5. **certificats** : Certificats obtenus
6. **langues** : Langues parlées
7. **loisirs** : Loisirs et centres d'intérêt

## 🎨 Templates disponibles

### 1. Classic Blue
Design professionnel avec une barre latérale bleue et un contenu blanc.

### 2. Modern Dark
Design élégant avec une barre latérale sombre et un fond gris clair.

### 3. Creative Green
Design frais avec une barre latérale verte et un contenu blanc.

### 4. Professional Purple
Design élégant avec une barre latérale violette et un contenu blanc.

## 📝 Utilisation

### 1. Créer un compte
- Accédez à la page de connexion
- Cliquez sur "Créer un compte"
- Remplissez vos informations
- Connectez-vous

### 2. Créer un CV
- Cliquez sur "Créer un nouveau CV"
- Remplissez le formulaire :
  - **Photo** : Téléchargez votre photo de profil
  - **Informations personnelles** : Nom, prénom, titre, description
  - **Contact** : Téléphone (+212XXXXXXXXX), email
  - **Expériences** : Ajoutez vos expériences professionnelles
  - **Diplômes** : Ajoutez vos formations
  - **Certificats** : Ajoutez vos certificats
  - **Langues** : Sélectionnez vos langues et niveaux
  - **Loisirs** : Ajoutez vos loisirs
- Cliquez sur "Générer le CV"

### 3. Choisir un template
- Sélectionnez parmi les 4 modèles disponibles
- Prévisualisez votre CV
- Cliquez sur "Sauvegarder le CV"

### 4. Gérer vos CVs
- Accédez à "Ma collection de CVs"
- Visualisez tous vos CVs dans un tableau
- Actions disponibles :
  - **Voir** : Afficher le CV complet
  - **Imprimer** : Imprimer le CV
  - **Télécharger PDF** : Sauvegarder en PDF
  - **Supprimer** : Supprimer le CV

## ✅ Validations des formulaires

- **Nom/Prénom** : Lettres uniquement (pas de chiffres)
- **Téléphone** : Format +212 suivi de 9 chiffres
- **Email** : Format email valide
- **Dates** : Sélection via calendrier
- **Photo** : Formats JPG, PNG (max 5MB)

## 🔐 Sécurité

- Mots de passe hashés avec `password_hash()`
- Sessions PHP sécurisées
- Protection contre les injections SQL (requêtes préparées)
- Validation côté client et serveur
- Chaque utilisateur ne voit que ses propres CVs

## 🌐 Compte de test

Pour tester rapidement l'application :
- **Email** : test@example.com
- **Mot de passe** : test123

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte aux :
- Ordinateurs de bureau
- Tablettes
- Smartphones

## 🛠️ Technologies utilisées

- **Frontend** :
  - HTML5
  - CSS3 (avec variables CSS)
  - JavaScript (ES6+)
  
- **Backend** :
  - PHP 7.4+
  - MySQL
  
- **Serveur** :
  - Apache (via XAMPP)

## 📄 Export PDF

Pour télécharger un CV en PDF :
1. Ouvrez le CV dans la collection
2. Cliquez sur "Télécharger PDF"
3. Dans la fenêtre d'impression :
   - Sélectionnez "Enregistrer au format PDF"
   - Choisissez l'emplacement
   - Cliquez sur "Enregistrer"

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré dans XAMPP
- Vérifiez les identifiants dans `php/config.php`

### Les images ne s'affichent pas
- Vérifiez que le dossier `uploads/` existe
- Vérifiez les permissions du dossier

### Erreur 404
- Vérifiez que vous accédez à l'URL correcte
- Vérifiez que le projet est dans `C:\xampp\htdocs\CV.DONE`

## 📞 Support

Pour toute question ou problème, vérifiez :
1. Que XAMPP est bien démarré (Apache + MySQL)
2. Que la base de données est créée
3. Que vous accédez à la bonne URL

## 🎯 Améliorations futures possibles

- Export PDF automatique côté serveur
- Édition de CVs existants
- Duplication de CVs
- Plus de templates
- Partage de CVs par lien
- Statistiques de visualisation

---

**Développé avec ❤️ pour créer des CVs professionnels facilement**
