
const { request, response } = require('express');
const orden = require('../models/orden');
const { Orden } = require('../models');


const ordenesGet = async (req = request, res = response) => {
    const { _id: uid } = req.usuario;

    try {
        const listaOrdenes = await Orden.find().lean();
        const ordenes = listaOrdenes.map(orden => {
            return {
                enviador: orden.usuario_enviador.nombre,
                receptor: orden.usario_receptor.nombre,
                seguimiento: orden._id,
                estado: orden.estado,
            }
        });
        return res.status(200).json(ordenes);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Mirar los logs de la consola - controlador'
        })
    }
}

const ordenesGetByUid = async (req = request, res = response) => {

    const { _id: uid } = req.usuario;

    try {
        const listaOrdenes = await Orden.find({ uid }).lean();
        const ordenes = listaOrdenes.map(orden => {
            return {
                enviador: orden.usuario_enviador.nombre,
                receptor: orden.usario_receptor.nombre,
                seguimiento: orden._id,
                estado: orden.estado,
            }
        })

        return res.status(200).json(ordenes);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Mirar los logs de la consola - controlador'
        })
    }
}

const ordenesPost = async (req = request, res = response) => {

    const { _id: uid } = req.usuario;


    const {
        altura, apellido, apellidoRecibe,
        cedula, cedulaRecibe, comentarios,
        desde, direccionEnvio, direccionRecogida,
        hasta, largo, mercancia, nombre, nombreRecibe, peso
    } = req.body;

    const envio = {
        usuario_enviador: {
            nombre, apellido, cedula
        },
        usario_receptor: {
            nombre: nombreRecibe,
            apellido: apellidoRecibe,
            cedula: cedulaRecibe
        },
        disponibilidad_horaria: {
            desde, hasta
        },
        direcciones: {
            direccionEnvio, direccionRecogida
        },
        carga: {
            altura, largo, mercancia, peso
        },
        comentarios
    };

    try {

        const orden = new Orden(envio);
        orden.uid = uid;
        orden.estado = 'Guardado';
        await orden.save();
        return res.status(201).json(orden);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Mirar logs del servidor'
        })
    }

}

const ordenesPut = async (req = request, res = response) => {
    const { id = '' } = req.params;
    const { _id, uid, ...data } = req.body;
    const { _id: usuarioId } = req.usuario;


    try {
        const ordenActualizada = await orden.findByIdAndUpdate(id, {
            ...data,
        }, { new: true });
        return res.status(200).json({
            msg: `Orden ${id} actualizada correctamente`,
            orden: ordenActualizada
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Revisar logs del servidor'
        })
    }
}




module.exports = {
    ordenesPost,
    ordenesGetByUid,
    ordenesGet,
    ordenesPut
}