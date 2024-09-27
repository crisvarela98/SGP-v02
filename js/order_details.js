document.addEventListener('DOMContentLoaded', function() {
    const orderDetails = document.getElementById('order-details');
    const totalPriceElement = document.getElementById('total-price');
    const customerInfoContainer = document.getElementById('customer-info');
    const saveOrderLink = document.getElementById('save-order-link');
    const confirmOrderLink = document.getElementById('confirm-order-link');

    // Cargar el carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    let orderId = localStorage.getItem('orderId') || '00000001';

    // Cargar la información del cliente y zona correctamente desde localStorage
    let selectedClient = JSON.parse(localStorage.getItem('clienteSeleccionado')) || {};
    let selectedZone = localStorage.getItem('zonaSeleccionada') || '';

    // Verificar si la información del cliente está cargada
    if (!selectedClient.name) {
        alert('Por favor, selecciona primero un cliente.');
        window.location.href = 'zona.html'; // Redirige si no hay un cliente seleccionado
        return;
    }

    // Mostrar la información del cliente
    displayCustomerInfo(selectedClient, selectedZone);

    function displayCustomerInfo(client, zone) {
        customerInfoContainer.innerHTML = `
            <p><strong>Cliente:</strong> ${client.name} (${client.storeName})</p>
            <p><strong>Zona:</strong> ${zone}</p>
            <p><strong>Dirección:</strong> ${client.address}</p>
            <p><strong>Teléfono:</strong> ${client.phone}</p>
            <p><strong>Email:</strong> ${client.email}</p>
        `;
    }

    // Función para mostrar los detalles del pedido
    async function displayOrder() {
        orderDetails.innerHTML = '';
        let subTotal = 0;

        // Crear la tabla
        const table = document.createElement('table');
        table.classList.add('order-table');

        // Crear el encabezado de la tabla
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Código</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Unidades Bonificadas</th>
            <th>Descuento (%)</th>
            <th>Precio sin IVA</th>
            <th>Total sin IVA</th>
            <th>Acciones</th>
        `;
        table.appendChild(headerRow);

        if (Array.isArray(cart)) {
            cart.forEach((item, index) => {
                let bonificacionTexto = "N/A";
                let unidadesBonificadas = 0;
                const nuevoPrecio = item.precioUnitario.toFixed(2);

                // Calcular unidades bonificadas solo si item.descuento está definido
                if (item.descuento && item.descuento.includes('+')) {
                    const [compra, regalo] = item.descuento.split('+').map(Number);
                    unidadesBonificadas = Math.floor(item.unidades / compra) * regalo;
                    bonificacionTexto = `${unidadesBonificadas}`;
                }

                const totalWithoutIVA = nuevoPrecio * item.unidades;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.codigo}</td>
                    <td>${item.descripcion}</td>
                    <td><input type="number" class="quantity-input" value="${item.unidades}" min="1" data-index="${index}"></td>
                    <td>${bonificacionTexto}</td>
                    <td>${parseFloat(item.descuento) || 0}%</td>
                    <td>$${nuevoPrecio}</td>
                    <td>$${totalWithoutIVA.toFixed(2)}</td>
                    <td><button class="delete-item-button" data-index="${index}">Eliminar</button></td>
                `;
                table.appendChild(row);

                subTotal += totalWithoutIVA;
            });

            orderDetails.appendChild(table);

            const iva = subTotal * 0.21;
            const total = subTotal + iva;

            document.getElementById('subtotal').textContent = `$${subTotal.toFixed(2)}`;
            document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
            totalPriceElement.textContent = `$${total.toFixed(2)}`;

            // Manejar cambios en cantidad
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', updateCart);
            });

            // Manejar eliminación de productos
            document.querySelectorAll('.delete-item-button').forEach(button => {
                button.addEventListener('click', deleteCartItem);
            });
        } else {
            orderDetails.innerHTML = '<p>No hay productos en el carrito.</p>';
        }
    }

    function updateCart(event) {
        const index = event.target.dataset.index;
        const newValue = parseInt(event.target.value);

        cart[index].unidades = newValue;
        localStorage.setItem('carrito', JSON.stringify(cart));
        displayOrder(); // Refresca la tabla
    }

    function deleteCartItem(event) {
        const index = event.target.dataset.index;
        cart.splice(index, 1); // Eliminar producto del carrito

        localStorage.setItem('carrito', JSON.stringify(cart));
        displayOrder(); // Refresca la tabla
    }

    displayOrder();

    // Guardar el pedido
    saveOrderLink.addEventListener('click', function() {
        saveOrConfirmOrder('guardado');
    });

    // Confirmar el pedido
    confirmOrderLink.addEventListener('click', function() {
        saveOrConfirmOrder('confirmado');
    });

    function saveOrConfirmOrder(status) {
        const total = cart.reduce((acc, item) => acc + (item.precioUnitario * item.unidades), 0); // Calcular total del pedido
        const order = {
            id: orderId,
            clientId: selectedClient._id, // Agregar `clientId`
            customer: selectedClient,
            zone: selectedZone,
            date: new Date().toLocaleString(),
            status: status,
            cart: cart,
            total: total // Agregar total al pedido
        };

        // Incrementar el ID para el próximo pedido
        orderId = (parseInt(orderId) + 1).toString().padStart(8, '0');
        localStorage.setItem('orderId', orderId);

        // Guardar el pedido en la base de datos MongoDB
        fetch('/models/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        .then(() => {
            alert(`Pedido ${status} con éxito.`);
            limpiarLocalStorage(); // Llama a la función de limpieza para eliminar todos los datos
            window.location.href = 'orders_list.html'; // Redirigir a la lista de pedidos
        })
        .catch(error => console.error('Error al guardar el pedido:', error));
    }

    // Función para limpiar el localStorage
    function limpiarLocalStorage() {
        localStorage.removeItem('carrito');
        localStorage.removeItem('clienteSeleccionado');
        localStorage.removeItem('zonaSeleccionada');
        localStorage.removeItem('orderId'); // Si deseas eliminar el ID del pedido para un nuevo ciclo
    }
});
