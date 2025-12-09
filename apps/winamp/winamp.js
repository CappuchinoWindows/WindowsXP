// ========== Ventanas arrastrables ==========
$(".error").draggable();

$('body').on('click', '.ok', function(){
    var nuevaVentana = '<div class="error">' + $('.error').html() + '</div>';
    $('body').append(nuevaVentana);

    $('.error').last().css({ 
        top: Math.random() * 200 + 'px',
        left: Math.random() * 200 + 'px'
    }).draggable();
});

// ========== START MENU ==========
$(".start-btn").click(function(){
    $('.start-menu-win').toggleClass('active-menu');
});

// ========== WINAMP VARIABLES ==========
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

// ========== Cargar archivos ==========
audioFileInput.addEventListener('change', function(e) {
    const files = Array.from(e.target.files);

    playlist = files.map((file, index) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        index
    }));

    renderPlaylist();
    if (playlist.length > 0) loadTrack(0);
});

// ========== Cargar carpeta ==========
const folderInput = document.getElementById('audioFolder');

folderInput.addEventListener('change', function(e) {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('audio/'));

    // Mapear a playlist y añadir al final de la playlist existente
    const newTracks = files.map((file, index) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        index: playlist.length + index
    }));

    playlist = playlist.concat(newTracks);

    renderPlaylist();
    if (playlist.length > 0 && audioPlayer.src === "") loadTrack(0);
});


// ========== Render Playlist ==========
function renderPlaylist() {
    playlistItems.innerHTML = "";

    playlist.forEach((track, index) => {
        const item = document.createElement("div");
        item.className = "playlist-item";
        item.textContent = `${index + 1}. ${track.name}`;

        item.onclick = () => {
            loadTrack(index);
            audioPlayer.play();
        };

        playlistItems.appendChild(item);
    });
}

// ========== Cargar pista ==========
function loadTrack(index) {
    currentTrackIndex = index;
    audioPlayer.src = playlist[index].url;
    trackTitle.textContent = playlist[index].name;

    document.querySelectorAll(".playlist-item").forEach((item, i) => {
        item.classList.toggle("active", i === index);
    });
}

// ========== Botones ==========
btnPlay.onclick = () => audioPlayer.play();
btnPause.onclick = () => audioPlayer.pause();
btnStop.onclick = () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
};
btnNext.onclick = () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
};
btnPrev.onclick = () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
};

// ========== Volumen ==========
volumeSlider.oninput = e => {
    audioPlayer.volume = e.target.value / 100;
};

// ========== Progreso ==========
audioPlayer.ontimeupdate = () => {
    if (!audioPlayer.duration) return;

    progressSlider.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;

    let m = Math.floor(audioPlayer.currentTime / 60);
    let s = Math.floor(audioPlayer.currentTime % 60);
    trackTime.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
};

progressSlider.oninput = e => {
    audioPlayer.currentTime = (e.target.value / 100) * audioPlayer.duration;
};

// ========== Auto Next ==========
audioPlayer.onended = () => btnNext.click();

// ========== VISUALIZER ==========
const canvas = document.getElementById('visualizerCanvas');
const ctx = canvas.getContext('2d');

function drawVisualizer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 20; i++) {
        const h = Math.random() * canvas.height;
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(i * 4, canvas.height - h, 3, h);
    }

    if (!audioPlayer.paused) requestAnimationFrame(drawVisualizer);
}

audioPlayer.onplay = () => requestAnimationFrame(drawVisualizer);

