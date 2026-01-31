function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

function searchLol(e) {
    e.preventDefault();
    const name = document.getElementById('lolName').value.trim();
    const region = document.getElementById('lolRegion').value;
    const alertEl = document.getElementById('lolAlert');
    
    if (!name) {
        showAlert(alertEl, 'error', 'Por favor, digite o nome do invocador.');
        return;
    }
    
    showAlert(alertEl, 'info', '⏳ Buscando perfil...');
    
    setTimeout(() => {
        window.location.href = `pages/lol.html?summoner=${encodeURIComponent(name)}&region=${region}`;
    }, 500);
}

function searchValorant(e) {
    e.preventDefault();
    const riotId = document.getElementById('valorantRiotId').value.trim();
    const region = document.getElementById('valorantRegion').value;
    const alertEl = document.getElementById('valorantAlert');
    
    if (!riotId.includes('#')) {
        showAlert(alertEl, 'error', 'Por favor, use o formato Nome#Tag.');
        return;
    }
    
    const [name, tag] = riotId.split('#');
    
    if (!name || !tag) {
        showAlert(alertEl, 'error', 'Por favor, preencha o Riot ID corretamente.');
        return;
    }
    
    showAlert(alertEl, 'info', '⏳ Buscando jogador...');
    
    setTimeout(() => {
        window.location.href = `pages/valorant.html?player=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}&region=${region}`;
    }, 500);
}

function showAlert(element, type, message) {
    if (!element) return;
    element.textContent = message;
    element.className = `alert alert-${type}`;
    element.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const lolForm = document.getElementById('lolForm');
    const valorantForm = document.getElementById('valorantForm');
    
    if (lolForm) lolForm.addEventListener('submit', searchLol);
    if (valorantForm) valorantForm.addEventListener('submit', searchValorant);
});
