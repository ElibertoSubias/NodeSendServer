const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variable.env'});

module.exports = (req, res, next) => {

    const authHeader = req.get('Authorization');

    if(authHeader){

        // Obtener Token
        const token = authHeader.split(' ')[1];

        //Comprobar el JWT
        try {
            const usuario = jwt.verify(token, process.env.SECRETA);
            req.usuario = usuario;
        } catch (error) {
            return res.status(401).json({ errores: "Usuario no autorizado." });
        }

    }

    return next();
}
