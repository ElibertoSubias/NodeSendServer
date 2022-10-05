const Enlaces = require('../models/Enlaces');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

exports.agregarDireccion = async (req, res, next) =>  {

    const configuracionMulter = {
        limits: {fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            },
            // fileFilter: (req, file, cb) => {
            //     if(file.mimetype === "application/pdf") {
            //         return cb(null, true);
            //     }
            // }
        })
    };

    const upload = multer(configuracionMulter).single('archivo');

    upload( req, res, async (error) => {
        // console.log(req.file);

        if(!error) {
            res.json({archivo: req.file.filename});
        } else {
            console.log(error);
            return next();
        }
    });
}

exports.eliminarDireccion = async (req, res, next) =>  {
    try {
        const { archivo } = req.params;
        fs.unlinkSync(__dirname+`/../uploads/${archivo}`);
        res.json();
    } catch (error) {
        console.log(error);
    }
}

// Descaga archivo
exports.modificarDireccion = async (req, res, next) => {

    const { archivo } = req.params;
    // Obtiene el enlace
    const enlace = await Enlaces.findOne({ nombre : archivo });

    // console.log(enlace);

    // console.log("descagando");
    const archivoDescarga = __dirname + '/../uploads/' + archivo;

    res.download(archivoDescarga);

    // Eliminar el archivo y la entrada de la BD
    // Si las descargas son iguales a 1 - Borrar la entrada y borrar el archivo
    const { descargas, nombre } = enlace;

    if(descargas === 1) {

        // Eliminar el archivo
        req.archivo = nombre;

        // Eliminar la entrada de la bd
        await Enlaces.findOneAndRemove(enlace.id);
        next();

    } else {
        // Si las descargas son > a 1 - Restar 1
        enlace.descargas--;
        await enlace.save();
    }
}
