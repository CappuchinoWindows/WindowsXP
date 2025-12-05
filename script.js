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
    
    // Marcar pista activa en playlist
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// Controles de reproducción
btnPlay.addEventListener('click', () => {
    audioPlayer.play();
});

btnPause.addEventListener('click', () => {
    audioPlayer.pause();
});

btnStop.addEventListener('click', () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
});

btnNext.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
});

btnPrev.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
});

// Control de volumen
volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
});

// Actualizar progreso
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressSlider.value = progress || 0;
    
    const minutes = Math.floor(audioPlayer.currentTime / 60);
    const seconds = Math.floor(audioPlayer.currentTime % 60);
    trackTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Buscar en la pista
progressSlider.addEventListener('input', (e) => {
    const time = (e.target.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = time;
});

// Auto-siguiente cuando termina la pista
audioPlayer.addEventListener('ended', () => {
    btnNext.click();
});

// Visualizador simple
const canvas = document.getElementById('visualizerCanvas');
const ctx = canvas.getContext('2d');

function drawVisualizer() {
    const bars = 20;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height;
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(i * 4, canvas.height - height, 3, height);
    }
    
    if (!audioPlayer.paused) {
        requestAnimationFrame(drawVisualizer);
    }
}

audioPlayer.addEventListener('play', drawVisualizer);
