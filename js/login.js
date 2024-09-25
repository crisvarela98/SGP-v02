document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Enviar los datos de inicio de sesión al servidor para su verificación
    fetch('/models/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Bienvenido ' + username);
            localStorage.setItem('usuario', username);
            window.location.href = 'main_menu.html';
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    })
    .catch(error => console.error('Error durante el inicio de sesión:', error));
});

