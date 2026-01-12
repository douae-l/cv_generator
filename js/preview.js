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

// Formater les dates
function formatDate(dateString) {
    if (!dateString) return 'Présent';
    const date = new Date(dateString);
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Générer le template Classic Blue
function generateClassicBlue(data) {
    return `
        <div class="cv-classic-blue">
            <div class="sidebar">
                ${data.photo_profil ? `<img src="${data.photo_profil}" alt="Photo" class="profile-photo">` : ''}
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
                ${data.photo_profil ? `<img src="${data.photo_profil}" alt="Photo" class="profile-photo">` : ''}
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

// Générer le template Creative Green
function generateCreativeGreen(data) {
    return `
        <div class="cv-creative-green">
            <div class="sidebar">
                ${data.photo_profil ? `<img src="${data.photo_profil}" alt="Photo" class="profile-photo">` : ''}
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

// Générer le template Professional Purple
function generateProfessionalPurple(data) {
    return `
        <div class="cv-professional-purple">
            <div class="sidebar">
                ${data.photo_profil ? `<img src="${data.photo_profil}" alt="Photo" class="profile-photo">` : ''}
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

// Générer le template Elegant Orange
function generateElegantOrange(data) {
    return generateClassicBlue(data).replace('cv-classic-blue', 'cv-elegant-orange');
}

// Générer le template Modern Red
function generateModernRed(data) {
    return generateClassicBlue(data).replace('cv-classic-blue', 'cv-modern-red');
}

// Charger et afficher le CV
function loadCV() {
    const cvData = sessionStorage.getItem('cvData');
    const template = sessionStorage.getItem('selectedTemplate');
    
    if (!cvData || !template) {
        alert('Erreur: Données manquantes');
        window.location.href = 'formulaire.html';
        return;
    }
    
    const data = JSON.parse(cvData);
    const previewContainer = document.getElementById('cvPreview');
    
    switch(template) {
        case 'classic_blue':
            previewContainer.innerHTML = generateClassicBlue(data);
            break;
        case 'modern_dark':
            previewContainer.innerHTML = generateModernDark(data);
            break;
        case 'creative_green':
            previewContainer.innerHTML = generateCreativeGreen(data);
            break;
        case 'professional_purple':
            previewContainer.innerHTML = generateProfessionalPurple(data);
            break;
        case 'elegant_orange':
            previewContainer.innerHTML = generateElegantOrange(data);
            break;
        case 'modern_red':
            previewContainer.innerHTML = generateModernRed(data);
            break;
        default:
            previewContainer.innerHTML = generateClassicBlue(data);
    }
}

// Sauvegarder le CV
document.getElementById('saveBtn').addEventListener('click', async () => {
    const cvData = sessionStorage.getItem('cvData');
    const template = sessionStorage.getItem('selectedTemplate');
    
    if (!cvData || !template) {
        showAlert('Erreur: Données manquantes', 'error');
        return;
    }
    
    const data = JSON.parse(cvData);
    const formData = new FormData();
    
    formData.append('action', 'save_cv');
    
    // Si c'est une modification, ajouter l'ID du CV
    if (data.cv_id) {
        formData.append('cv_id', data.cv_id);
    }
    
    formData.append('titre_cv', `CV - ${data.nom} ${data.prenom}`);
    formData.append('template', template);
    formData.append('nom', data.nom);
    formData.append('prenom', data.prenom);
    formData.append('titre_professionnel', data.titre_professionnel || '');
    formData.append('description_profil', data.description_profil || '');
    formData.append('telephone', data.telephone);
    formData.append('email', data.email);
    
    // Convertir la photo base64 en fichier si elle existe
    if (data.photo_profil) {
        try {
            const response = await fetch(data.photo_profil);
            const blob = await response.blob();
            formData.append('photo_profil', blob, 'profile.jpg');
        } catch (error) {
            console.error('Erreur lors de la conversion de la photo:', error);
        }
    }
    
    formData.append('experiences', JSON.stringify(data.experiences || []));
    formData.append('diplomes', JSON.stringify(data.diplomes || []));
    formData.append('certificats', JSON.stringify(data.certificats || []));
    formData.append('langues', JSON.stringify(data.langues || []));
    formData.append('loisirs', JSON.stringify(data.loisirs || []));
    
    try {
        const response = await fetch('../php/cv_operations.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('CV sauvegardé avec succès!', 'success');
            sessionStorage.removeItem('cvData');
            sessionStorage.removeItem('selectedTemplate');
            
            setTimeout(() => {
                window.location.href = 'collection.html';
            }, 2000);
        } else {
            showAlert(result.message, 'error');
        }
    } catch (error) {
        showAlert('Erreur lors de la sauvegarde', 'error');
    }
});

// Initialiser
checkAuth();
loadCV();
