<?php
require_once 'config.php';

header('Content-Type: application/json');

if (isLoggedIn()) {
    echo json_encode([
        'logged_in' => true,
        'user_id' => $_SESSION['user_id'],
        'user_email' => $_SESSION['user_email'],
        'user_nom' => $_SESSION['user_nom'],
        'user_prenom' => $_SESSION['user_prenom']
    ]);
} else {
    echo json_encode(['logged_in' => false]);
}
?>
