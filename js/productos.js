// Inicializar el carrito como un array vacío si no está definido en el localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

if (!Array.isArray(carrito)) {
    carrito = [];
}

document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productosContainer');
    const marcaSeleccionada = localStorage.getItem('marcaSeleccionada');
    const familiaSeleccionada = localStorage.getItem('familiaSeleccionada');

    actualizarArtAgregados();

    if (!marcaSeleccionada || !familiaSeleccionada) {
        alert('Por favor, selecciona primero una marca y una familia.');
        window.location.href = 'marcas.html';
        return;
    }

    // Cargar productos desde MongoDB utilizando una API de productos
    fetch(`/models/productos?marca=${encodeURIComponent(marcaSeleccionada)}&familia=${encodeURIComponent(familiaSeleccionada)}`)
        .then(response => response.json())
        .then(data => {
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
    container.innerHTML = `<p style="color: red;">${mensaje}</p>`;
}

function mostrarProductos(container, productos) {
    container.innerHTML = ''; // Limpiar el contenedor

    productos.forEach(producto => { 
        const num = producto.Oferta;
        let precio;
        let Oferta;

        // Calcular el precio y la oferta
        if (num.includes('+')) {
            const [compra, regalo] = num.split('+').map(Number);
            Oferta = `Llevas ${compra} y tenés ${regalo} gratis`;
            precio = parseFloat(producto.PrecioLista) || 0;
        } else {
            precio = ((parseFloat(producto.PrecioLista) || 0) * (1 - (parseFloat(num) || 0) / 100)).toFixed(2);
            Oferta = `Tiene un descuento del ${num}%`;
        }

        // Construir el HTML del producto incluyendo la imagen
        const productoHTML = `
            <div class="producto-item">
                <img class="imagen" src="/assets/Articulos/${producto.Codigo.substring(0, 2)}/${producto.Codigo}.jpg" alt="${producto.Descripcion}">
                <div class="product-info">
                    <h1>${producto.Descripcion}</h1>
                    <p class="price">Nuevo precio: $${precio}</p>
                    <p>${Oferta}</p>
                    <p>Unibulto: ${producto.UniBulto}</p>
                </div>
                <div class="unidades">
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

    // Manejar el evento de clic para ampliar la imagen
    $(".imagen").click(function() {
        const path = $(this).attr('src');
        const modalHTML = `
            <div id="imageModal" class="modal">
                <img class="modal-content" src="${path}" alt="Imagen Ampliada">
            </div>
        `;
        $("body").append(modalHTML);
        $("#imageModal").fadeIn();

        // Cerrar el modal al hacer clic en la imagen o fuera de ella
        $(".modal-content, .modal").click(function() {
            $("#imageModal").fadeOut(function() {
                $(this).remove();
            });
        });
    });
}

function ajustarUnidades(codigo, cantidad) {
    const unidadesInput = document.getElementById(`unidades-${codigo}`);
    if (unidadesInput) {
        const nuevasUnidades = Math.max(0, (parseInt(unidadesInput.value) || 0) + cantidad);
        unidadesInput.value = nuevasUnidades;
    }
}

function agregarBulto(codigo, unibulto) {
    ajustarUnidades(codigo, unibulto);
}

function agregarAlPedido(codigo, precio, oferta) {
    const unidadesInput = document.getElementById(`unidades-${codigo}`);
    if (!unidadesInput) return;
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

    // Actualizar carrito
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
    if (artAgregados) {
        artAgregados.textContent = `ART. Agregados: ${carrito.reduce((acc, item) => acc + item.unidades, 0)}`;
    }
}

// Función para redirigir a la pantalla de pedido sin limpiar el localStorage
function manejarAgregarAlCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.location.href = 'order_details.html';
}

// Función para redirigir a la pantalla de pedido
function verPedido() {
    manejarAgregarAlCarrito();
}
