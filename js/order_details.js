document.addEventListener('DOMContentLoaded', function() {
    const orderDetails = document.getElementById('order-details');
    const totalPriceElement = document.getElementById('total-price');
    const customerInfoContainer = document.getElementById('customer-info');
    const saveOrderLink = document.getElementById('save-order-link');
    const confirmOrderLink = document.getElementById('confirm-order-link');

    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    let orderId = '00000001';
    let selectedClient = JSON.parse(localStorage.getItem('selectedClient')) || {};
    let selectedZone = localStorage.getItem('selectedZone') || '';

    // Ensure the cart is not empty
    if (cart.length === 0) {
        alert('No hay productos en el carrito.');
        window.location.href = 'productos.html'; // Redirect to products if the cart is empty
        return;
    }

    // Display customer info
    displayCustomerInfo(selectedClient, selectedZone);

    // Display the cart order details
    displayOrder();

    // Function to display customer information
    function displayCustomerInfo(client, zone) {
        if (!client.name) {
            alert('Por favor, selecciona primero un cliente.');
            window.location.href = 'zona.html'; // Redirect if no client is selected
            return;
        }

        customerInfoContainer.innerHTML = `
            <p><strong>Cliente:</strong> ${client.name} (${client.storeName})</p>
            <p><strong>Zona:</strong> ${zone}</p>
            <p><strong>Dirección:</strong> ${client.address}</p>
            <p><strong>Teléfono:</strong> ${client.phone}</p>
            <p><strong>Email:</strong> ${client.email}</p>
        `;
    }

    // Function to display the order details
    function displayOrder() {
        orderDetails.innerHTML = '';
        let subTotal = 0;

        const table = document.createElement('table');
        table.classList.add('order-table');

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

        cart.forEach((item, index) => {
            let bonificacionTexto = "N/A";
            let unidadesBonificadas = 0;
            const nuevoPrecio = item.precioUnitario.toFixed(2);

            // Calculate the bonus units if applicable
            if (item.descuento.includes('+')) {
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
                <td>${parseFloat(item.descuento)}%</td>
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

        // Handle quantity updates
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', updateCart);
        });

        // Handle item removal
        document.querySelectorAll('.delete-item-button').forEach(button => {
            button.addEventListener('click', deleteCartItem);
        });
    }

    // Function to update cart quantities
    function updateCart(event) {
        const index = event.target.dataset.index;
        const newValue = parseInt(event.target.value);

        cart[index].unidades = newValue;
        localStorage.setItem('carrito', JSON.stringify(cart));
        displayOrder(); // Refresh order details
    }

    // Function to delete an item from the cart
    function deleteCartItem(event) {
        const index = event.target.dataset.index;
        cart.splice(index, 1);

        localStorage.setItem('carrito', JSON.stringify(cart));
        displayOrder(); // Refresh order details
    }

    // Handle save order action
    saveOrderLink.addEventListener('click', function() {
        saveOrConfirmOrder('guardado');
    });

    // Handle confirm order action
    confirmOrderLink.addEventListener('click', function() {
        saveOrConfirmOrder('confirmado');
    });

    // Function to save or confirm an order
    function saveOrConfirmOrder(status) {
        const order = {
            id: orderId,
            customer: selectedClient,
            zone: selectedZone,
            date: new Date().toLocaleString(),
            status: status,
            cart: cart
        };

        // Increment order ID for the next order
        orderId = (parseInt(orderId) + 1).toString().padStart(8, '0');

        fetch('/models/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        .then(() => {
            alert(`Pedido ${status} con éxito.`);
            // Clear cart and client info after placing the order
            cart = [];
            selectedClient = {};
            selectedZone = '';
            localStorage.removeItem('carrito'); // Clear the cart from localStorage
            localStorage.removeItem('selectedClient'); // Clear the client info
            window.location.href = 'orders_list.html'; // Redirect to orders list
        })
        .catch(error => console.error('Error al guardar el pedido:', error));
    }
});
