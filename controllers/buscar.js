const { request, response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Categoria, Producto, Orden } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
    'ordenes'
];

const categoriasPermitidas = [
    'galletas',
    'ensalada',
    'cafe',
    'bebida fria',
    'pan'
]

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoId = isValidObjectId(termino);
    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.status(200).json({
            results: usuario ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    return res.status(200).json({
        results: usuarios
    });
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoId = isValidObjectId(termino);
    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.status(200).json({
            results: categoria ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const categoria = await Categoria.find({
        nombre: regex,
        estado: true
    });

    return res.status(200).json({
        results: categoria
    });
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoId = isValidObjectId(termino);
    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre -_id');
        return res.status(200).json({
            results: producto ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const producto = await Producto.find({
        nombre: regex,
        estado: true
    }).populate('categoria', 'nombre -_id');

    return res.status(200).json({
        results: producto
    });
}

const buscarOrdenes = async (termino = '', res = response) => {
    const esMongoId = isValidObjectId(termino);
    if (esMongoId) {
        const orden = await Orden.findById(termino);
        return res.status(200).json({
            results: orden ? [orden] : []
        });
    }

    return res.status(400).json({
        msg: `La orden con este #seguimiento: ${termino} no es valida`
    });
}


const buscar = async (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break


        case 'categorias':
            buscarCategorias(termino, res)
            break;

        case 'productos':
            buscarProductos(termino, res)
            break;

        case 'ordenes':
            buscarOrdenes(termino, res)
            break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            });
    }

}

module.exports = {
    buscar
}