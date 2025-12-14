// 1. REFERENCIAS AL DOM Y VARIABLES DE ESTADO GLOBALES
    const papeleraWindow = document.getElementById('papelera-window');
    const notepadWindow = document.getElementById('notepad-window'); 

    // Estado guardado para la Papelera
    let previousWindowState = {
        width: '600px', 
        height: '400px',
        top: '50px',
        left: '50px',
        isMaximized: false
    };
    
    // Estado guardado para el Bloc de Notas (necesario para las funciones genéricas)
    let notepadWindowState = {
        width: '700px', height: '500px', top: '80px', left: '80px', isMaximized: false
    };

    // Variables de estado genéricas para arrastre/redimensionamiento
    let activeWindow = null;
    let currentHandle = null; 
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    const minSize = 200;

    // 2. LÓGICA DE VENTANA BÁSICA Y MAXIMIZAR/RESTAURAR (ESPECÍFICA POR APP)

    // --- Papelera de Reciclaje ---
    function abrirPapelera() { 
        papeleraWindow.classList.remove('hidden');
    } 
    function cerrarPapelera() { 
        papeleraWindow.classList.add('hidden');
    } 
    function minimizarPapelera() { 
        papeleraWindow.classList.add('hidden');
    } 
    function restaurarPapelera() { 
        papeleraWindow.classList.remove('hidden');
    }
    
    function toggleMaximizarPapelera() {
        toggleMaximizar(papeleraWindow, previousWindowState, 'maximize-icon');
    }  

    // Bloc de Notas
function abrirNotepad() { 
    notepadWindow.classList.remove('hidden');
}

function cerrarNotepad() { 
    notepadWindow.classList.add('hidden');
} 

function minimizarNotepad() { 
    notepadWindow.classList.add('hidden');
}

