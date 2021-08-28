const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');


// Crear servidor
const app = express();

// Conectar a la Base de Datos
conectarDB();

// Habilitar Cors
// const opcionesCors = {
//     origin: process.env.FRONTEND_URL
// }
const opcionesCors = {
    origin:'ttps://nodesend-cliente-buqdh82mv-elibertosubias.vercel.app', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(opcionesCors));

// Puerto de la app
const port = process.env.PORT || 4000;

// Habilitar leer los valores de un body
app.use( express.json() );

// Habilitar carpeta publica
app.use( express.static('uploads') );

// Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})