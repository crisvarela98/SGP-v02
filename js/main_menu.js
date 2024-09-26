document.addEventListener('DOMContentLoaded', function() {
    // Mostrar la hora actual en el header
    function updateTime() {
        const now = new Date();
        const options = { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const timeString = now.toLocaleTimeString('es-AR', options);
        document.getElementById('time').textContent = timeString;
    }

    setInterval(updateTime, 1000);
    updateTime();

    // Mostrar mensaje de bienvenida
    const username = localStorage.getItem('usuario');
    document.getElementById('welcome-message').textContent = `Bienvenido, @${username}!`;

    // Funcionalidad de logout
    document.getElementById('logout-button').addEventListener('click', function() {
        alert('Sesión cerrada');
        window.location.href = 'login.html';
    });

    // Limpiar localStorage al hacer clic en "Nuevo pedido" (excepto el número de pedido)
    document.querySelector('.button[href="zona.html"]').addEventListener('click', function() {
        limpiarLocalStorage();
    });
});

// Función para limpiar el localStorage excepto el número de pedido
function limpiarLocalStorage() {
    // Guarda el número de pedido antes de limpiar
    const orderId = localStorage.getItem('orderId');

    // Limpia todos los datos excepto el `orderId`
    localStorage.clear();
    
    // Restaura el número de pedido
    if (orderId) {
        localStorage.setItem('orderId', orderId);
    }
}

// Cargar notas desde MongoDB
window.onload = loadNotes;

function loadNotes() {
    const notesContainer = document.querySelector('.notes');
    notesContainer.innerHTML = ''; 

    // Obtener notas desde MongoDB
    fetch('/models/notas')
        .then(response => response.json())
        .then(notes => {
            notes.forEach((note, index) => {
                const noteDiv = document.createElement('div');
                noteDiv.classList.add('note');
                noteDiv.innerHTML = `${note.text} <br><small>${note.timestamp}</small>`;

                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = 'Eliminar';
                deleteBtn.onclick = () => deleteNote(note._id);  // Eliminar por ID de MongoDB
                noteDiv.appendChild(deleteBtn);

                notesContainer.appendChild(noteDiv);
            });
        })
        .catch(error => console.error('Error al cargar notas:', error));
}

// Abrir y cerrar el popup
const popup = document.querySelector('.popup');
const openPopupBtn = document.querySelector('.open-popup');
const closePopupBtn = document.querySelector('.close-popup');

openPopupBtn.addEventListener('click', () => {
    loadNotes(); 
    popup.style.display = 'flex';
});

closePopupBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Agregar nueva nota y guardarla en MongoDB
document.querySelector('.note-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const noteText = document.querySelector('.note-input').value.trim();

    if (noteText !== "") {
        const now = new Date();
        const timestamp = now.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Guardar la nota en MongoDB
        fetch('/models/notas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: noteText, timestamp })
        })
        .then(() => {
            document.querySelector('.note-input').value = "";
            showMessage('Nota agregada con éxito');
            loadNotes(); // Recargar notas
        })
        .catch(error => console.error('Error al agregar nota:', error));
    }
});

// Eliminar una nota de MongoDB
function deleteNote(noteId) {
    fetch(`/models/notas/${noteId}`, {
        method: 'DELETE'
    })
    .then(() => {
        showMessage('Nota eliminada con éxito');
        loadNotes(); // Recargar notas
    })
    .catch(error => console.error('Error al eliminar nota:', error));
}

function showMessage(message) {
    const messageDiv = document.querySelector('.message');
    messageDiv.innerText = message;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000); 
}
