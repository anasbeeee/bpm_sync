// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Mise à jour des valeurs des sliders en temps réel
const bpmSlider = document.getElementById('bpm');
const tempSlider = document.getElementById('temperature');
const sweatSlider = document.getElementById('sweat');
const lightSlider = document.getElementById('light');

const bpmValue = document.getElementById('bpm-value');
const tempValue = document.getElementById('temperature-value');
const sweatValue = document.getElementById('sweat-value');
const lightValue = document.getElementById('light-value');

bpmSlider.addEventListener('input', (e) => {
    bpmValue.textContent = e.target.value + ' BPM';
});

tempSlider.addEventListener('input', (e) => {
    tempValue.textContent = parseFloat(e.target.value).toFixed(1) + '°C';
});

sweatSlider.addEventListener('input', (e) => {
    sweatValue.textContent = e.target.value + '%';
});

lightSlider.addEventListener('input', (e) => {
    lightValue.textContent = e.target.value + '%';
});

// Fonction principale de génération de playlist
function generatePlaylist() {
    const bpm = parseInt(bpmSlider.value);
    const temp = parseFloat(tempSlider.value);
    const sweat = parseInt(sweatSlider.value);
    const light = parseInt(lightSlider.value);
    
    // Animation du bouton
    const button = document.querySelector('.generate-button');
    const originalContent = button.innerHTML;
    button.innerHTML = '<span>Analyse en cours...</span> <span>⏳</span>';
    button.style.pointerEvents = 'none';
    
    setTimeout(() => {
        // Calcul de l'intensité physique (0-3)
        const physicalIntensity = calculatePhysicalIntensity(bpm, temp, sweat);
        
        // Détermination du contexte (jour/nuit)
        const isNight = light < 30;
        const isBright = light > 70;
        
        // Sélection du style musical
        const musicStyle = determineMusicStyle(physicalIntensity, isNight, isBright, light);
        
        // Mise à jour de l'affichage
        updateMoodDisplay(musicStyle);
        updateMusicResult(musicStyle);
        updatePlaylist(musicStyle);
        
        // Restaurer le bouton
        button.innerHTML = originalContent;
        button.style.pointerEvents = 'auto';
        
        // Scroll vers les résultats
        document.getElementById('music-result').scrollIntoView({ 
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 1000);
}

// Calcul de l'intensité physique
function calculatePhysicalIntensity(bpm, temp, sweat) {
    // Normalisation des valeurs (0-1)
    const bpmNorm = (bpm - 60) / 120; // 60-180 BPM
    const tempNorm = (temp - 36) / 4; // 36-40°C
    const sweatNorm = sweat / 100;
    
    // Moyenne pondérée (BPM compte plus)
    const intensity = (bpmNorm * 0.5) + (tempNorm * 0.25) + (sweatNorm * 0.25);
    
    // Classification en 4 niveaux
    if (intensity > 0.75) return 3; // Très intense
    if (intensity > 0.5) return 2;  // Intense
    if (intensity > 0.25) return 1; // Modéré
    return 0; // Repos
}

// Détermination du style musical
function determineMusicStyle(intensity, isNight, isBright, light) {
    const styles = {
        // Très haute intensité (sport intense)
        highIntensity: {
            icon: '🔥',
            mood: 'Haute Intensité',
            moodDesc: 'Effort maximal détecté - Besoin de puissance',
            genre: 'EDM / Hard Rock',
            genreIcon: '⚡',
            description: 'Musique énergique et puissante pour performances extrêmes',
            tempo: '140-180 BPM',
            intensity: 'Maximum',
            ambiance: 'Explosive',
            tracks: [
                { icon: '🔥', name: 'Thunderstruck', artist: 'AC/DC' },
                { icon: '⚡', name: 'Till I Collapse', artist: 'Eminem' },
                { icon: '💪', name: 'Eye of the Tiger', artist: 'Survivor' },
                { icon: '🚀', name: 'Lose Yourself', artist: 'Eminem' }
            ]
        },
        
        // Intensité élevée (cardio, running)
        mediumIntensity: {
            icon: '⚡',
            mood: 'Énergie Dynamique',
            moodDesc: 'Activité soutenue - Rythme élevé',
            genre: 'Pop Énergique / Dance',
            genreIcon: '🎵',
            description: 'Rythmes entraînants pour maintenir votre cadence',
            tempo: '120-140 BPM',
            intensity: 'Élevée',
            ambiance: 'Motivante',
            tracks: [
                { icon: '🌟', name: 'Blinding Lights', artist: 'The Weeknd' },
                { icon: '💫', name: 'Levitating', artist: 'Dua Lipa' },
                { icon: '✨', name: 'Don\'t Stop Me Now', artist: 'Queen' },
                { icon: '🎶', name: 'Uptown Funk', artist: 'Bruno Mars' }
            ]
        },
        
        // Intensité modérée (marche rapide, yoga dynamique)
        lowIntensity: {
            icon: '🌟',
            mood: 'Activité Modérée',
            moodDesc: 'En mouvement - Tempo confortable',
            genre: 'Pop / Hip-Hop Chill',
            genreIcon: '🎸',
            description: 'Musique rythmée mais accessible pour activité douce',
            tempo: '100-120 BPM',
            intensity: 'Modérée',
            ambiance: 'Détendue',
            tracks: [
                { icon: '☀️', name: 'Sunflower', artist: 'Post Malone' },
                { icon: '🌊', name: 'Ocean Eyes', artist: 'Billie Eilish' },
                { icon: '🎧', name: 'Circles', artist: 'Post Malone' },
                { icon: '🌈', name: 'Good Days', artist: 'SZA' }
            ]
        },
        
        // Repos nocturne (sommeil, méditation nuit)
        nightRest: {
            icon: '🌙',
            mood: 'Mode Nocturne',
            moodDesc: 'Ambiance sombre - Détente profonde',
            genre: 'Ambient / Lofi Chill',
            genreIcon: '🌌',
            description: 'Sons apaisants et atmosphériques pour la nuit',
            tempo: '60-80 BPM',
            intensity: 'Très Faible',
            ambiance: 'Nocturne',
            tracks: [
                { icon: '🌙', name: 'Weightless', artist: 'Marconi Union' },
                { icon: '⭐', name: 'Moonlight Sonata', artist: 'Beethoven' },
                { icon: '🌌', name: 'Nocturne', artist: 'Chopin' },
                { icon: '✨', name: 'Clair de Lune', artist: 'Debussy' }
            ]
        },
        
        // Repos jour (relaxation, lecture)
        dayRest: {
            icon: '😌',
            mood: 'Détente Diurne',
            moodDesc: 'Repos actif - Calme et sérénité',
            genre: 'Jazz / Acoustic',
            genreIcon: '🎹',
            description: 'Mélodies douces et harmonieuses pour se ressourcer',
            tempo: '80-100 BPM',
            intensity: 'Faible',
            ambiance: 'Relaxante',
            tracks: [
                { icon: '☕', name: 'Autumn Leaves', artist: 'Bill Evans' },
                { icon: '🍃', name: 'River Flows in You', artist: 'Yiruma' },
                { icon: '🌸', name: 'Comptine d\'un autre été', artist: 'Yann Tiersen' },
                { icon: '🎼', name: 'Clair de Lune (Jazz)', artist: 'Ahmad Jamal' }
            ]
        }
    };
    
    // Logique de sélection du style
    if (intensity === 3) {
        return styles.highIntensity;
    } else if (intensity === 2) {
        return styles.mediumIntensity;
    } else if (intensity === 1) {
        return styles.lowIntensity;
    } else {
        // Intensité 0 (repos) - différencier jour/nuit
        if (isNight) {
            return styles.nightRest;
        } else {
            return styles.dayRest;
        }
    }
}

// Mise à jour de l'affichage de l'ambiance
function updateMoodDisplay(style) {
    document.getElementById('mood-icon').textContent = style.icon;
    document.getElementById('mood-title').textContent = style.mood;
    document.getElementById('mood-description').textContent = style.moodDesc;
}

// Mise à jour des résultats musicaux
function updateMusicResult(style) {
    // Genre
    document.getElementById('genre-display').querySelector('.genre-icon').textContent = style.genreIcon;
    document.getElementById('genre-name').textContent = style.genre;
    document.getElementById('genre-description').textContent = style.description;
    
    // Stats
    document.getElementById('tempo-value').textContent = style.tempo;
    document.getElementById('intensity-value').textContent = style.intensity;
    document.getElementById('ambiance-value').textContent = style.ambiance;
}

// Mise à jour de la playlist
function updatePlaylist(style) {
    const playlistContainer = document.getElementById('playlist-items');
    playlistContainer.innerHTML = '';
    
    style.tracks.forEach((track, index) => {
        setTimeout(() => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            item.innerHTML = `
                <div class="track-icon">${track.icon}</div>
                <div class="track-info">
                    <div class="track-name">${track.name}</div>
                    <div class="track-artist">${track.artist}</div>
                </div>
            `;
            
            playlistContainer.appendChild(item);
            
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 50);
        }, index * 100);
    });
}

// Animation du visualiseur audio
function animateVisualizer() {
    const bars = document.querySelectorAll('.visualizer .bar');
    
    setInterval(() => {
        bars.forEach(bar => {
            const randomHeight = Math.random() * 100 + 40;
            bar.style.height = randomHeight + '%';
        });
    }, 300);
}

// Lancer l'animation du visualiseur au chargement
window.addEventListener('load', animateVisualizer);

// Gestion des modals
function openModal(plan) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const text = document.getElementById('modal-text');
    
    const plans = {
        'free': {
            title: '🎉 Version Gratuite',
            text: 'Parfait pour commencer ! Téléchargez l\'application et découvrez la synchronisation musicale biométrique dès maintenant.'
        },
        'premium': {
            title: '⭐ Premium',
            text: 'Débloquez toutes les fonctionnalités avancées et profitez d\'une expérience musicale optimale avec des playlists IA personnalisées !'
        },
        'pro': {
            title: '🏆 Pro',
            text: 'L\'offre ultime pour les professionnels et athlètes exigeants. Coaching musical personnalisé et analyses en temps réel.'
        }
    };
    
    title.textContent = plans[plan].title;
    text.textContent = plans[plan].text;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Fermer modal en cliquant à l'extérieur
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Fermer modal avec Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Gestion du formulaire de contact
function handleSubmit(e) {
    e.preventDefault();
    
    const button = e.target.querySelector('.submit-button');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<span>✓ Message Envoyé !</span>';
    button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        e.target.reset();
    }, 3000);
}

// Animation des éléments au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer tous les éléments qui doivent s'animer
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});