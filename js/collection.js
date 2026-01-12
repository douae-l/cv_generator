// Variables globales
let currentCvId = null;
let currentCvData = null;

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

// Afficher un message
function showAlert(message, type = 'error') {
    const alert = document.getElementById('alertMessage');
    alert.textContent = message;
    alert.className = `alert alert-${type} show`;
    
    setTimeout(() => {
        alert.className = 'alert';
    }, 5000);
}

// Formater les dates
function formatDate(dateString) {
    if (!dateString) return 'Présent';
    const date = new Date(dateString);
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Obtenir le nom du template
function getTemplateName(template) {
    const names = {
        'classic_blue': 'Classic Blue',
        'modern_dark': 'Modern Dark',
        'creative_green': 'Creative Green',
        'professional_purple': 'Professional Purple',
        'elegant_orange': 'Elegant Orange',
        'modern_red': 'Modern Red'
    };
    return names[template] || template;
}

// Charger tous les CVs
async function loadCVs() {
    try {
        const response = await fetch('../php/cv_operations.php?action=get_cvs');
        const data = await response.json();
        
        if (data.success) {
            if (data.cvs.length === 0) {
                document.querySelector('.table-container').classList.add('hidden');
                document.getElementById('noCvs').classList.remove('hidden');
            } else {
                displayCVs(data.cvs);
            }
        } else {
            showAlert('Erreur lors du chargement des CVs', 'error');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur', 'error');
    }
}

// Afficher les CVs dans le tableau
function displayCVs(cvs) {
    const tbody = document.getElementById('cvsTableBody');
    tbody.innerHTML = '';
    
    cvs.forEach(cv => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cv.nom}</td>
            <td>${cv.prenom}</td>
            <td>${cv.titre_cv}</td>
            <td>
                <span class="template-badge ${cv.template}">
                    ${getTemplateName(cv.template)}
                </span>
            </td>
            <td>${new Date(cv.date_creation).toLocaleDateString('fr-FR')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-info btn-small" onclick="viewCV(${cv.id})" title="Voir">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Voir
                    </button>
                    <button class="btn btn-warning btn-small" onclick="editCV(${cv.id})" title="Modifier">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Modifier
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteCV(${cv.id})" title="Supprimer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Supprimer
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Voir un CV
async function viewCV(cvId) {
    try {
        const response = await fetch(`../php/cv_operations.php?action=get_cv&cv_id=${cvId}`);
        const data = await response.json();
        
        if (data.success) {
            currentCvId = cvId;
            currentCvData = data.cv;
            displayCVInModal(data.cv);
        } else {
            showAlert('Erreur lors du chargement du CV', 'error');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur', 'error');
    }
}

// Afficher le CV dans le modal
function displayCVInModal(cv) {
    const modal = document.getElementById('cvModal');
    const preview = document.getElementById('modalCvPreview');
    
    // Générer le HTML du CV selon le template
    let cvHTML = '';
    
    switch(cv.template) {
        case 'classic_blue':
            cvHTML = generateClassicBlue(cv);
            break;
        case 'modern_dark':
            cvHTML = generateModernDark(cv);
            break;
        case 'creative_green':
            cvHTML = generateCreativeGreen(cv);
            break;
        case 'professional_purple':
            cvHTML = generateProfessionalPurple(cv);
            break;
        case 'elegant_orange':
            cvHTML = generateElegantOrange(cv);
            break;
        case 'modern_red':
            cvHTML = generateModernRed(cv);
            break;
        default:
            cvHTML = generateClassicBlue(cv);
    }
    
    preview.innerHTML = cvHTML;
    modal.classList.remove('hidden');
}

// Générer le template Classic Blue
function generateClassicBlue(data) {
    return `
        <div class="cv-classic-blue">
            <div class="sidebar">
                ${data.photo_profil ? `<img src="../${data.photo_profil}" alt="Photo" class="profile-photo">` : ''}
                <h1>${data.prenom} ${data.nom}</h1>
                ${data.titre_professionnel ? `<div class="title">${data.titre_professionnel}</div>` : ''}
                
                <section>
                    <h2>Contact</h2>
                    ${data.telephone ? `<div class="contact-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        ${data.telephone}
                    </div>` : ''}
                    ${data.email ? `<div class="contact-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        ${data.email}
                    </div>` : ''}
                </section>
                
                ${data.langues && data.langues.length > 0 ? `
                <section>
                    <h2>Langues</h2>
                    ${data.langues.map(l => `
                        <div class="language-item">
                            <div class="language-name">${l.langue}</div>
                            <div class="language-bar">
                                <div class="language-progress" style="width: ${l.niveau}%"></div>
                            </div>
                            <div class="language-percent">${l.niveau}%</div>
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${data.loisirs && data.loisirs.length > 0 ? `
                <section>
                    <h2>Loisirs</h2>
                    ${data.loisirs.map(l => `
                        <div class="hobby-item">
                            ${l.nom_loisir}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
            </div>
            
            <div class="main-content">
                ${data.description_profil ? `
                <section>
                    <h2>Profil</h2>
                    <p>${data.description_profil}</p>
                </section>
                ` : ''}
                
                ${data.experiences && data.experiences.length > 0 ? `
                <section>
                    <h2>Expériences Professionnelles</h2>
                    ${data.experiences.map(exp => `
                        <div class="experience-item">
                            <div class="item-title">${exp.nom_poste}</div>
                            <div class="item-subtitle">${exp.entreprise}</div>
                            <div class="item-date">${formatDate(exp.date_debut)} - ${formatDate(exp.date_fin)}</div>
                            ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${data.diplomes && data.diplomes.length > 0 ? `
                <section>
                    <h2>Formation</h2>
                    ${data.diplomes.map(dip => `
                        <div class="education-item">
                            <div class="item-title">${dip.nom_diplome}</div>
                            <div class="item-subtitle">${dip.institut}</div>
                            <div class="item-date">${formatDate(dip.date_debut)} - ${formatDate(dip.date_fin)}</div>
                            ${dip.description ? `<div class="item-description">${dip.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${data.certificats && data.certificats.length > 0 ? `
                <section>
                    <h2>Certificats</h2>
                    ${data.certificats.map(cert => `
                        <div class="certificate-item">
                            <div class="item-title">${cert.nom_certificat}</div>
                            <div class="item-subtitle">${cert.organisme}</div>
                            <div class="item-date">${formatDate(cert.date_obtention)}</div>
                            ${cert.description ? `<div class="item-description">${cert.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
            </div>
        </div>
    `;
}

// Générer le template Modern Dark
function generateModernDark(data) {
    return `
        <div class="cv-modern-dark">
            <div class="sidebar">
                ${data.photo_profil ? `<img src="../${data.photo_profil}" alt="Photo" class="profile-photo">` : ''}
                <h1>${data.prenom} ${data.nom}</h1>
                ${data.titre_professionnel ? `<div class="title">${data.titre_professionnel}</div>` : ''}
                
                <section>
                    <h2>Contact</h2>
                    ${data.telephone ? `<div class="contact-item">📞 ${data.telephone}</div>` : ''}
                    ${data.email ? `<div class="contact-item">✉️ ${data.email}</div>` : ''}
                </section>
                
                ${data.langues && data.langues.length > 0 ? `
                <section>
                    <h2>Langues</h2>
                    ${data.langues.map(l => `<div class="language-item">• ${l.langue} - ${l.niveau}</div>`).join('')}
                </section>
                ` : ''}
                
                ${data.loisirs && data.loisirs.length > 0 ? `
                <section>
                    <h2>Loisirs</h2>
                    ${data.loisirs.map(l => `<div class="hobby-item">• ${l.nom_loisir}</div>`).join('')}
                </section>
                ` : ''}
            </div>
            
            <div class="main-content">
                ${data.description_profil ? `
                <section>
                    <h2>Profil</h2>
                    <p>${data.description_profil}</p>
                </section>
                ` : ''}
                
                ${data.experiences && data.experiences.length > 0 ? `
                <section>
                    <h2>Expériences Professionnelles</h2>
                    ${data.experiences.map(exp => `
                        <div class="experience-item">
                            <div class="item-title">${exp.nom_poste}</div>
                            <div class="item-subtitle">${exp.entreprise}</div>
                            <div class="item-date">${formatDate(exp.date_debut)} - ${formatDate(exp.date_fin)}</div>
                            ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${data.diplomes && data.diplomes.length > 0 ? `
                <section>
                    <h2>Formation</h2>
                    ${data.diplomes.map(dip => `
                        <div class="education-item">
                            <div class="item-title">${dip.nom_diplome}</div>
                            <div class="item-subtitle">${dip.institut}</div>
                            <div class="item-date">${formatDate(dip.date_debut)} - ${formatDate(dip.date_fin)}</div>
                            ${dip.description ? `<div class="item-description">${dip.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${data.certificats && data.certificats.length > 0 ? `
                <section>
                    <h2>Certificats</h2>
                    ${data.certificats.map(cert => `
                        <div class="certificate-item">
                            <div class="item-title">${cert.nom_certificat}</div>
                            <div class="item-subtitle">${cert.organisme}</div>
                            <div class="item-date">${formatDate(cert.date_obtention)}</div>
                            ${cert.description ? `<div class="item-description">${cert.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
            </div>
        </div>
    `;
}

// Générer le template Creative Green
function generateCreativeGreen(data) {
    return `
        <div class="cv-creative-green">
            <div class="sidebar">
                ${data.photo_profil ? `<img src="../${data.photo_profil}" alt="Photo" class="profile-photo">` : ''}
                <h1>${data.prenom} ${data.nom}</h1>
                ${data.titre_professionnel ? `<div class="title">${data.titre_professionnel}</div>` : ''}
                
                <section>
                    <h2>Contact</h2>
                    ${data.telephone ? `<div class="contact-item">📞 ${data.telephone}</div>` : ''}
                    ${data.email ? `<div class="contact-item">✉️ ${data.email}</div>` : ''}
                </section>
                
                ${data.langues && data.langues.length > 0 ? `
                <section>
                    <h2>Langues</h2>
                    ${data.langues.map(l => `<div class="language-item">• ${l.langue} - ${l.niveau}</div>`).join('')}
                </section>
                ` : ''}
                
                ${data.loisirs && data.loisirs.length > 0 ? `
                <section>
                    <h2>Loisirs</h2>
                    ${data.loisirs.map(l => `<div class="hobby-item">• ${l.nom_loisir}</div>`).join('')}
                </section>
                ` : ''}
            </div>
            
            <div class="main-content">
                ${data.description_profil ? `
                <section>
                    <h2>Profil</h2>
                    <p>${data.description_profil}</p>
                </section>
                ` : ''}
                
                ${data.experiences && data.experiences.length > 0 ? `
                <section>
                    <h2>Expériences Professionnelles</h2>
                    ${data.experiences.map(exp => `
                        <div class="experience-item">
                            <div class="item-title">${exp.nom_poste}</div>
                            <div class="item-subtitle">${exp.entreprise}</div>
                            <div class="item-date">${formatDate(exp.date_debut)} - ${formatDate(exp.date_fin)}</div>
                            ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${data.diplomes && data.diplomes.length > 0 ? `
                <section>
                    <h2>Formation</h2>
                    ${data.diplomes.map(dip => `
                        <div class="education-item">
                            <div class="item-title">${dip.nom_diplome}</div>
                            <div class="item-subtitle">${dip.institut}</div>
                            <div class="item-date">${formatDate(dip.date_debut)} - ${formatDate(dip.date_fin)}</div>
                            ${dip.description ? `<div class="item-description">${dip.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${data.certificats && data.certificats.length > 0 ? `
                <section>
                    <h2>Certificats</h2>
                    ${data.certificats.map(cert => `
                        <div class="certificate-item">
                            <div class="item-title">${cert.nom_certificat}</div>
                            <div class="item-subtitle">${cert.organisme}</div>
                            <div class="item-date">${formatDate(cert.date_obtention)}</div>
                            ${cert.description ? `<div class="item-description">${cert.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
            </div>
        </div>
    `;
}

// Générer le template Professional Purple
function generateProfessionalPurple(data) {
    return `
        <div class="cv-professional-purple">
            <div class="sidebar">
                ${data.photo_profil ? `<img src="../${data.photo_profil}" alt="Photo" class="profile-photo">` : ''}
                <h1>${data.prenom} ${data.nom}</h1>
                ${data.titre_professionnel ? `<div class="title">${data.titre_professionnel}</div>` : ''}
                
                <section>
                    <h2>Contact</h2>
                    ${data.telephone ? `<div class="contact-item">📞 ${data.telephone}</div>` : ''}
                    ${data.email ? `<div class="contact-item">✉️ ${data.email}</div>` : ''}
                </section>
                
                ${data.langues && data.langues.length > 0 ? `
                <section>
                    <h2>Langues</h2>
                    ${data.langues.map(l => `<div class="language-item">• ${l.langue} - ${l.niveau}</div>`).join('')}
                </section>
                ` : ''}
                
                ${data.loisirs && data.loisirs.length > 0 ? `
                <section>
                    <h2>Loisirs</h2>
                    ${data.loisirs.map(l => `<div class="hobby-item">• ${l.nom_loisir}</div>`).join('')}
                </section>
                ` : ''}
            </div>
            
            <div class="main-content">
                ${data.description_profil ? `
                <section>
                    <h2>Profil</h2>
                    <p>${data.description_profil}</p>
                </section>
                ` : ''}
                
                ${data.experiences && data.experiences.length > 0 ? `
                <section>
                    <h2>Expériences Professionnelles</h2>
                    ${data.experiences.map(exp => `
                        <div class="experience-item">
                            <div class="item-title">${exp.nom_poste}</div>
                            <div class="item-subtitle">${exp.entreprise}</div>
                            <div class="item-date">${formatDate(exp.date_debut)} - ${formatDate(exp.date_fin)}</div>
                            ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${data.diplomes && data.diplomes.length > 0 ? `
                <section>
                    <h2>Formation</h2>
                    ${data.diplomes.map(dip => `
                        <div class="education-item">
                            <div class="item-title">${dip.nom_diplome}</div>
                            <div class="item-subtitle">${dip.institut}</div>
                            <div class="item-date">${formatDate(dip.date_debut)} - ${formatDate(dip.date_fin)}</div>
                            ${dip.description ? `<div class="item-description">${dip.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${data.certificats && data.certificats.length > 0 ? `
                <section>
                    <h2>Certificats</h2>
                    ${data.certificats.map(cert => `
                        <div class="certificate-item">
                            <div class="item-title">${cert.nom_certificat}</div>
                            <div class="item-subtitle">${cert.organisme}</div>
                            <div class="item-date">${formatDate(cert.date_obtention)}</div>
                            ${cert.description ? `<div class="item-description">${cert.description}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
            </div>
        </div>
    `;
}

// Fermer le modal
function closeModal() {
    document.getElementById('cvModal').classList.add('hidden');
    currentCvId = null;
    currentCvData = null;
}

// Imprimer le CV
function printCV() {
    const cvElement = document.getElementById('modalCvPreview');
    const printContent = cvElement.innerHTML;
    
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '', 'width=900,height=1200');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CV - Impression</title>
            <link rel="stylesheet" href="../css/cv-templates.css">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                }
                
                /* Styles pour l'impression */
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    
                    .cv-template,
                    [class*="cv-"] {
                        box-shadow: none !important;
                        margin: 0 !important;
                        page-break-inside: avoid;
                    }
                }
                
                /* Styles pour l'écran avant impression */
                @media screen {
                    body {
                        padding: 20px;
                        background: #f5f5f5;
                    }
                }
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Attendre que les styles et images soient chargés avant d'imprimer
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            // Ne pas fermer automatiquement pour permettre à l'utilisateur de voir le résultat
        }, 800);
    };
}

// Télécharger en PDF
async function downloadPDF() {
    const cvElement = document.getElementById('modalCvPreview');
    const cvName = currentCvData ? `CV_${currentCvData.prenom}_${currentCvData.nom}` : 'CV';
    
    const options = {
        margin: 0,
        filename: `${cvName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {
        await html2pdf().set(options).from(cvElement).save();
        showAlert('CV téléchargé avec succès!', 'success');
    } catch (error) {
        showAlert('Erreur lors du téléchargement du PDF', 'error');
        console.error('Erreur PDF:', error);
    }
}

// Modifier un CV
async function editCV(cvId) {
    try {
        const response = await fetch(`../php/cv_operations.php?action=get_cv&cv_id=${cvId}`);
        const result = await response.json();
        
        if (result.success) {
            const cv = result.cv;
            
            // Stocker les données du CV dans sessionStorage pour le formulaire
            const cvData = {
                cv_id: cv.id,
                nom: cv.nom,
                prenom: cv.prenom,
                titre_professionnel: cv.titre_professionnel,
                description_profil: cv.description_profil,
                telephone: cv.telephone,
                email: cv.email,
                photo_profil: cv.photo_profil,
                experiences: cv.experiences || [],
                diplomes: cv.diplomes || [],
                certificats: cv.certificats || [],
                langues: cv.langues || [],
                loisirs: cv.loisirs || []
            };
            
            sessionStorage.setItem('editCvData', JSON.stringify(cvData));
            sessionStorage.setItem('selectedTemplate', cv.template);
            
            // Rediriger vers le formulaire
            window.location.href = 'formulaire.html?edit=true';
        } else {
            showAlert('Erreur lors du chargement du CV', 'error');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur', 'error');
    }
}

// Générer les templates Orange et Red
function generateElegantOrange(data) {
    return generateClassicBlue(data).replace('cv-classic-blue', 'cv-elegant-orange');
}

function generateModernRed(data) {
    return generateClassicBlue(data).replace('cv-classic-blue', 'cv-modern-red');
}

// Générer le template Modern Dark
function generateModernDark(data) {
    return generateClassicBlue(data).replace('cv-classic-blue', 'cv-modern-dark');
}

function generateCreativeGreen(data) {
    return generateClassicBlue(data).replace('cv-classic-blue', 'cv-creative-green');
}

// Supprimer un CV
async function deleteCV(cvId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'delete_cv');
    formData.append('cv_id', cvId);
    
    try {
        const response = await fetch('../php/cv_operations.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('CV supprimé avec succès', 'success');
            loadCVs();
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        showAlert('Erreur lors de la suppression', 'error');
    }
}

// Fermer le modal en cliquant en dehors
document.getElementById('cvModal').addEventListener('click', (e) => {
    if (e.target.id === 'cvModal') {
        closeModal();
    }
});

// Initialiser
checkAuth();
loadCVs();
