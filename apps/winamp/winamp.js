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

<<<<<<< HEAD
// ========== WINAMP VARIABLES ==========
=======
// DEBUGGING: Verificar que los elementos existen
console.log('=== VERIFICANDO ELEMENTOS ===');
>>>>>>> 5d653e01765dc18d2f1f371df6a31ef0dd784408
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

console.log('audioPlayer:', audioPlayer);
console.log('btnPlay:', btnPlay);
console.log('audioFileInput:', audioFileInput);

if (!audioPlayer) {
    alert('ERROR: No se encontró el elemento audioPlayer');
}

let playlist = [];
let currentTrackIndex = 0;

<<<<<<< HEAD
// ========== Cargar archivos ==========
=======
// Eventos de debugging para el audio
audioPlayer.addEventListener('loadstart', () => console.log('▶ Iniciando carga...'));
audioPlayer.addEventListener('loadedmetadata', () => console.log('✓ Metadata cargada'));
audioPlayer.addEventListener('loadeddata', () => console.log('✓ Datos de audio cargados'));
audioPlayer.addEventListener('canplay', () => console.log('✓ Audio listo para reproducir'));
audioPlayer.addEventListener('canplaythrough', () => console.log('✓ Audio completamente cargado'));
audioPlayer.addEventListener('playing', () => console.log('♫ Reproduciendo...'));
audioPlayer.addEventListener('pause', () => console.log('⏸ Pausado'));
audioPlayer.addEventListener('ended', () => console.log('⏹ Finalizado'));

audioPlayer.addEventListener('error', function(e) {
    console.error('❌ ERROR EN AUDIO:', e);

    if (audioPlayer.error) {
        let errorMsg = '';
        switch (audioPlayer.error.code) {
            case 1:
                errorMsg = 'MEDIA_ERR_ABORTED: Carga abortada por el usuario';
                break;
            case 2:
                errorMsg = 'MEDIA_ERR_NETWORK: Error de red';
                break;
            case 3:
                errorMsg = 'MEDIA_ERR_DECODE: Error al decodificar';
                break;
            case 4:
                errorMsg = 'MEDIA_ERR_SRC_NOT_SUPPORTED: Formato no soportado';
                break;
        }
        console.error('Código de error:', audioPlayer.error.code);
        console.error('Mensaje:', errorMsg);
        alert('Error: ' + errorMsg);
    }
});

// Cargar archivos de audio
>>>>>>> 5d653e01765dc18d2f1f371df6a31ef0dd784408
audioFileInput.addEventListener('change', function(e) {
    console.log('=== CARGANDO ARCHIVOS ===');
    console.log('Archivos seleccionados:', e.target.files.length);

    const files = Array.from(e.target.files);

<<<<<<< HEAD
=======
    files.forEach((file, i) => {
        console.log(`Archivo ${i + 1}:`, file.name, 'Tipo:', file.type, 'Tamaño:', file.size);
    });

>>>>>>> 5d653e01765dc18d2f1f371df6a31ef0dd784408
    playlist = files.map((file, index) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        index
    }));

<<<<<<< HEAD
    renderPlaylist();
    if (playlist.length > 0) loadTrack(0);
=======
    console.log('Playlist creada:', playlist);

    renderPlaylist();
    if (playlist.length > 0) {
        console.log('Cargando primera pista...');
        loadTrack(0);
    }
>>>>>>> 5d653e01765dc18d2f1f371df6a31ef0dd784408
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
<<<<<<< HEAD

        item.onclick = () => {
            loadTrack(index);
            audioPlayer.play();
        };

=======
        item.onclick = () => {
            console.log('Click en pista:', index);
            loadTrack(index);
        };
>>>>>>> 5d653e01765dc18d2f1f371df6a31ef0dd784408
        playlistItems.appendChild(item);
    });
    console.log('Playlist renderizada con', playlist.length, 'canciones');
}