function toggleMaximizarNotepad() { 
    toggleMaximizar(notepadWindow, notepadWindowState, 'notepad-maximize-icon');
}

    // --- Función Genérica de Maximizar/Restaurar (Utilizada por ambas apps) ---
    function toggleMaximizar(windowEl, stateObj, iconId) {
        const icon = document.getElementById(iconId);

        if (stateObj.isMaximized) {
            // RESTAURAR
            windowEl.style.width = stateObj.width;
            windowEl.style.height = stateObj.height;
            windowEl.style.top = stateObj.top;
            windowEl.style.left = stateObj.left;
            icon.textContent = '[]';
            stateObj.isMaximized = false;
        } else {
            // MAXIMIZAR
            stateObj.width = windowEl.style.width || windowEl.offsetWidth + 'px';
            stateObj.height = windowEl.style.height || windowEl.offsetHeight + 'px';
            stateObj.top = windowEl.style.top || windowEl.offsetTop + 'px';
            stateObj.left = windowEl.style.left || windowEl.offsetLeft + 'px';

            windowEl.style.width = '100%';
            windowEl.style.height = 'calc(100% - 30px)'; 
            windowEl.style.top = '0';
            windowEl.style.left = '0';

            icon.innerHTML = '&#9638;'; 
            stateObj.isMaximized = true;
        }
    }

    // 3. LÓGICA GENÉRICA DE ARRASTRE (DRAG)
    let dragOffsetX, dragOffsetY;

    function startDrag(e) {
        const windowElement = e.currentTarget.closest('.window-xp');
        const state = windowElement.id === 'papelera-window' ? previousWindowState : notepadWindowState;
        
        if (state.isMaximized) return;
        
        activeWindow = windowElement;
        e.preventDefault(); 

        dragOffsetX = e.clientX - activeWindow.offsetLeft;
        dragOffsetY = e.clientY - activeWindow.offsetTop;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        activeWindow.style.userSelect = 'none';
        activeWindow.style.transition = 'none';
        activeWindow.style.zIndex = '100'; // Traer al frente
    }

    function drag(e) {
        if (!activeWindow) return;

        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;

        activeWindow.style.left = `${newX}px`;
        activeWindow.style.top = `${newY}px`; 
    }

    function stopDrag() {
        if (activeWindow) {
            activeWindow.style.userSelect = 'auto';
            activeWindow.style.transition = '';
        }
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag); 
        activeWindow = null;
    }

    // 4. LÓGICA GENÉRICA DE REDIMENSIONAMIENTO

    function startResize(e) {
        const windowElement = e.currentTarget.closest('.window-xp');
        const state = windowElement.id === 'papelera-window' ? previousWindowState : notepadWindowState;

        if (state.isMaximized) return;

        activeWindow = windowElement;
        e.preventDefault(); 
        currentHandle = e.currentTarget;
        
        startX = e.clientX;
        startY = e.clientY;
        startWidth = activeWindow.offsetWidth;
        startHeight = activeWindow.offsetHeight;
        startLeft = activeWindow.offsetLeft;
        startTop = activeWindow.offsetTop;

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        activeWindow.style.transition = 'none';
        activeWindow.style.zIndex = '100'; // Traer al frente
    }

    function resize(e) {
        if (!activeWindow || !currentHandle) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        //Lógica de cálculo de redimensionamiento

        if (currentHandle.classList.contains('right') || currentHandle.classList.contains('bottom-right') || currentHandle.classList.contains('top-right')) {
            newWidth = Math.max(startWidth + deltaX, minSize);
        }
        if (currentHandle.classList.contains('bottom') || currentHandle.classList.contains('bottom-left') || currentHandle.classList.contains('bottom-right')) {
            newHeight = Math.max(startHeight + deltaY, minSize);
        }
        
        if (currentHandle.classList.contains('left') || currentHandle.classList.contains('top-left') || currentHandle.classList.contains('bottom-left')) {
            newWidth = Math.max(startWidth - deltaX, minSize);
            if (newWidth > minSize) {
                newLeft = startLeft + deltaX;
            }
        }
        if (currentHandle.classList.contains('top') || currentHandle.classList.contains('top-left') || currentHandle.classList.contains('top-right')) {
            newHeight = Math.max(startHeight - deltaY, minSize);
            if (newHeight > minSize) {
                newTop = startTop + deltaY;
            }
        }

        activeWindow.style.width = `${newWidth}px`;
        activeWindow.style.height = `${newHeight}px`;
        activeWindow.style.left = `${newLeft}px`;
        activeWindow.style.top = `${newTop}px`;
    }

    function stopResize() {
        if (activeWindow) activeWindow.style.transition = '';
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        activeWindow = null;
        currentHandle = null;
    }

    // 5. INICIALIZACIÓN DE VENTANAS 
    document.addEventListener('DOMContentLoaded', () => {
        
        // Función auxiliar para inicializar arrastre/redimensionamiento
        const initializeWindow = (windowElement) => {
            const titleBar = windowElement.querySelector('.title-bar');
            const handles = windowElement.querySelectorAll('.resize-handle');
            
            titleBar.addEventListener('mousedown', startDrag);
            handles.forEach(handle => {
                handle.addEventListener('mousedown', startResize);
            });
            // Traer al frente al hacer clic
            windowElement.addEventListener('mousedown', () => {
                document.querySelectorAll('.window-xp').forEach(win => {
                    win.style.zIndex = '50';
                });
                windowElement.style.zIndex = '100';
            });
        };
        // INICIALIZAR PAPELERA
        if (papeleraWindow) initializeWindow(papeleraWindow);
        // INICIALIZAR BLOC DE NOTAS 
        if (notepadWindow) { 
            initializeWindow(notepadWindow); 
            notepadWindow.style.width = notepadWindowState.width; 
            notepadWindow.style.height = notepadWindowState.height; 
            notepadWindow.style.top = notepadWindowState.top; 
            notepadWindow.style.left = notepadWindowState.left; 
        }
    });
