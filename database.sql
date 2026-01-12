-- Base de données pour l'application de génération de CV
-- À exécuter dans phpMyAdmin

CREATE DATABASE IF NOT EXISTS cv_generator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cv_generator;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des CVs
CREATE TABLE IF NOT EXISTS cvs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    titre_cv VARCHAR(255) NOT NULL,
    template VARCHAR(50) NOT NULL,
    photo_profil VARCHAR(255),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    titre_professionnel VARCHAR(255),
    description_profil TEXT,
    telephone VARCHAR(20),
    email VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_utilisateur (utilisateur_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des expériences professionnelles
CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    nom_poste VARCHAR(255) NOT NULL,
    entreprise VARCHAR(255) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    description TEXT,
    ordre INT DEFAULT 0,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE,
    INDEX idx_cv (cv_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des diplômes
CREATE TABLE IF NOT EXISTS diplomes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    nom_diplome VARCHAR(255) NOT NULL,
    institut VARCHAR(255) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    description TEXT,
    ordre INT DEFAULT 0,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE,
    INDEX idx_cv (cv_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des certificats
CREATE TABLE IF NOT EXISTS certificats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    nom_certificat VARCHAR(255) NOT NULL,
    organisme VARCHAR(255) NOT NULL,
    date_obtention DATE NOT NULL,
    description TEXT,
    ordre INT DEFAULT 0,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE,
    INDEX idx_cv (cv_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des langues
CREATE TABLE IF NOT EXISTS langues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    langue VARCHAR(100) NOT NULL,
    niveau VARCHAR(50) NOT NULL,
    ordre INT DEFAULT 0,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE,
    INDEX idx_cv (cv_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des loisirs
CREATE TABLE IF NOT EXISTS loisirs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    nom_loisir VARCHAR(255) NOT NULL,
    ordre INT DEFAULT 0,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE,
    INDEX idx_cv (cv_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion d'un utilisateur de test (mot de passe: test123)
INSERT INTO utilisateurs (email, mot_de_passe, nom, prenom) 
VALUES ('test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'Utilisateur');