// ========== Cargar pista ==========
function loadTrack(index) {
<<<<<<< HEAD
=======
    console.log('=== CARGANDO PISTA ===');
    if (playlist.length === 0) {
        console.warn('Playlist vacía');
        return;
    }

>>>>>>> 5d653e01765dc18d2f1f371df6a31ef0dd784408
    currentTrackIndex = index;
    console.log('URL de la pista:', playlist[index].url);
    console.log('Nombre:', playlist[index].name);

    audioPlayer.src = playlist[index].url;
    trackTitle.textContent = playlist[index].name;

<<<<<<< HEAD
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
=======
    console.log('audioPlayer.src establecido a:', audioPlayer.src);
    audioPlayer.load();
    console.log('load() llamado');

    // Marcar pista activa en playlist
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// Controles de reproducción - CON DEBUGGING
btnPlay.addEventListener('click', () => {
    console.log('=== CLICK EN PLAY ===');
    console.log('Playlist length:', playlist.length);
    console.log('audioPlayer.src:', audioPlayer.src);
    console.log('audioPlayer.paused:', audioPlayer.paused);
    console.log('audioPlayer.readyState:', audioPlayer.readyState);

    // Verificar que hay canciones cargadas
    if (playlist.length === 0) {
        alert('Por favor carga archivos de audio primero');
        console.warn('No hay canciones en la playlist');
        return;
    }

    // Verificar que hay una fuente de audio
    if (!audioPlayer.src || audioPlayer.src === '') {
        console.log('No hay src, cargando pista 0');
        loadTrack(0);
        // Esperar un momento para que se cargue
        setTimeout(() => {
            playAudio();
        }, 500);
    } else {
        playAudio();
    }
});

function playAudio() {
    console.log('Intentando reproducir...');
    console.log('Volume:', audioPlayer.volume);
    console.log('Muted:', audioPlayer.muted);

    const playPromise = audioPlayer.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('✓✓✓ REPRODUCIENDO CORRECTAMENTE ✓✓✓');
            })
            .catch(error => {
                console.error('❌❌❌ ERROR AL REPRODUCIR:', error);
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                alert('No se pudo reproducir: ' + error.message);
            });
    }
}

btnPause.addEventListener('click', () => {
    console.log('Click en PAUSE');
    audioPlayer.pause();
});

btnStop.addEventListener('click', () => {
    console.log('Click en STOP');
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    progressSlider.value = 0;
});

btnNext.addEventListener('click', () => {
    console.log('Click en NEXT');
    if (playlist.length === 0) return;

    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);

    setTimeout(() => {
        audioPlayer.play()
            .then(() => console.log('Siguiente pista reproduciendo'))
            .catch(error => console.error('Error en siguiente:', error));
    }, 300);
});

btnPrev.addEventListener('click', () => {
    console.log('Click en PREV');
    if (playlist.length === 0) return;

    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);

    setTimeout(() => {
        audioPlayer.play()
            .then(() => console.log('Pista anterior reproduciendo'))
            .catch(error => console.error('Error en anterior:', error));
    }, 300);
});
>>>>>>> 5d653e01765dc18d2f1f371df6a31ef0dd784408

// ========== Volumen ==========
volumeSlider.oninput = e => {
    audioPlayer.volume = e.target.value / 100;
<<<<<<< HEAD
};

// ========== Progreso ==========
audioPlayer.ontimeupdate = () => {
    if (!audioPlayer.duration) return;

    progressSlider.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;

    let m = Math.floor(audioPlayer.currentTime / 60);
    let s = Math.floor(audioPlayer.currentTime % 60);
    trackTime.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
};
=======
    console.log('Volumen cambiado a:', audioPlayer.volume);
});

// Control de balance
balanceSlider.addEventListener('input', (e) => {
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
        console.log('Seeking to:', time);
    }
});

// Auto-siguiente cuando termina la pista
audioPlayer.addEventListener('ended', () => {
    console.log('Pista finalizada, cargando siguiente...');
    if (playlist.length > 0) {
        btnNext.click();
    }
});
>>>>>>> 5d653e01765dc18d2f1f371df6a31ef0dd784408

progressSlider.oninput = e => {
    audioPlayer.currentTime = (e.target.value / 100) * audioPlayer.duration;
};

// ========== Auto Next ==========
audioPlayer.onended = () => btnNext.click();

// ========== VISUALIZER ==========
const canvas = document.getElementById('visualizerCanvas');
const ctx = canvas.getContext('2d');
let animationId;

function drawVisualizer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

<<<<<<< HEAD
    for (let i = 0; i < 20; i++) {
        const h = Math.random() * canvas.height;
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(i * 4, canvas.height - h, 3, h);
=======
    for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height * (audioPlayer.paused ? 0.3 : 1);
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(i * 4, canvas.height - height, 3, height);
    }

    if (!audioPlayer.paused) {
        animationId = requestAnimationFrame(drawVisualizer);
>>>>>>> 5d653e01765dc18d2f1f371df6a31ef0dd784408
    }

    if (!audioPlayer.paused) requestAnimationFrame(drawVisualizer);
}

<<<<<<< HEAD
audioPlayer.onplay = () => requestAnimationFrame(drawVisualizer);

=======
audioPlayer.addEventListener('play', () => {
    drawVisualizer();
});

audioPlayer.addEventListener('pause', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// Ecualizador
const eqBands = document.querySelectorAll('.eq-band input');
eqBands.forEach(band => {
    band.addEventListener('input', (e) => {
        console.log('EQ Band:', e.target.nextElementSibling.textContent, 'Value:', e.target.value);
    });
});

console.log('=== WINAMP PLAYER INICIALIZADO ===');
console.log('Abre la consola del navegador (F12) para ver los mensajes de debug');
>>>>>>> 5d653e01765dc18d2f1f371df6a31ef0dd784408
