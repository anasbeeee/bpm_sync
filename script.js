// ===== Scroll smooth quand on clique sur un lien interne =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const cible = document.querySelector(this.getAttribute('href'));

        if (cible) {
            cible.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


// ===== Récup sliders =====
const bpmSlider = document.getElementById('bpm');
const tempSlider = document.getElementById('temperature');
const sweatSlider = document.getElementById('sweat');
const lightSlider = document.getElementById('light');

// ===== Récup affichage valeurs =====
const bpmValue = document.getElementById('bpm-value');
const tempValue = document.getElementById('temperature-value');
const sweatValue = document.getElementById('sweat-value');
const lightValue = document.getElementById('light-value');


// ===== Update affichage sliders en live =====
bpmSlider.addEventListener('input', e => {
    bpmValue.textContent = e.target.value + ' BPM';
});

tempSlider.addEventListener('input', e => {
    tempValue.textContent = parseFloat(e.target.value).toFixed(1) + '°C';
});

sweatSlider.addEventListener('input', e => {
    sweatValue.textContent = e.target.value + '%';
});

lightSlider.addEventListener('input', e => {
    lightValue.textContent = e.target.value + '%';
});


// ===== Génération playlist =====
function generatePlaylist() {

    const bpm = parseInt(bpmSlider.value);
    const temp = parseFloat(tempSlider.value);
    const sweat = parseInt(sweatSlider.value);
    const light = parseInt(lightSlider.value);

    // Animation bouton
    const bouton = document.querySelector('.generate-button');
    const texteOriginal = bouton.innerHTML;

    bouton.innerHTML = '<span>Analyse en cours...</span> <span>⏳</span>';
    bouton.style.pointerEvents = 'none';

    setTimeout(() => {

        const intensite = calculatePhysicalIntensity(bpm, temp, sweat);

        const nuit = light < 30;
        const pleinJour = light > 70;

        const style = determineMusicStyle(intensite, nuit, pleinJour, light);

        updateMoodDisplay(style);
        updateMusicResult(style);
        updatePlaylist(style);

        bouton.innerHTML = texteOriginal;
        bouton.style.pointerEvents = 'auto';

        document.getElementById('music-result').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });

    }, 1000);
}


// ===== Calcul intensité physique =====
function calculatePhysicalIntensity(bpm, temp, sweat) {

    const bpmNorm = (bpm - 60) / 120;
    const tempNorm = (temp - 36) / 4;
    const sweatNorm = sweat / 100;

    const intensite = (bpmNorm * 0.5) + (tempNorm * 0.25) + (sweatNorm * 0.25);

    if (intensite > 0.75) return 3;
    if (intensite > 0.5) return 2;
    if (intensite > 0.25) return 1;

    return 0;
}


// ===== Styles musicaux =====
function determineMusicStyle(intensity, isNight, isBright, light) {

    const styles = {

        highIntensity: {
            icon: '🔥',
            mood: 'Haute Intensité',
            moodDesc: 'Effort maximal détecté - Besoin de puissance',
            genre: 'EDM / Hard Rock',
            genreIcon: '⚡',
            description: 'Musique énergique et puissante pour performances',
            tempo: '140-180 BPM',
            intensity: 'Maximum',
            ambiance: 'Explosive',
            tracks: [
                { icon: '🔥', name: 'Paranoid', artist: '  Black Sabbath' },
                { icon: '⚡', name: 'Hells bellsllapse', artist: 'AC/DC' },
                { icon: '💪', name: 'Iron man', artist: 'Black Sabbath' },
                { icon: '🚀', name: 'Prozaczopixan', artist: 'Vald' }
            ]
        },

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
                { icon: '🌟', name: 'Billie Jean', artist: ' Micheal Jackson' },
                { icon: '💫', name: 'Fortnite', artist: 'Kerian' },
                { icon: '✨', name: 'IDOL', artist: 'YOASOBI' },
                { icon: '🎶', name: 'Finesse ', artist: 'Bruno Mars' }
            ]
        },

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
                { icon: '🌙', name: 'Milgram', artist: "L'homme du fond" },
                { icon: '⭐', name: 'Moonlight Sonata', artist: 'Beethoven' },
                { icon: '🌌', name: 'Nocturne', artist: 'Chopin' },
                { icon: '✨', name: 'Clair de Lune', artist: 'Debussy' }
            ]
        },

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

    if (intensity === 3) return styles.highIntensity;
    if (intensity === 2) return styles.mediumIntensity;
    if (intensity === 1) return styles.lowIntensity;

    return isNight ? styles.nightRest : styles.dayRest;
}


// ===== Update affichage =====
function updateMoodDisplay(style) {
    document.getElementById('mood-icon').textContent = style.icon;
    document.getElementById('mood-title').textContent = style.mood;
    document.getElementById('mood-description').textContent = style.moodDesc;
}

function updateMusicResult(style) {

    document.querySelector('#genre-display .genre-icon').textContent = style.genreIcon;
    document.getElementById('genre-name').textContent = style.genre;
    document.getElementById('genre-description').textContent = style.description;

    document.getElementById('tempo-value').textContent = style.tempo;
    document.getElementById('intensity-value').textContent = style.intensity;
    document.getElementById('ambiance-value').textContent = style.ambiance;
}


// ===== Update playlist =====
function updatePlaylist(style) {

    const conteneur = document.getElementById('playlist-items');
    conteneur.innerHTML = '';

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

            conteneur.appendChild(item);

            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 50);

        }, index * 100);
    });
}


// ===== Visualizer audio =====
function animateVisualizer() {

    const bars = document.querySelectorAll('.visualizer .bar');
    let phase = 0;

    function animate() {

        bars.forEach((bar, index) => {

            const height = 60 + Math.sin(phase + index * 0.5) * 40;
            bar.style.height = height + "%";

        });

        phase += 0.05    ;
        requestAnimationFrame(animate);
    }

    animate();
}

window.addEventListener('load', animateVisualizer);


// ===== Animations scroll =====
const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });

}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });


document.addEventListener('DOMContentLoaded', () => {

    const elements = document.querySelectorAll('.feature-card');

    elements.forEach(el => {

        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';

        observer.observe(el);
    });

});
