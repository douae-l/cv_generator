<?php
require_once 'config.php';
requireLogin();

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$userId = getUserId();

// Sauvegarder un CV complet
if ($action === 'save_cv') {
    try {
        $pdo->beginTransaction();
        
        // Données personnelles
        $cv_id = $_POST['cv_id'] ?? null;
        $titre_cv = $_POST['titre_cv'] ?? 'Mon CV';
        $template = $_POST['template'] ?? 'classic_blue';
        $nom = $_POST['nom'] ?? '';
        $prenom = $_POST['prenom'] ?? '';
        $titre_professionnel = $_POST['titre_professionnel'] ?? '';
        $description_profil = $_POST['description_profil'] ?? '';
        $telephone = $_POST['telephone'] ?? '';
        $email = $_POST['email'] ?? '';
        
        // Gestion de l'upload de photo
        $photo_profil = null;
        if (isset($_FILES['photo_profil']) && $_FILES['photo_profil']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../uploads/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $extension = pathinfo($_FILES['photo_profil']['name'], PATHINFO_EXTENSION);
            $filename = uniqid('photo_') . '.' . $extension;
            $uploadPath = $uploadDir . $filename;
            
            if (move_uploaded_file($_FILES['photo_profil']['tmp_name'], $uploadPath)) {
                $photo_profil = 'uploads/' . $filename;
            }
        }
        
        // Vérifier si c'est une mise à jour ou une création
        if ($cv_id) {
            // Mise à jour du CV existant
            if ($photo_profil) {
                $stmt = $pdo->prepare("
                    UPDATE cvs SET titre_cv = ?, template = ?, photo_profil = ?, nom = ?, prenom = ?, 
                                 titre_professionnel = ?, description_profil = ?, telephone = ?, email = ?
                    WHERE id = ? AND utilisateur_id = ?
                ");
                $stmt->execute([
                    $titre_cv, $template, $photo_profil, $nom, $prenom,
                    $titre_professionnel, $description_profil, $telephone, $email, $cv_id, $userId
                ]);
            } else {
                $stmt = $pdo->prepare("
                    UPDATE cvs SET titre_cv = ?, template = ?, nom = ?, prenom = ?, 
                                 titre_professionnel = ?, description_profil = ?, telephone = ?, email = ?
                    WHERE id = ? AND utilisateur_id = ?
                ");
                $stmt->execute([
                    $titre_cv, $template, $nom, $prenom,
                    $titre_professionnel, $description_profil, $telephone, $email, $cv_id, $userId
                ]);
            }
            
            // Supprimer les anciennes données liées
            $pdo->prepare("DELETE FROM experiences WHERE cv_id = ?")->execute([$cv_id]);
            $pdo->prepare("DELETE FROM diplomes WHERE cv_id = ?")->execute([$cv_id]);
            $pdo->prepare("DELETE FROM certificats WHERE cv_id = ?")->execute([$cv_id]);
            $pdo->prepare("DELETE FROM langues WHERE cv_id = ?")->execute([$cv_id]);
            $pdo->prepare("DELETE FROM loisirs WHERE cv_id = ?")->execute([$cv_id]);
            
            $cvId = $cv_id;
        } else {
            // Insérer un nouveau CV
            $stmt = $pdo->prepare("
                INSERT INTO cvs (utilisateur_id, titre_cv, template, photo_profil, nom, prenom, 
                               titre_professionnel, description_profil, telephone, email)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $userId, $titre_cv, $template, $photo_profil, $nom, $prenom,
                $titre_professionnel, $description_profil, $telephone, $email
            ]);
            
            $cvId = $pdo->lastInsertId();
        }
        
        // Insérer les expériences
        if (isset($_POST['experiences'])) {
            $experiences = json_decode($_POST['experiences'], true);
            $stmt = $pdo->prepare("
                INSERT INTO experiences (cv_id, nom_poste, entreprise, date_debut, date_fin, description, ordre)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($experiences as $index => $exp) {
                $stmt->execute([
                    $cvId, $exp['nom_poste'], $exp['entreprise'], 
                    $exp['date_debut'], $exp['date_fin'] ?? null, 
                    $exp['description'] ?? '', $index
                ]);
            }
        }
        
        // Insérer les diplômes
        if (isset($_POST['diplomes'])) {
            $diplomes = json_decode($_POST['diplomes'], true);
            $stmt = $pdo->prepare("
                INSERT INTO diplomes (cv_id, nom_diplome, institut, date_debut, date_fin, description, ordre)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($diplomes as $index => $dip) {
                $stmt->execute([
                    $cvId, $dip['nom_diplome'], $dip['institut'],
                    $dip['date_debut'], $dip['date_fin'] ?? null,
                    $dip['description'] ?? '', $index
                ]);
            }
        }
        
        // Insérer les certificats
        if (isset($_POST['certificats'])) {
            $certificats = json_decode($_POST['certificats'], true);
            $stmt = $pdo->prepare("
                INSERT INTO certificats (cv_id, nom_certificat, organisme, date_obtention, description, ordre)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            foreach ($certificats as $index => $cert) {
                $stmt->execute([
                    $cvId, $cert['nom_certificat'], $cert['organisme'],
                    $cert['date_obtention'], $cert['description'] ?? '', $index
                ]);
            }
        }
        
        // Insérer les langues
        if (isset($_POST['langues'])) {
            $langues = json_decode($_POST['langues'], true);
            $stmt = $pdo->prepare("
                INSERT INTO langues (cv_id, langue, niveau, ordre)
                VALUES (?, ?, ?, ?)
            ");
            foreach ($langues as $index => $lang) {
                $stmt->execute([$cvId, $lang['langue'], $lang['niveau'], $index]);
            }
        }
        
        // Insérer les loisirs
        if (isset($_POST['loisirs'])) {
            $loisirs = json_decode($_POST['loisirs'], true);
            $stmt = $pdo->prepare("
                INSERT INTO loisirs (cv_id, nom_loisir, ordre)
                VALUES (?, ?, ?)
            ");
            foreach ($loisirs as $index => $loisir) {
                $stmt->execute([$cvId, $loisir['nom_loisir'], $index]);
            }
        }
        
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'CV sauvegardé avec succès', 'cv_id' => $cvId]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la sauvegarde: ' . $e->getMessage()]);
    }
}

// Récupérer tous les CVs de l'utilisateur
if ($action === 'get_cvs') {
    try {
        $stmt = $pdo->prepare("
            SELECT id, titre_cv, nom, prenom, template, date_creation, date_modification
            FROM cvs
            WHERE utilisateur_id = ?
            ORDER BY date_modification DESC
        ");
        $stmt->execute([$userId]);
        $cvs = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'cvs' => $cvs]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des CVs']);
    }
}

// Récupérer un CV complet avec toutes ses données
if ($action === 'get_cv') {
    $cvId = $_GET['cv_id'] ?? 0;
    
    try {
        // Vérifier que le CV appartient à l'utilisateur
        $stmt = $pdo->prepare("SELECT * FROM cvs WHERE id = ? AND utilisateur_id = ?");
        $stmt->execute([$cvId, $userId]);
        $cv = $stmt->fetch();
        
        if (!$cv) {
            echo json_encode(['success' => false, 'message' => 'CV non trouvé']);
            exit;
        }
        
        // Récupérer les expériences
        $stmt = $pdo->prepare("SELECT * FROM experiences WHERE cv_id = ? ORDER BY ordre");
        $stmt->execute([$cvId]);
        $cv['experiences'] = $stmt->fetchAll();
        
        // Récupérer les diplômes
        $stmt = $pdo->prepare("SELECT * FROM diplomes WHERE cv_id = ? ORDER BY ordre");
        $stmt->execute([$cvId]);
        $cv['diplomes'] = $stmt->fetchAll();
        
        // Récupérer les certificats
        $stmt = $pdo->prepare("SELECT * FROM certificats WHERE cv_id = ? ORDER BY ordre");
        $stmt->execute([$cvId]);
        $cv['certificats'] = $stmt->fetchAll();
        
        // Récupérer les langues
        $stmt = $pdo->prepare("SELECT * FROM langues WHERE cv_id = ? ORDER BY ordre");
        $stmt->execute([$cvId]);
        $cv['langues'] = $stmt->fetchAll();
        
        // Récupérer les loisirs
        $stmt = $pdo->prepare("SELECT * FROM loisirs WHERE cv_id = ? ORDER BY ordre");
        $stmt->execute([$cvId]);
        $cv['loisirs'] = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'cv' => $cv]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération du CV']);
    }
}

// Supprimer un CV
if ($action === 'delete_cv') {
    $cvId = $_POST['cv_id'] ?? 0;
    
    try {
        $stmt = $pdo->prepare("DELETE FROM cvs WHERE id = ? AND utilisateur_id = ?");
        $stmt->execute([$cvId, $userId]);
        
        echo json_encode(['success' => true, 'message' => 'CV supprimé avec succès']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression']);
    }
}
?>
