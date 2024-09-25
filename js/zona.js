document.addEventListener('DOMContentLoaded', function () {
    const zonaContainer = document.getElementById('zonaContainer');
    fetch('/models/clientes')
        .then(response => response.json())
        .then(data => {
            const zonas = [...new Set(data.map(cliente => cliente.zone))];
            zonas.forEach(zona => {
                const button = document.createElement('button');
                button.textContent = zona;
                button.onclick = function () {
                    localStorage.setItem('zonaSeleccionada', zona);
                    window.location.href = 'clientes.html';
                };
                zonaContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error al cargar las zonas:', error));
});
