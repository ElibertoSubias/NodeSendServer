const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Direcciones = require('../models/Direcciones');
const Yonkes = require('../models/Yonkes');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');

exports.crearYonke = async (req, res, next) =>  {

    try {

        const errores = validationResult(req);
        if(!errores.isEmpty()) {
            return res.status(400).json({errores: errores.array()});
        }

        // Si el usuario esta autenticado
        if (req.usuario) {
            const usuario = await Usuario.findOne({ _id : req.usuario.id });

            if (usuario.yonke !== null) {
                return res.status(400).json({cod: 10, msj: "Ya cuenta con un yonke registrado."});
            }

            // Revisar si hay errores
            const errores = validationResult(req);
            if(!errores.isEmpty()) {
                return res.status(400).json({errores: errores.array()});
            }

            // Crear un objeto de Enlace
            const { nombre, telefono, calle, numero, colonia, descripcion } = req.body;

            const yonke = new Yonkes();
            const direccion = new Direcciones();

            direccion.calle = calle;
            direccion.numero = numero;
            direccion.colonia = colonia;
            direccion.descripcion = descripcion;

            const id_direccion = await direccion.save();

            if (id_direccion) {
                yonke.nombre = nombre;
                yonke.telefono = telefono;
                yonke.autor = req.usuario.id;
                yonke.direccion = id_direccion;

                const idYonke = await yonke.save();
                usuario.yonke = idYonke;
                await usuario.save();

                return res.json({ msg: `${yonke.nombre}` });

            }

        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Ocurrio un error al guardar la información."});
    }

}

exports.obtenerYonke = async (req, res, next) =>  {
    try {
        const { archivo } = req.params;
        fs.unlinkSync(__dirname+`/../uploads/${archivo}`);
        res.json();
    } catch (error) {
        console.log(error);
    }
}

exports.obtenerYonkes = async (req, res, next) =>  {
    try {
        const yonkes = await Yonkes.find({}).select('nombre telefono direccion -_id');
        res.json({ yonkes });
    } catch (error) {
        console.log(error);
        return res.status(400).json();
    }
}

// Descaga archivo
exports.modificarYonke = async (req, res, next) => {

    try {

        // Si el usuario esta autenticado
        if (req.usuario) {

            // Revisar si hay errores
            const errores = validationResult(req);
            if(!errores.isEmpty()) {
                return res.status(400).json({errores: errores.array()});
            }

            // Crear un objeto de Enlace
            const { nombre, telefono, calle, numero, colonia, descripcion } = req.body;

            const yonke = await Yonkes.findOne({ autor: req.usuario.id });

            if (yonke) {

                const direccion = await Direcciones.findOne({ _id: yonke.direccion });

                direccion.calle = calle;
                direccion.numero = numero;
                direccion.colonia = colonia;
                direccion.descripcion = descripcion;
                await direccion.save();

                yonke.nombre = nombre;
                yonke.telefono = telefono;
                await yonke.save();
                return res.json({ msg: `${yonke.nombre}` });

            }

        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Ocurrio un error al guardar la información."});
    }

}

exports.eliminarYonke = async (req, res, next) => {
    try {

        // Si el usuario esta autenticado
        if (req.usuario) {

            // Crear un objeto de Enlace
            const { id } = req.params;

            const usuario = await Usuario.findOne({ _id: req.usuario.id });

            const yonke = await Yonkes.findOne({ autor: req.usuario.id });
            const direccion = await Direcciones.findOne(yonke.direccion);

            if (yonke && yonke._id == id) {

                await Yonkes.findOneAndRemove(yonke.id);
                await Direcciones.findOneAndRemove(direccion.id);
                usuario.yonke = null;
                await usuario.save();
                return res.status(200).json({msj: "Yonke eliminado"});

            } else {
                return res.status(500).json({error: "Error al eliminar el yonke."});
            }

        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Ocurrio un error."});
    }
}
