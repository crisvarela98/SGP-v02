document.addEventListener('DOMContentLoaded', function () {
    const marcaContainer = document.getElementById('marcaContainer');
    const clienteSeleccionado = JSON.parse(localStorage.getItem('clienteSeleccionado'));

    fetch('/models/productos')
        .then(response => response.json())
        .then(data => {
            const marcas = [...new Set(data.map(producto => producto.Marca))];
            marcas.forEach(marca => {
                const button = document.createElement('button');
                button.textContent = marca;
                button.onclick = function () {
                    localStorage.setItem('marcaSeleccionada', marca);
                    window.location.href = 'familias.html';
                };
                marcaContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error al cargar las marcas:', error));
});
