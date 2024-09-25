document.addEventListener('DOMContentLoaded', function () {
    displayClients();

    // Manejar la apertura y cierre del modal para nuevo cliente
    const newClientModal = document.getElementById('new-client-modal');
    const newClientButton = document.querySelector('.new-client-button');
    const closeModalButton = document.querySelector('.close-button');

    newClientButton.addEventListener('click', function() {
        newClientModal.style.display = "block";
    });

    closeModalButton.addEventListener('click', function() {
        newClientModal.style.display = "none";
    });

    // Manejar la creación de un nuevo cliente
    document.getElementById('new-client-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('client-name').value;
        const storeName = document.getElementById('store-name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const locality = document.getElementById('locality').value;
        const zone = document.getElementById('zone').value;

        // Enviar los datos a MongoDB
        fetch('/models/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, storeName, address, phone, email, locality, zone })
        })
        .then(response => response.json())
        .then(() => {
            displayClients();
            alert("Cliente cargado con éxito");
            document.getElementById('new-client-form').reset();
            newClientModal.style.display = "none"; // Cierra el modal
        })
        .catch(error => console.error('Error al guardar cliente:', error));
    });

    // Definir la función displayClients
    function displayClients(filterText = '') {
        fetch('/models/clientes')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                return response.json();
            })
            .then(clients => {
                const filteredClients = clients.filter(client =>
                    client.name.toLowerCase().includes(filterText.toLowerCase()) || 
                    client.address.toLowerCase().includes(filterText.toLowerCase())
                );

                const clientList = document.getElementById('client-list');
                clientList.innerHTML = '';
                filteredClients.forEach(client => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <div class="client-item">
                            <h3>${client.name} - ${client.email}</h3> 
                            <h4>${client.storeName}, ${client.address}, Tel: ${client.phone}</h4>
                            <div class="client-actions">
                                <button class="edit-button">Editar</button>
                                <button class="delete-button">Eliminar</button>
                                <button class="history-button">Ver Historial</button>
                            </div>
                        </div>
                    `;

                    listItem.querySelector('.edit-button').onclick = () => editClient(client);
                    listItem.querySelector('.delete-button').onclick = () => deleteClient(client._id);
                    listItem.querySelector('.history-button').onclick = () => showOrderHistory(client);

                    clientList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error al cargar los clientes:', error));
    }

    function editClient(client) {
        const newClientModal = document.getElementById('new-client-modal');
        newClientModal.style.display = "block";

        document.getElementById('client-name').value = client.name;
        document.getElementById('store-name').value = client.storeName;
        document.getElementById('address').value = client.address;
        document.getElementById('phone').value = client.phone;
        document.getElementById('email').value = client.email;
        document.getElementById('locality').value = client.locality;
        document.getElementById('zone').value = client.zone;

        document.getElementById('new-client-form').onsubmit = function(event) {
            event.preventDefault();

            const updatedClient = {
                name: document.getElementById('client-name').value,
                storeName: document.getElementById('store-name').value,
                address: document.getElementById('address').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                locality: document.getElementById('locality').value,
                zone: document.getElementById('zone').value
            };

            // Actualizar cliente en MongoDB
            fetch(`/models/clientes/${client._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedClient)
            })
            .then(() => {
                displayClients();
                alert("Cliente actualizado con éxito");
                newClientModal.style.display = "none"; // Cierra el modal
            })
            .catch(error => console.error('Error al actualizar el cliente:', error));
        };
    }

    function deleteClient(clientId) {
        if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            fetch(`/models/clientes/${clientId}`, {
                method: 'DELETE'
            })
            .then(() => {
                displayClients();
                alert("Cliente eliminado con éxito");
            })
            .catch(error => console.error('Error al eliminar el cliente:', error));
        }
    }

    // El historial de pedidos sigue dependiendo de localStorage por el momento.
    function showOrderHistory(client) {
        const historyModal = document.getElementById('history-modal');
        historyModal.style.display = "block";

        // Aquí se podría integrar MongoDB en el futuro para almacenar y cargar pedidos
        let orders = JSON.parse(localStorage.getItem('orders')) || [];

        const clientOrders = orders.filter(order => order.customer.id === client._id);

        const confirmedOrders = clientOrders.filter(order => order.status === 'confirmado');
        const savedOrders = clientOrders.filter(order => order.status === 'guardado');
        const pendingOrders = clientOrders.filter(order => order.status === 'pendiente');

        const orderHistoryList = document.getElementById('order-history-list');
        orderHistoryList.innerHTML = `
            <div class="order-section">
                <h3>Confirmados</h3>
                <ul>${confirmedOrders.map(order => `<li>Pedido ${order.id} - Fecha: ${order.date}</li>`).join('')}</ul>
            </div>
            <div class="order-section">
                <h3>Guardados</h3>
                <ul>${savedOrders.map(order => `<li>Pedido ${order.id} - Fecha: ${order.date}</li>`).join('')}</ul>
            </div>
            <div class="order-section">
                <h3>Pendientes</h3>
                <ul>${pendingOrders.map(order => `<li>Pedido ${order.id} - Fecha: ${order.date}</li>`).join('')}</ul>
            </div>
            <button class="go-to-orders-button">Ver todos los pedidos</button>
        `;

        document.querySelector('.go-to-orders-button').onclick = () => {
            window.location.href = '/views/order_list.html';
        };
    }

    // Cerrar el modal de historial
    document.querySelector('.close-history-button').addEventListener('click', function() {
        const historyModal = document.getElementById('history-modal');
        historyModal.style.display = "none";
    });

    // Filtrar clientes al escribir en el buscador
    document.getElementById('search-input').addEventListener('input', function() {
        displayClients(this.value);
    });
});
