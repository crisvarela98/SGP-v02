document.addEventListener('DOMContentLoaded', function () {
    const familiaContainer = document.getElementById('familiaContainer');
    const marcaSeleccionada = localStorage.getItem('marcaSeleccionada');

    fetch(`/models/productos`)
        .then(response => response.json())
        .then(data => {
            const familias = [...new Set(data.map(producto => producto.Familia1))];
            familias.forEach(familia => {
                const button = document.createElement('button');
                button.textContent = familia;
                button.onclick = function () {
                    localStorage.setItem('familiaSeleccionada', familia);
                    window.location.href = 'productos.html';
                };
                familiaContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error al cargar las familias:', error));
});
