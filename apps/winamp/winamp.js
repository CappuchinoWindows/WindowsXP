// Hacer ventanas arrastrables
$(".error").draggable();

// Animación al crear nuevas ventanas
$('body').on('click', '.ok', function(){
    var nuevaVentana = '<div class="error">' + $('.error').html() + '</div>';
    $('body').append(nuevaVentana);
    $('.error').last().css({ 
        top: y + 'px', 
        left: x + 'px'
    }).draggable();
});

// Toggle del menú Start
$(".start-btn").click(function(){
    $('.start-menu-win').toggleClass('active-menu');
});

const audioPlayer = document.getElementById('audioPlayer');
const btnPlay = document.getElementById('btnPlay');
const btnPause = document.getElementById('btnPause');
const btnStop = document.getElementById('btnStop');
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const volumeSlider = document.getElementById('volume');
const balanceSlider = document.getElementById('balance');
const progressSlider = document.getElementById('progress');
const trackTitle = document.getElementById('trackTitle');
const trackTime = document.getElementById('trackTime');
const audioFileInput = document.getElementById('audioFile');
const playlistItems = document.getElementById('playlistItems');

let playlist = [];
let currentTrackIndex = 0;

// Cargar archivos de audio
audioFileInput.addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    playlist = files.map((file, index) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        index: index
    }));

    renderPlaylist();
    if (playlist.length > 0) {
        loadTrack(0);
        audioPlayer.load(); // Asegura que el audio se cargue
    }
});

// Renderizar playlist
function renderPlaylist() {
    playlistItems.innerHTML = '';
    playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.textContent = `${index + 1}. ${track.name}`;
        item.onclick = () => loadTrack(index);
        playlistItems.appendChild(item);
    });
}

// Cargar pista
function loadTrack(index) {
    if (playlist.length === 0) return;

    currentTrackIndex = index;
    audioPlayer.src = playlist[index].url;
    trackTitle.textContent = playlist[index].name;
    audioPlayer.load(); // Cargar el nuevo audio

    // Marcar pista activa en playlist
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// Controles de reproducción - MEJORADOS
btnPlay.addEventListener('click', () => {
    // Verificar que hay canciones cargadas
    if (playlist.length === 0) {
        alert('Por favor carga archivos de audio primero');
        return;
    }

    // Verificar que hay una fuente de audio
    if (!audioPlayer.src) {
        loadTrack(0);
    }

    // Reproducir con manejo de promesas
    const playPromise = audioPlayer.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Reproduciendo audio correctamente');
            })
            .catch(error => {
                console.error('Error al reproducir:', error);
                alert('No se pudo reproducir el audio. Intenta de nuevo.');
            });
    }
});

btnPause.addEventListener('click', () => {
    audioPlayer.pause();
});

btnStop.addEventListener('click', () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    progressSlider.value = 0;
});

btnNext.addEventListener('click', () => {
    if (playlist.length === 0) return;

    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);

    // Auto reproducir siguiente
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => console.error('Error al reproducir siguiente:', error));
    }
});

btnPrev.addEventListener('click', () => {
    if (playlist.length === 0) return;

    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);

    // Auto reproducir anterior
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => console.error('Error al reproducir anterior:', error));
    }
});

// Control de volumen
volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
});

// Control de balance (usando Web Audio API si es necesario)
balanceSlider.addEventListener('input', (e) => {
    // El balance básico no está soportado directamente en HTML5 Audio
    // Para implementarlo completamente necesitarías Web Audio API
    console.log('Balance:', e.target.value);
});

// Actualizar progreso
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressSlider.value = progress || 0;

        const minutes = Math.floor(audioPlayer.currentTime / 60);
        const seconds = Math.floor(audioPlayer.currentTime % 60);
        trackTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
});

// Buscar en la pista
progressSlider.addEventListener('input', (e) => {
    if (audioPlayer.duration) {
        const time = (e.target.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = time;
    }
});

// Evitar que el slider se mueva mientras el usuario lo arrastra
progressSlider.addEventListener('mousedown', () => {
    audioPlayer.removeEventListener('timeupdate', updateProgress);
});

progressSlider.addEventListener('mouseup', () => {
    audioPlayer.addEventListener('timeupdate', updateProgress);
});

function updateProgress() {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressSlider.value = progress || 0;
    }
}

// Auto-siguiente cuando termina la pista
audioPlayer.addEventListener('ended', () => {
    if (playlist.length > 0) {
        btnNext.click();
    }
});

// Visualizador simple
const canvas = document.getElementById('visualizerCanvas');
const ctx = canvas.getContext('2d');
let animationId;

function drawVisualizer() {
    const bars = 20;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height * (audioPlayer.paused ? 0.3 : 1);
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(i * 4, canvas.height - height, 3, height);
    }

    if (!audioPlayer.paused) {
        animationId = requestAnimationFrame(drawVisualizer);
    }
}

audioPlayer.addEventListener('play', () => {
    drawVisualizer();
});

audioPlayer.addEventListener('pause', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// Ecualizador (funcionalidad básica)
const eqBands = document.querySelectorAll('.eq-band input');
eqBands.forEach(band => {
    band.addEventListener('input', (e) => {
        console.log('EQ Band:', e.target.nextElementSibling.textContent, 'Value:', e.target.value);
        // Aquí podrías implementar filtros de audio con Web Audio API
    });
});

// Inicialización
console.log('Winamp Player inicializado correctamente');
