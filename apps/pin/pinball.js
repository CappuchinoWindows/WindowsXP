const canvas = document.getElementById('pinballCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 800;

// Variables del juego
let score = 0;
let currentBall = 1;
let totalBalls = 3;
let gameActive = false;
let mission = "Awaiting Deployment";

// Física
const gravity = 0.5;
const friction = 0.985;

// Bola
let ball = {
    x: 560,
    y: 700,
    radius: 7,
    vx: 0,
    vy: 0,
    launched: false,
    color: '#c0c0c0'
};

// Flippers (rojos como el original)
let leftFlipper = {
    x: 180,
    y: 730,
    width: 90,
    height: 15,
    angle: 0.5,
    maxAngle: -0.7,
    minAngle: 0.5,
    active: false
};

let rightFlipper = {
    x: 420,
    y: 730,
    width: 90,
    height: 15,
    angle: -0.5,
    maxAngle: 0.7,
    minAngle: -0.5,
    active: false
};

// Bumpers circulares (estilo Space Cadet)
let bumpers = [
    { x: 200, y: 180, radius: 35, color: '#ff6b6b', lightColor: '#ff0000', points: 500, lit: false },
    { x: 400, y: 180, radius: 35, color: '#4ecdc4', lightColor: '#00ffff', points: 500, lit: false },
    { x: 300, y: 280, radius: 35, color: '#ffe66d', lightColor: '#ffff00', points: 500, lit: false },
    { x: 150, y: 400, radius: 28, color: '#ff00ff', lightColor: '#ff69b4', points: 250, lit: false },
    { x: 450, y: 400, radius: 28, color: '#00ff00', lightColor: '#7fff00', points: 250, lit: false }
];

// Targets (rectangulares tipo Space Cadet)
let targets = [
    { x: 80, y: 120, width: 25, height: 70, active: true, points: 1000, color: '#ff0000' },
    { x: 280, y: 80, width: 25, height: 70, active: true, points: 1000, color: '#ffff00' },
    { x: 480, y: 120, width: 25, height: 70, active: true, points: 1000, color: '#00ff00' }
];

// Luces decorativas (estilo retro)
let lights = [];
for (let i = 0; i < 30; i++) {
    lights.push({
        x: Math.random() * 580 + 10,
        y: Math.random() * 600 + 50,
        color: ['#ff0000', '#00ff00', '#ffff00', '#0000ff'][Math.floor(Math.random() * 4)],
        on: Math.random() > 0.5
    });
}

// Plunger
let plunger = {
    x: 565,
    y: 700,
    power: 0,
    maxPower: 25,
    charging: false
};

// Actualizar displays
function updateDisplays() {
    document.getElementById('scoreDisplay').textContent = score.toLocaleString();
    document.getElementById('ballDisplay').textContent = currentBall;
    document.getElementById('missionText').textContent = mission;
}

// Dibujar fondo estilo Space Cadet
function drawBackground() {
    // Fondo azul oscuro espacial
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a2e');
    gradient.addColorStop(0.5, '#1a1a50');
    gradient.addColorStop(1, '#0a0a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Estrellas de fondo
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 123) % canvas.width;
        const y = (i * 456) % canvas.height;
        ctx.fillRect(x, y, 2, 2);
    }
    
    // Bordes metálicos
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
}

