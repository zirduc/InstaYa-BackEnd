
const { request, response } = require('express');

const validarOrdenes = (req = request, res = response, next) => {

    try {
        const errors = {};
        const {
            altura, apellido, apellidoRecibe,
            cedula, cedulaRecibe, comentarios,
            desde, direccionEnvio, direccionRecogida,
            hasta, largo, mercancia, nombre, nombreRecibe, peso
        } = req.body;

        if (nombre.length === 0) {
            errors.nombre = 'El nombre es obligatorio'
        } else if (nombre.length < 3) {
            errors.nombre = 'El nombre debe tener mas de 3 caracteres'
        }

        if (apellido.length === 0) {
            errors.apellido = 'El apellido es obligatorio'
        } else if (apellido.length < 3) {
            errors.apellido = 'El apellido debe tener mas de 3 caracteres'
        }

        if (cedula.length === 0) {
            errors.cedula = 'La cedula es obligatoria'
        } else if (cedula.length < 3) {
            errors.cedula = 'La cedula debe tener mas de 3 caracteres'
        }


        if (altura.length === 0) {
            errors.altura = 'Obligatoria'
        }

        if (largo.length === 0) {
            errors.largo = 'Obligatorio'
        }

        if (peso.length === 0) {
            errors.peso = 'Obligatorio'
        }

        if (mercancia.length === 0) {
            errors.mercancia = 'Obligatorio'
        }
        if (nombreRecibe.length === 0) {
            errors.nombreRecibe = 'El nombre es obligatorio'
        } else if (nombreRecibe.length < 3) {
            errors.nombreRecibe = 'El nombre debe tener mas de 3 caracteres'
        }

        if (apellidoRecibe.length === 0) {
            errors.apellidoRecibe = 'El apellido es obligatorio'
        } else if (apellidoRecibe.length < 3) {
            errors.apellidoRecibe = 'El apellido debe tener mas de 3 caracteres'
        }

        if (cedulaRecibe.length === 0) {
            errors.cedulaRecibe = 'La cedula es obligatoria'
        } else if (cedulaRecibe.length < 3) {
            errors.cedulaRecibe = 'La cedula debe tener mas de 3 caracteres'
        }

        if (direccionEnvio.length === 0) {
            errors.direccionEnvio = 'El direccion es obligatorio'
        } else if (direccionEnvio.length < 6) {
            errors.direccionEnvio = 'El direccion debe tener mas de 6 caracteres'
        }

        if (direccionRecogida.length === 0) {
            errors.direccionRecogida = 'La direccion es obligatorio'
        } else if (direccionRecogida.length < 6) {
            errors.direccionRecogida = 'La direccion debe tener mas de 6 caracteres'
        }
        const formato = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/;

        if (!formato.test(desde) || !formato.test(hasta)) {
            errors.fecha = 'Formatos de fecha no validos'
        } else if (new Date(desde) >= new Date(hasta)) {
            errors.fecha = 'Los horarios no son validos'
        }


        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: 'Esta intentando hacer la petición sin una parte del body'
        })
    }

}

module.exports = {
    validarOrdenes
}