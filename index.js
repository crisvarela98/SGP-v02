const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar JSON (necesario para recibir datos en POST requests)
app.use(express.json());

// Configurar las carpetas estáticas para servir archivos
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
    setHeaders: function (res, path) {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/views', express.static(path.join(__dirname, 'views')));


// Ruta principal para servir el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Conexión a MongoDB Atlas sin `useNewUrlParser` ni `useUnifiedTopology`
const uri = "mongodb+srv://crisvarela98:8RhsLRfAy0UHpMlW@adminsgppanel.fwdca.mongodb.net/adminSGPpanel";
mongoose.connect(uri)
    .then(() => {
        console.log('Conectado a MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Error conectando a MongoDB:', error);
    });

// Importar las rutas
const clientesRoutes = require('./routes/clientes');
const productosRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');
const notasRoutes = require('./routes/notas');
const cartRoutes = require('./routes/cart');
const pedidosRoutes = require('./routes/pedidos');
const zonasRoutes = require('./routes/zonas');

app.use('/models/zonas', zonasRoutes);

// Usar las rutas
app.use('/models/cart', cartRoutes);
app.use('/models/pedidos', pedidosRoutes);
app.use('/models/productos', productosRoutes);
app.use('/models/notas', notasRoutes);
app.use('/models/auth', authRoutes);
app.use('/models/clientes', clientesRoutes);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT} - http://localhost:${PORT}`);
});
