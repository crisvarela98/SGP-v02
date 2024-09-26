// Inicializamos el carrito desde el localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || []; 

if (!Array.isArray(carrito)) {
    carrito = [];  // Si `carrito` no es un array, se inicializa como uno vacío
}

document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productosContainer');
    const marcaSeleccionada = localStorage.getItem('marcaSeleccionada');
    const familiaSeleccionada = localStorage.getItem('familiaSeleccionada');

    actualizarArtAgregados(); // Actualizamos el contador de artículos al cargar la página

    // Verificamos si la marca y la familia están seleccionadas
    if (!marcaSeleccionada || !familiaSeleccionada) {
        alert('Por favor, selecciona primero una marca y una familia.');
        window.location.href = 'marcas.html'; // Redirige a la selección de marca si no está definida
        return;
    }

    // Cargar los productos desde MongoDB y filtrarlos por marca y familia seleccionada
    fetch(`/models/productos?marca=${marcaSeleccionada}&familia=${familiaSeleccionada}`)
        .then(response => response.json())
        .then(data => {
            // Filtramos los productos por la marca y la familia seleccionada
            const productosFiltrados = data.filter(producto => 
                producto.Marca === marcaSeleccionada && producto.Familia1 === familiaSeleccionada
            );

            if (productosFiltrados.length > 0) {
                mostrarProductos(productosContainer, productosFiltrados);
            } else {
                mostrarMensajeError(productosContainer, 'No se encontraron productos para la marca y familia seleccionada.');
            }
        })
        .catch(error => {
            console.error('Error al cargar los productos desde MongoDB:', error);
            mostrarMensajeError(productosContainer, 'Hubo un error al cargar los productos.');
        });
});

function mostrarMensajeError(container, mensaje) {
    container.innerHTML = `<p>${mensaje}</p>`;
}

function mostrarProductos(container, productos) {
    container.innerHTML = ''; // Limpiar el contenedor antes de añadir productos

    productos.forEach(producto => { 
        const num = producto.Oferta;
        let precio;
        let Oferta;

        if (num.includes('+')) {
            const [compra, regalo] = num.split('+').map(Number);
            Oferta = `Llevas ${compra} y tenés ${regalo} gratis`;
            precio = parseFloat(producto.PrecioLista) || 0;
        } else {
            precio = ((parseFloat(producto.PrecioLista) || 0) * (1 - (parseFloat(num) || 0) / 100)).toFixed(2);
            Oferta = `Tiene un descuento del ${num}%`;
        }

        const productoHTML = `
            <div class="producto-item">
                <div class="product-info">
                    <h1>${producto.Descripcion}</h1>
                    <p class="price">Nuevo precio:</p>
                    <p class="price">$${precio}</p>
                </div>
                <label>${Oferta}</label>
                <p>Unibulto: ${producto.UniBulto}</p>

                <div class="unidades">
                    <label for="unidades-${producto.Codigo}">Unidades:</label>
                    <button type="button" onclick="ajustarUnidades('${producto.Codigo}', -1)">-</button>
                    <input type="number" id="unidades-${producto.Codigo}" name="unidades" min="0" value="0">
                    <button type="button" onclick="ajustarUnidades('${producto.Codigo}', 1)">+</button>
                </div>
                
                <button onclick="agregarBulto('${producto.Codigo}', ${producto.UniBulto})">Agregar Bulto (${producto.UniBulto} Unidades)</button>
                <button onclick="agregarAlPedido('${producto.Codigo}', ${precio}, '${num}')">Agregar a Pedido</button>
            </div>
        `;
        container.innerHTML += productoHTML;
    });
}

function ajustarUnidades(codigo, cantidad) {
    const unidadesInput = document.getElementById(`unidades-${codigo}`);
    const nuevasUnidades = Math.max(0, (parseInt(unidadesInput.value) || 0) + cantidad);
    unidadesInput.value = nuevasUnidades;
}

function agregarBulto(codigo, unibulto) {
    ajustarUnidades(codigo, unibulto);
}

function agregarAlPedido(codigo, precio, oferta) {
    const unidadesInput = document.getElementById(`unidades-${codigo}`);
    let unidades = parseInt(unidadesInput.value) || 0;

    if (unidades <= 0) {
        alert('Por favor, seleccione una cantidad de unidades válida.');
        return;
    }

    let unidadesBonificadas = 0;
    if (oferta.includes('+')) {
        const [compra, regalo] = oferta.split('+').map(Number);
        unidadesBonificadas = Math.floor(unidades / compra) * regalo;
    }

    // Verificar si ya existe el producto en el carrito
    let productoExistente = carrito.find(item => item.codigo === codigo && !item.bonificacion);
    if (productoExistente) {
        productoExistente.unidades += unidades;
        productoExistente.total += precio * unidades;
    } else {
        const productoSeleccionado = {
            codigo,
            descripcion: document.querySelector(`#unidades-${codigo}`).closest('.producto-item').querySelector('h1').textContent,
            unidades,
            precioUnitario: precio,
            total: precio * unidades,
            descuento: oferta,
            bonificacion: false
        };
        carrito.push(productoSeleccionado);
    }

    if (unidadesBonificadas > 0) {
        let bonificacionExistente = carrito.find(item => item.codigo === codigo && item.bonificacion);
        if (bonificacionExistente) {
            bonificacionExistente.unidades += unidadesBonificadas;
        } else {
            carrito.push({
                codigo,
                descripcion: `${productoExistente ? productoExistente.descripcion : 'Producto'} (Bonificación)`,
                unidades: unidadesBonificadas,
                precioUnitario: 0,
                total: 0,
                bonificacion: true
            });
        }
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarArtAgregados();
}

function actualizarArtAgregados() {
    const artAgregados = document.getElementById('artAgregados');
    artAgregados.textContent = `ART. Agregados: ${carrito.length}`;
}

function manejarAgregarAlCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.location.href = 'order_details.html';
}
