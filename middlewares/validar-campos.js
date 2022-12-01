const { request, response } = require('express')
const { validationResult } = require('express-validator');


const validarCampos = (req = request, res = response, next) => {

    //errores generados por los middlewares del express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors)
    }

    next();
}


module.exports = {
    validarCampos
}