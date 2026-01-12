// Variables globales
let experienceCount = 0;
let diplomeCount = 0;
let certificatCount = 0;
let langueCount = 0;
let loisirCount = 0;

// Listes prédéfinies
const languesDisponibles = [
    'Français', 'Anglais', 'Arabe', 'Espagnol', 'Allemand', 
    'Italien', 'Portugais', 'Chinois', 'Japonais', 'Russe'
];

const niveauxLangue = [
    'Débutant', 'Élémentaire', 'Intermédiaire', 
    'Intermédiaire Avancé', 'Avancé', 'Courant', 'Bilingue', 'Langue Maternelle'
];

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

// Ajouter une expérience
function addExperience() {
    experienceCount++;
    const container = document.getElementById('experiencesContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-section';
    div.id = `experience-${experienceCount}`;
    div.innerHTML = `
        <button type="button" class="btn-remove" onclick="removeElement('experience-${experienceCount}')">×</button>
        <h3>Expérience ${experienceCount}</h3>
        
        <div class="form-group">
            <label>Nom du Poste *</label>
            <input type="text" name="exp_nom_poste[]" required>
        </div>
        
        <div class="form-group">
            <label>Entreprise/Institut *</label>
            <input type="text" name="exp_entreprise[]" required>
        </div>
        
        <div class="form-group">
            <label>Date de Début *</label>
            <input type="date" name="exp_date_debut[]" class="date-debut" required onchange="validateDates(this)">
        </div>
        
        <div class="form-group">
            <label>Date de Fin</label>
            <input type="date" name="exp_date_fin[]" class="date-fin" onchange="validateDates(this)">
            <small>Laissez vide si vous occupez toujours ce poste</small>
        </div>
        
        <div class="form-group">
            <label>Description</label>
            <textarea name="exp_description[]" rows="3" placeholder="Décrivez vos responsabilités et réalisations"></textarea>
        </div>
    `;
    container.appendChild(div);
}

// Ajouter un diplôme
function addDiplome() {
    diplomeCount++;
    const container = document.getElementById('diplomesContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-section';
    div.id = `diplome-${diplomeCount}`;
    div.innerHTML = `
        <button type="button" class="btn-remove" onclick="removeElement('diplome-${diplomeCount}')">×</button>
        <h3>Diplôme ${diplomeCount}</h3>
        
        <div class="form-group">
            <label>Nom du Diplôme *</label>
            <input type="text" name="dip_nom[]" required>
        </div>
        
        <div class="form-group">
            <label>Institut *</label>
            <input type="text" name="dip_institut[]" required>
        </div>
        
        <div class="form-group">
            <label>Date de Début *</label>
            <input type="date" name="dip_date_debut[]" class="date-debut" required onchange="validateDates(this)">
        </div>
        
        <div class="form-group">
            <label>Date de Fin</label>
            <input type="date" name="dip_date_fin[]" class="date-fin" onchange="validateDates(this)">
            <small>Laissez vide si en cours</small>
        </div>
        
        <div class="form-group">
            <label>Description</label>
            <textarea name="dip_description[]" rows="3" placeholder="Décrivez votre formation"></textarea>
        </div>
    `;
    container.appendChild(div);
}

// Ajouter un certificat
function addCertificat() {
    certificatCount++;
    const container = document.getElementById('certificatsContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-section';
    div.id = `certificat-${certificatCount}`;
    div.innerHTML = `
        <button type="button" class="btn-remove" onclick="removeElement('certificat-${certificatCount}')">×</button>
        <h3>Certificat ${certificatCount}</h3>
        
        <div class="form-group">
            <label>Nom du Certificat *</label>
            <input type="text" name="cert_nom[]" required>
        </div>
        
        <div class="form-group">
            <label>Organisme *</label>
            <input type="text" name="cert_organisme[]" required>
        </div>
        
        <div class="form-group">
            <label>Date d'Obtention *</label>
            <input type="date" name="cert_date_obtention[]" required>
        </div>
        
        <div class="form-group">
            <label>Description</label>
            <textarea name="cert_description[]" rows="3" placeholder="Décrivez le certificat"></textarea>
        </div>
    `;
    container.appendChild(div);
}

// Ajouter une langue
function addLangue() {
    langueCount++;
    const container = document.getElementById('languesContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-section';
    div.id = `langue-${langueCount}`;
    
    let languesOptions = languesDisponibles.map(l => `<option value="${l}">${l}</option>`).join('');
    
    div.innerHTML = `
        <button type="button" class="btn-remove" onclick="removeElement('langue-${langueCount}')">×</button>
        <h3>Langue ${langueCount}</h3>
        
        <div class="form-group">
            <label>Langue *</label>
            <select name="lang_langue[]" required>
                <option value="">Sélectionnez une langue</option>
                ${languesOptions}
            </select>
        </div>
        
        <div class="form-group">
            <label>Niveau (%) *</label>
            <input type="number" name="lang_niveau[]" required min="0" max="100" placeholder="Ex: 85" oninput="validatePercentage(this)">
            <small>Entrez un pourcentage entre 0 et 100</small>
        </div>
    `;
    container.appendChild(div);
}

// Ajouter un loisir
function addLoisir() {
    loisirCount++;
    const container = document.getElementById('loisirsContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-section';
    div.id = `loisir-${loisirCount}`;
    div.innerHTML = `
        <button type="button" class="btn-remove" onclick="removeElement('loisir-${loisirCount}')">×</button>
        <h3>Loisir ${loisirCount}</h3>
        
        <div class="form-group">
            <label>Nom du Loisir *</label>
            <input type="text" name="loisir_nom[]" required placeholder="Ex: Lecture, Sport, Musique...">
        </div>
    `;
    container.appendChild(div);
}

// Supprimer un élément
function removeElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

// Valider les dates (début avant fin)
function validateDates(input) {
    const section = input.closest('.dynamic-section');
    if (!section) return;
    
    const dateDebut = section.querySelector('.date-debut');
    const dateFin = section.querySelector('.date-fin');
    
    if (dateDebut && dateFin && dateDebut.value && dateFin.value) {
        const debut = new Date(dateDebut.value);
        const fin = new Date(dateFin.value);
        
        if (debut > fin) {
            dateFin.setCustomValidity('La date de fin doit être après la date de début');
            showAlert('Erreur: La date de fin doit être après la date de début', 'error');
            dateFin.value = '';
        } else {
            dateFin.setCustomValidity('');
        }
    }
}

// Valider le pourcentage des langues
function validatePercentage(input) {
    const value = parseInt(input.value);
    if (value < 0 || value > 100) {
        input.setCustomValidity('Le pourcentage doit être entre 0 et 100');
        showAlert('Erreur: Le niveau doit être entre 0 et 100%', 'error');
        input.value = '';
    } else {
        input.setCustomValidity('');
    }
}

// Afficher un message
function showAlert(message, type = 'error') {
    const alert = document.getElementById('alertMessage');
    alert.textContent = message;
    alert.className = `alert alert-${type} show`;
    alert.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    setTimeout(() => {
        alert.className = 'alert';
    }, 5000);
}

// Soumettre le formulaire
document.getElementById('cvForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Vérifier si la photo est présente (sauf en mode édition avec photo existante)
    const photoInput = document.getElementById('photo_profil');
    const isEditing = document.getElementById('cvForm').dataset.cvId;
    
    if (!isEditing && !photoInput.files.length) {
        showAlert('Veuillez ajouter une photo de profil', 'error');
        photoInput.focus();
        return;
    }
    
    // Valider tous les pourcentages des langues
    const langueNiveaux = document.getElementsByName('lang_niveau[]');
    for (let i = 0; i < langueNiveaux.length; i++) {
        const value = parseInt(langueNiveaux[i].value);
        if (value < 0 || value > 100) {
            showAlert('Tous les niveaux de langue doivent être entre 0 et 100%', 'error');
            langueNiveaux[i].focus();
            return;
        }
    }
    
    // Valider toutes les dates
    const allSections = document.querySelectorAll('.dynamic-section');
    for (let section of allSections) {
        const dateDebut = section.querySelector('.date-debut');
        const dateFin = section.querySelector('.date-fin');
        
        if (dateDebut && dateFin && dateDebut.value && dateFin.value) {
            const debut = new Date(dateDebut.value);
            const fin = new Date(dateFin.value);
            
            if (debut > fin) {
                showAlert('Toutes les dates de fin doivent être après les dates de début', 'error');
                dateFin.focus();
                return;
            }
        }
    }
    
    const formData = new FormData(e.target);
    formData.append('action', 'save_cv');
    formData.append('titre_cv', 'Mon CV'); // Titre par défaut
    
    // Collecter les expériences
    const experiences = [];
    const expNoms = document.getElementsByName('exp_nom_poste[]');
    for (let i = 0; i < expNoms.length; i++) {
        experiences.push({
            nom_poste: document.getElementsByName('exp_nom_poste[]')[i].value,
            entreprise: document.getElementsByName('exp_entreprise[]')[i].value,
            date_debut: document.getElementsByName('exp_date_debut[]')[i].value,
            date_fin: document.getElementsByName('exp_date_fin[]')[i].value || null,
            description: document.getElementsByName('exp_description[]')[i].value
        });
    }
    formData.append('experiences', JSON.stringify(experiences));
    
    // Collecter les diplômes
    const diplomes = [];
    const dipNoms = document.getElementsByName('dip_nom[]');
    for (let i = 0; i < dipNoms.length; i++) {
        diplomes.push({
            nom_diplome: document.getElementsByName('dip_nom[]')[i].value,
            institut: document.getElementsByName('dip_institut[]')[i].value,
            date_debut: document.getElementsByName('dip_date_debut[]')[i].value,
            date_fin: document.getElementsByName('dip_date_fin[]')[i].value || null,
            description: document.getElementsByName('dip_description[]')[i].value
        });
    }
    formData.append('diplomes', JSON.stringify(diplomes));
    
    // Collecter les certificats
    const certificats = [];
    const certNoms = document.getElementsByName('cert_nom[]');
    for (let i = 0; i < certNoms.length; i++) {
        certificats.push({
            nom_certificat: document.getElementsByName('cert_nom[]')[i].value,
            organisme: document.getElementsByName('cert_organisme[]')[i].value,
            date_obtention: document.getElementsByName('cert_date_obtention[]')[i].value,
            description: document.getElementsByName('cert_description[]')[i].value
        });
    }
    formData.append('certificats', JSON.stringify(certificats));
    
    // Collecter les langues
    const langues = [];
    const langNoms = document.getElementsByName('lang_langue[]');
    for (let i = 0; i < langNoms.length; i++) {
        langues.push({
            langue: document.getElementsByName('lang_langue[]')[i].value,
            niveau: document.getElementsByName('lang_niveau[]')[i].value
        });
    }
    formData.append('langues', JSON.stringify(langues));
    
    // Collecter les loisirs
    const loisirs = [];
    const loisirNoms = document.getElementsByName('loisir_nom[]');
    for (let i = 0; i < loisirNoms.length; i++) {
        loisirs.push({
            nom_loisir: document.getElementsByName('loisir_nom[]')[i].value
        });
    }
    formData.append('loisirs', JSON.stringify(loisirs));
    
    // Récupérer l'ID du CV si c'est une modification
    const cvId = document.getElementById('cvForm').dataset.cvId || null;
    
    // Gérer la photo de profil
    const photoFile = formData.get('photo_profil');
    let photoData = null;
    
    if (photoFile && photoFile.size > 0) {
        // Convertir la photo en base64 pour la stocker temporairement
        const reader = new FileReader();
        reader.onload = function(e) {
            photoData = e.target.result;
            
            // Avec photo
            sessionStorage.setItem('cvData', JSON.stringify({
                cv_id: cvId,
                nom: formData.get('nom'),
                prenom: formData.get('prenom'),
                titre_professionnel: formData.get('titre_professionnel'),
                description_profil: formData.get('description_profil'),
                telephone: formData.get('telephone'),
                email: formData.get('email'),
                photo_profil: photoData,
                experiences: experiences,
                diplomes: diplomes,
                certificats: certificats,
                langues: langues,
                loisirs: loisirs
            }));
            
            // Rediriger vers la page de sélection de template
            window.location.href = 'templates.html';
        };
        reader.readAsDataURL(photoFile);
    } else {
        // Pas de photo
        sessionStorage.setItem('cvData', JSON.stringify({
            cv_id: cvId,
            nom: formData.get('nom'),
            prenom: formData.get('prenom'),
            titre_professionnel: formData.get('titre_professionnel'),
            description_profil: formData.get('description_profil'),
            telephone: formData.get('telephone'),
            email: formData.get('email'),
            photo_profil: null,
            experiences: experiences,
            diplomes: diplomes,
            certificats: certificats,
            langues: langues,
            loisirs: loisirs
        }));
        
        // Rediriger vers la page de sélection de template
        window.location.href = 'templates.html';
    }
});

// Charger les données du CV en mode édition
function loadEditData() {
    const urlParams = new URLSearchParams(window.location.search);
    const isEdit = urlParams.get('edit') === 'true';
    
    if (isEdit) {
        const editData = sessionStorage.getItem('editCvData');
        if (editData) {
            const cv = JSON.parse(editData);
            
            // Remplir les champs de base
            document.querySelector('input[name="nom"]').value = cv.nom || '';
            document.querySelector('input[name="prenom"]').value = cv.prenom || '';
            document.querySelector('input[name="titre_professionnel"]').value = cv.titre_professionnel || '';
            document.querySelector('textarea[name="description_profil"]').value = cv.description_profil || '';
            document.querySelector('input[name="telephone"]').value = cv.telephone || '';
            document.querySelector('input[name="email"]').value = cv.email || '';
            
            // Charger les expériences
            if (cv.experiences && cv.experiences.length > 0) {
                cv.experiences.forEach(exp => {
                    addExperience();
                    const lastExp = document.querySelector(`#experience-${experienceCount}`);
                    lastExp.querySelector('input[name="exp_poste[]"]').value = exp.poste || '';
                    lastExp.querySelector('input[name="exp_entreprise[]"]').value = exp.entreprise || '';
                    lastExp.querySelector('input[name="exp_date_debut[]"]').value = exp.date_debut || '';
                    lastExp.querySelector('input[name="exp_date_fin[]"]').value = exp.date_fin || '';
                    lastExp.querySelector('textarea[name="exp_description[]"]').value = exp.description || '';
                });
            }
            
            // Charger les diplômes
            if (cv.diplomes && cv.diplomes.length > 0) {
                cv.diplomes.forEach(dip => {
                    addDiplome();
                    const lastDip = document.querySelector(`#diplome-${diplomeCount}`);
                    lastDip.querySelector('input[name="dip_nom[]"]').value = dip.nom_diplome || '';
                    lastDip.querySelector('input[name="dip_institut[]"]').value = dip.institut || '';
                    lastDip.querySelector('input[name="dip_date_debut[]"]').value = dip.date_debut || '';
                    lastDip.querySelector('input[name="dip_date_fin[]"]').value = dip.date_fin || '';
                    lastDip.querySelector('textarea[name="dip_description[]"]').value = dip.description || '';
                });
            }
            
            // Charger les certificats
            if (cv.certificats && cv.certificats.length > 0) {
                cv.certificats.forEach(cert => {
                    addCertificat();
                    const lastCert = document.querySelector(`#certificat-${certificatCount}`);
                    lastCert.querySelector('input[name="cert_nom[]"]').value = cert.nom_certificat || '';
                    lastCert.querySelector('input[name="cert_organisme[]"]').value = cert.organisme || '';
                    lastCert.querySelector('input[name="cert_date_obtention[]"]').value = cert.date_obtention || '';
                    lastCert.querySelector('textarea[name="cert_description[]"]').value = cert.description || '';
                });
            }
            
            // Charger les langues
            if (cv.langues && cv.langues.length > 0) {
                cv.langues.forEach(lang => {
                    addLangue();
                    const lastLang = document.querySelector(`#langue-${langueCount}`);
                    lastLang.querySelector('select[name="lang_langue[]"]').value = lang.langue || '';
                    lastLang.querySelector('input[name="lang_niveau[]"]').value = lang.niveau || '';
                });
            }
            
            // Charger les loisirs
            if (cv.loisirs && cv.loisirs.length > 0) {
                cv.loisirs.forEach(loisir => {
                    addLoisir();
                    const lastLoisir = document.querySelector(`#loisir-${loisirCount}`);
                    lastLoisir.querySelector('input[name="loisir_nom[]"]').value = loisir.nom_loisir || '';
                });
            }
            
            // Stocker l'ID du CV pour la mise à jour
            document.getElementById('cvForm').dataset.cvId = cv.cv_id;
        }
    }
}

// Initialiser au chargement
checkAuth();
// Attendre que le DOM soit chargé avant de charger les données d'édition
setTimeout(loadEditData, 100);
