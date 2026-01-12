// Gestion de l'authentification

// Éléments du DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const formLogin = document.getElementById('formLogin');
const formRegister = document.getElementById('formRegister');
const alertMessage = document.getElementById('alertMessage');

// Basculer entre connexion et inscription
showRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    hideAlert();
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    hideAlert();
});

// Afficher un message d'alerte
function showAlert(message, type = 'error') {
    alertMessage.textContent = message;
    alertMessage.className = `alert alert-${type} show`;
    
    setTimeout(() => {
        hideAlert();
    }, 5000);
}

function hideAlert() {
    alertMessage.className = 'alert';
}

// Soumettre le formulaire de connexion
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(formLogin);
    formData.append('action', 'login');
    
    try {
        const response = await fetch('../php/auth.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message, 'success');
            setTimeout(() => {
                window.location.href = 'accueil.html';
            }, 1000);
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur', 'error');
    }
});

// Soumettre le formulaire d'inscription
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    if (password !== passwordConfirm) {
        showAlert('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    const formData = new FormData(formRegister);
    formData.append('action', 'register');
    
    try {
        const response = await fetch('../php/auth.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message, 'success');
            setTimeout(() => {
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                formRegister.reset();
            }, 2000);
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur', 'error');
    }
});
