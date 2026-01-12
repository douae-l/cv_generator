// Vérifier si l'utilisateur est connecté
async function checkAuth() {
    try {
        const response = await fetch('../php/check_session.php');
        const data = await response.json();
        
        if (!data.logged_in) {
            window.location.href = 'login.html';
        } else {
            document.getElementById('userName').textContent = `Bonjour, ${data.user_prenom}`;
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
    
    try {
        await fetch('../php/auth.php', {
            method: 'POST',
            body: formData
        });
        
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erreur lors de la déconnexion');
    }
});

// Vérifier l'authentification au chargement
checkAuth();