// Dibujar luces decorativas
function drawLights() {
    lights.forEach(light => {
        if (light.on) {
            ctx.fillStyle = light.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = light.color;
            ctx.beginPath();
            ctx.arc(light.x, light.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    });
}

// Dibujar bola metálica
function drawBall() {
    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(ball.x + 2, ball.y + 2, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Bola con gradiente metálico
    const gradient = ctx.createRadialGradient(
        ball.x - 3, ball.y - 3, 2,
        ball.x, ball.y, ball.radius
    );
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, '#e0e0e0');
    gradient.addColorStop(0.7, '#a0a0a0');
    gradient.addColorStop(1, '#606060');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Brillo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(ball.x - 2, ball.y - 2, 2, 0, Math.PI * 2);
    ctx.fill();
}

// Dibujar flippers rojos
function drawFlipper(flipper, isLeft) {
    ctx.save();
    ctx.translate(flipper.x, flipper.y);
    ctx.rotate(flipper.angle);
    
    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(
        isLeft ? 2 : -flipper.width + 2, 
        -flipper.height / 2 + 2, 
        flipper.width, 
        flipper.height
    );
    
    // Flipper rojo brillante
    const gradient = ctx.createLinearGradient(0, -flipper.height/2, 0, flipper.height/2);
    gradient.addColorStop(0, '#ff4444');
    gradient.addColorStop(0.5, '#cc0000');
    gradient.addColorStop(1, '#880000');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(
        isLeft ? 0 : -flipper.width,
        -flipper.height / 2,
        flipper.width,
        flipper.height
    );
    
    // Borde
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        isLeft ? 0 : -flipper.width,
        -flipper.height / 2,
        flipper.width,
        flipper.height
    );
    
    ctx.restore();
}

// Dibujar bumpers 3D
function drawBumpers() {
    bumpers.forEach(bumper => {
        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(bumper.x + 3, bumper.y + 3, bumper.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Bumper con gradiente
        const gradient = ctx.createRadialGradient(
            bumper.x - bumper.radius * 0.3,
            bumper.y - bumper.radius * 0.3,
            5,
            bumper.x,
            bumper.y,
            bumper.radius
        );
        
        if (bumper.lit) {
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, bumper.lightColor);
            gradient.addColorStop(1, bumper.color);
        } else {
            gradient.addColorStop(0, bumper.color);
            gradient.addColorStop(0.5, '#666666');
            gradient.addColorStop(1, '#333333');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde metálico
        ctx.strokeStyle = bumper.lit ? '#ffff00' : '#808080';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Puntos
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bumper.points, bumper.x, bumper.y);
    });
}

// Dibujar targets
function drawTargets() {
    targets.forEach(target => {
        if (target.active) {
            // Sombra
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(target.x + 2, target.y + 2, target.width, target.height);
            
            // Target con gradiente
            const gradient = ctx.createLinearGradient(
                target.x, target.y,
                target.x + target.width, target.y
            );
            gradient.addColorStop(0, target.color);
            gradient.addColorStop(0.5, '#ffffff');
            gradient.addColorStop(1, target.color);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(target.x, target.y, target.width, target.height);
            
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(target.x, target.y, target.width, target.height);
        }
    });
}

// Dibujar plunger
function drawPlunger() {
    // Canal del plunger
    ctx.fillStyle = '#404040';
    ctx.fillRect(plunger.x - 15, 650, 30, 150);
    
    // Plunger
    const plungerY = plunger.y + (plunger.maxPower - plunger.power) * 4;
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(plunger.x - 10, plungerY, 20, 40);
    
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    ctx.strokeRect(plunger.x - 10, plungerY, 20, 40);
    
    // Resorte
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
        const y = 650 + i * ((plungerY - 650) / 10);
        const x = plunger.x + (i % 2 === 0 ? -5 : 5);
        if (i === 0) ctx.moveTo(plunger.x, 650);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

// Física de la bola
function updateBall() {
    if (!ball.launched) return;
    
    ball.vy += gravity;
    ball.vx *= friction;
    ball.vy *= friction;
    
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    // Colisiones con paredes
    if (ball.x - ball.radius < 15) {
        ball.x = 15 + ball.radius;
        ball.vx = Math.abs(ball.vx) * 0.8;
    }
    if (ball.x + ball.radius > canvas.width - 15) {
        ball.x = canvas.width - 15 - ball.radius;
        ball.vx = -Math.abs(ball.vx) * 0.8;
    }
    if (ball.y - ball.radius < 15) {
        ball.y = 15 + ball.radius;
        ball.vy = Math.abs(ball.vy) * 0.8;
    }
    
    // Bola perdida
    if (ball.y > canvas.height + 20) {
        lostBall();
    }
    
    // Colisión con bumpers
    bumpers.forEach(bumper => {
        const dx = ball.x - bumper.x;
        const dy = ball.y - bumper.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ball.radius + bumper.radius) {
            const angle = Math.atan2(dy, dx);
            const speed = 18;
            ball.vx = Math.cos(angle) * speed;
            ball.vy = Math.sin(angle) * speed;
            
            score += bumper.points;
            mission = "TARGET HIT!";
            bumper.lit = true;
            setTimeout(() => bumper.lit = false, 200);
            updateDisplays();
        }
    });
    
    // Colisión con targets
    targets.forEach(target => {
        if (target.active &&
            ball.x > target.x && ball.x < target.x + target.width &&
            ball.y > target.y && ball.y < target.y + target.height) {
            
            target.active = false;
            score += target.points;
            ball.vy = -Math.abs(ball.vy) * 1.5;
            mission = "BONUS +1000!";
            updateDisplays();
            
            setTimeout(() => target.active = true, 3000);
        }
    });
    
    // Colisión con flippers
    checkFlipperCollision(leftFlipper, true);
    checkFlipperCollision(rightFlipper, false);
}

// Colisión con flipper
function checkFlipperCollision(flipper, isLeft) {
    const cos = Math.cos(flipper.angle);
    const sin = Math.sin(flipper.angle);
    const length = isLeft ? flipper.width / 2 : -flipper.width / 2;
    
    const fx = flipper.x + cos * length;
    const fy = flipper.y + sin * length;
    
    const dx = ball.x - fx;
    const dy = ball.y - fy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < ball.radius + flipper.height) {
        const angle = Math.atan2(dy, dx);
        const power = flipper.active ? 20 : 10;
        ball.vx = Math.cos(angle) * power;
        ball.vy = Math.sin(angle) * power - 8;
    }
}

