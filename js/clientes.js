document.addEventListener('DOMContentLoaded', function () {
    const clienteContainer = document.getElementById('clienteContainer');
    const zonaSeleccionada = localStorage.getItem('zonaSeleccionada');
    
    if (!zonaSeleccionada) {
        alert('Por favor, selecciona una zona primero.');
        window.location.href = 'zona.html';
        return;
    }

    fetch(`/models/clientes`)
        .then(response => response.json())
        .then(data => {
            data.forEach(cliente => {
                const button = document.createElement('button');
                button.textContent = cliente.name;
                button.onclick = function () {
                    localStorage.setItem('clienteSeleccionado', JSON.stringify(cliente));
                    window.location.href = 'marcas.html';
                };
                clienteContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error al cargar los clientes:', error));
});
