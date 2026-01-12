// Vérifier l'authentification
async function checkAuth() {
    try {
        const response = await fetch('../php/check_session.php');
        const data = await response.json();
        
        if (!data.logged_in) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        window.location.href = 'login.html';
    }
}

// Déconnexion
document.getElementById('logoutBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('action', 'logout');
    await fetch('../php/auth.php', { method: 'POST', body: formData });
    window.location.href = 'login.html';
});

// Sélectionner un template
function selectTemplate(templateName) {
    // Récupérer les données du CV depuis sessionStorage
    const cvData = sessionStorage.getItem('cvData');
    
    if (!cvData) {
        alert('Erreur: Données du CV non trouvées. Veuillez remplir le formulaire à nouveau.');
        window.location.href = 'formulaire.html';
        return;
    }
    
    // Sauvegarder le template sélectionné
    sessionStorage.setItem('selectedTemplate', templateName);
    
    // Rediriger vers la page de prévisualisation
    window.location.href = 'preview.html';
}

// Initialiser
checkAuth();

// Vérifier si les données du CV existent
if (!sessionStorage.getItem('cvData')) {
    alert('Veuillez d\'abord remplir le formulaire de CV');
    window.location.href = 'formulaire.html';
}