// Actualizar flippers
function updateFlippers() {
    const speed = 0.15;
    
    if (leftFlipper.active) {
        leftFlipper.angle = Math.max(leftFlipper.maxAngle, leftFlipper.angle - speed);
    } else {
        leftFlipper.angle = Math.min(leftFlipper.minAngle, leftFlipper.angle + speed);
    }
    
    if (rightFlipper.active) {
        rightFlipper.angle = Math.min(rightFlipper.maxAngle, rightFlipper.angle + speed);
    } else {
        rightFlipper.angle = Math.max(rightFlipper.minAngle, rightFlipper.angle - speed);
    }
}

// Lanzar bola
function launchBall() {
    if (!ball.launched && gameActive) {
        ball.vx = -8;
        ball.vy = -28;
        ball.launched = true;
        mission = "Mission Active!";
        updateDisplays();
    }
}

// Bola perdida
function lostBall() {
    ball.launched = false;
    currentBall++;
    
    if (currentBall > totalBalls) {
        gameOver();
    } else {
        resetBall();
        mission = "Ball Lost! Press SPACE";
        updateDisplays();
    }
}

// Resetear bola
function resetBall() {
    ball.x = 560;
    ball.y = 700;
    ball.vx = 0;
    ball.vy = 0;
    ball.launched = false;
}

// Game over
function gameOver() {
    gameActive = false;
    mission = "GAME OVER - Press F2";
    updateDisplays();
}

// Nuevo juego
function newGame() {
    score = 0;
    currentBall = 1;
    gameActive = true;
    mission = "Press SPACE to Launch";
    resetBall();
    targets.forEach(t => t.active = true);
    updateDisplays();
}

// Animar luces
setInterval(() => {
    lights.forEach(light => {
        if (Math.random() > 0.9) {
            light.on = !light.on;
        }
    });
}, 100);

// Loop principal
function gameLoop() {
    drawBackground();
    drawLights();
    drawBumpers();
    drawTargets();
    drawPlunger();
    drawFlipper(leftFlipper, true);
    drawFlipper(rightFlipper, false);
    drawBall();
    
    if (gameActive) {
        updateBall();
        updateFlippers();
    }
    
    requestAnimationFrame(gameLoop);
}

// Controles
document.addEventListener('keydown', (e) => {
    if (e.key === 'z' || e.key === 'Z') leftFlipper.active = true;
    if (e.key === '/' || e.key === '?') rightFlipper.active = true;
    if (e.key === ' ') {
        e.preventDefault();
        launchBall();
    }
    if (e.key === 'F2') {
        e.preventDefault();
        newGame();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'z' || e.key === 'Z') leftFlipper.active = false;
    if (e.key === '/' || e.key === '?') rightFlipper.active = false;
});

// Iniciar
updateDisplays();
newGame();
gameLoop();
