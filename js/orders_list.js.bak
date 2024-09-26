document.addEventListener('DOMContentLoaded', function () {
    // Sección para cargar y manejar pedidos desde MongoDB
    async function loadOrdersFromMongoDB() {
        try {
            const response = await fetch('/models/pedidos');
            const orders = await response.json();
            if (orders.length > 0) {
                displayOrders(orders);
            } else {
                showNoOrdersMessage();
            }
        } catch (error) {
            console.error('Error al cargar los pedidos desde MongoDB:', error);
        }
    }

    // Mostrar pedidos en la página
    function displayOrders(orders) {
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = ''; // Limpiar la lista antes de mostrar

        const filterStatus = document.getElementById('filter-status');
        const selectedStatus = filterStatus ? filterStatus.value : 'todos';

        const filteredOrders = orders.filter(order => {
            return selectedStatus === 'todos' || order.status === selectedStatus;
        });

        if (filteredOrders.length === 0) {
            showNoOrdersMessage();
            return;
        }

        filteredOrders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-info">
                    <p><strong>ID del Pedido:</strong> ${order.id}</p>
                    <p><strong>Cliente:</strong> ${order.customer ? order.customer.name : 'No disponible'}</p>
                    <p><strong>Fecha:</strong> ${order.date}</p>
                    <p><strong>Estado:</strong> ${order.status}</p>
                    <p><strong>Total Productos:</strong> ${order.cart.length}</p>
                </div>
                <div class="order-item-actions">
                    <button class="view-button" data-id="${order._id || order.id}">Ver</button>
                    <button class="cancel-button" data-id="${order._id || order.id}" ${order.status === 'cancelado' ? 'disabled' : ''}>Cancelar</button>
                </div>
            `;
            orderList.appendChild(orderItem);
        });

        attachEventListenersToButtons();
    }

    function attachEventListenersToButtons() {
        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', function (event) {
                const orderId = event.target.dataset.id;
                viewOrderDetails(orderId);
            });
        });

        document.querySelectorAll('.cancel-button').forEach(button => {
            button.addEventListener('click', function (event) {
                const orderId = event.target.dataset.id;
                cancelOrder(orderId);
            });
        });
    }

    // Mostrar un mensaje cuando no haya pedidos
    function showNoOrdersMessage() {
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = '<p>No hay pedidos registrados.</p>';
    }

    // Obtener detalles de un pedido
    async function viewOrderDetails(orderId) {
        try {
            const response = await fetch(`/models/pedidos/${orderId}`);
            const order = await response.json();
            if (order) {
                showOrderModal(order);
            }
        } catch (error) {
            console.error('Error al obtener detalles del pedido:', error);
        }
    }

    function showOrderModal(order) {
        const modal = document.getElementById('order-modal');
        const modalContent = document.getElementById('modal-order-details');

        modalContent.innerHTML = `
            <h2>Detalles del Pedido</h2>
            <p><strong>ID del Pedido:</strong> ${order.id}</p>
            <p><strong>Cliente:</strong> ${order.customer ? order.customer.name : 'No disponible'}</p>
            <p><strong>Fecha:</strong> ${order.date}</p>
            <p><strong>Estado:</strong> ${order.status}</p>
            <h3>Productos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.cart.map(item => `
                        <tr>
                            <td>${item.codigo}</td>
                            <td>${item.descripcion}</td>
                            <td>${item.unidades}</td>
                            <td>$${item.precioUnitario.toFixed(2)}</td>
                            <td>$${(item.precioUnitario * item.unidades).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Guardar la orden en el dataset del modal para luego descargar el PDF
        modal.dataset.currentOrder = JSON.stringify(order);
        modal.style.display = "flex";
    }

    // Cancelar un pedido
    async function cancelOrder(orderId) {
        try {
            await fetch(`/models/pedidos/${orderId}/cancelar`, { method: 'PUT' });
            loadOrdersFromMongoDB();
        } catch (error) {
            console.error('Error al cancelar el pedido:', error);
        }
    }

    // Cerrar modal
    function closeModal() {
        const modal = document.getElementById('order-modal');
        modal.style.display = "none";
    }

    const closeModalButton = document.querySelector('.close-button');
    closeModalButton.addEventListener('click', closeModal);

    // Filtro de estado
    const filterStatus = document.getElementById('filter-status');
    filterStatus.addEventListener('change', loadOrdersFromMongoDB);

    // Añadir evento de descarga de PDF usando `send_order1.js`
    document.getElementById('download-pdf').addEventListener('click', function () {
        const modal = document.getElementById('order-modal');
        const order = JSON.parse(modal.dataset.currentOrder);

        // Verificar si la función `downloadOrderPDF` está definida
        if (typeof window.downloadOrderPDF === 'function') {
            window.downloadOrderPDF(order); // Llamar a la función de `send_order1.js` para generar el PDF
        } else {
            console.error('La función downloadOrderPDF no está definida en send_order1.js');
            alert('Error: La función para generar el PDF no está disponible.');
        }
    });

    // Cargar pedidos (usar localStorage o MongoDB)
    const useMongoDB = true; // Cambia esto a `false` si deseas usar `localStorage` en lugar de MongoDB.
    if (useMongoDB) {
        loadOrdersFromMongoDB();
    } else {
        loadOrdersFromLocalStorage();
    }
});


