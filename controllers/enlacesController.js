const Enlaces = require('../models/Enlaces');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variable.env'});
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async (req, res, next) =>  {

    try {
        // Revisar si hay errores
        const errores = validationResult(req);
        if(!errores.isEmpty()) {
            return res.status(400).json({errores: errores.array()});
        }

        // Crear un objeto de Enlace
        const { nombre_original, nombre } = req.body;

        const enlace = new Enlaces();

        enlace.url = shortid.generate();
        enlace.nombre = nombre;
        enlace.nombre_original = nombre_original;

        // Si el usuario esta autenticado
        if(req.usuario) {
            const { password, descargas } = req.body;

            // Asignar a enlace el número de descargas
            if(descargas && !Number.isNaN(parseInt(descargas))) {
                enlace.descargas = parseInt(descargas);
            }

            // Asignar un password
            if(password) {
                const salt = await bcrypt.genSalt(10);
                enlace.password = await bcrypt.hash( password, salt );
            }

            // Asignar un autor
            enlace.autor = req.usuario.id;
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json();
    }

    // Almacenar en la BD
    try {
        await enlace.save();
        return res.json({ msg: `${enlace.url}` });
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Ocurrio un error al guardar la información."});
    }
}

// Obtiene un listado de todos los enlaces
exports.todosEnlaces = async (req, res) => {
    try {
        // Si el usuario esta autenticado
        if (req.usuario && req.usuario.email == process.env.ADMIN) {

            const enlaces = await Enlaces.find({}).select('url -_id');
            res.json({ enlaces });

        } else {
            return res.status(400).json();
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json();
    }
}

// Retorna si el enlace tiene password o no
exports.tienePassword = async (req, res, next) => {

    try {
        const { url } = req.params;

        // Verificar si existe el enlace
        const enlace = await Enlaces.findOne({ url });

        if(!enlace) {
            res.status(404).json({msg: 'Este enlace no existe'});
            return next();
        }

        if (enlace.password) {
            return res.json({ password: true, enlace: enlace.url});
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json();
    }

}

// Verifica si el password es correcto
exports.verificarPassword = async (req, res, next) => {

    try {
        const { url } = req.params;

        // Consultar por el enlace
        const enlace = await Enlaces.findOne({ url });

        const { password } = req.body;

        // Verificar el Password
        if (bcrypt.compareSync(password, enlace.password)) {
            // Descargar el archivo
            next();
        } else {
            return res.status(401).json({msg: 'Password incorrecto'})
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json();
    }

}

exports.obtenerEnlace = async (req, res, next) => {

    try {
        const { url } = req.params;

        // Verificar si existe el enlace
        const enlace = await Enlaces.findOne({ url });

        if(!enlace) {
            res.status(404).json({msg: 'Este enlace no existe'});
            return next();
        }

        // Si el enlace existe
        res.json({archivo: enlace.nombre, password: false});

        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json();
    }

}
