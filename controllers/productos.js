const { request, response } = require('express');
const { Producto, Categoria } = require('../models');


const crearProducto = async (req = request, res = response) => {

    const { _id: uid } = req.usuario;

    const { categoria = '', ...data } = req.body;
    console.log(data);
    try {
        const idCategoria = await Categoria.findOne({ nombre: categoria.toUpperCase() }).select('_id');
        const producto = new Producto(data);

        producto.usuario = uid;
        producto.categoria = idCategoria;
        await producto.save();
        return res.status(201).json({
            msg: 'El producto ha sido creado',
            producto
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Revisar logs de consola' })
    }

}

const obtenerProductos = async (req = request, res = response) => {

    try {
        const productos = await Producto.find({ estado: true }).select('-__v -estado ').lean();
        if (productos.length === 0) {
            return res.status(200).json({
                msg: 'No hay productos en la base de datos'
            })
        }

        return res.status(200).json(productos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Revisar los logs del servidor'
        })
    }
}

const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id).select('-__v ');
        return res.status(200).json(producto);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Revisar logs de consola'
        })
    }
}

const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id: uid } = req.usuario;
    const { _id, usuario, ...data } = req.body;

    try {

        if (data.nombre) {
            const nombreExiste = await Producto.findOne({ nombre: data.nombre });
            if (nombreExiste) {
                return res.status(400).json({
                    msg: 'Este nombre ya esta siendo utilizado'
                })
            }
        }

        if (data.categoria) {
            const categoriaDB = await Categoria.findOne({ nombre: data.categoria.toUpperCase() });
            if (categoriaDB) {
                data.categoria = categoriaDB._id;
            } else {

                return res.status(400).json({
                    msg: 'Esta categoria no existe'
                })
            }
        }

        const producto = await Producto.findByIdAndUpdate(id, {
            ...data,
            usuario: uid,
        }, { new: true });

        return res.status(200).json({
            msg: 'El producto fue actualizado',
            producto
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Revisar logs del servidor'
        })
    }
}

const borrarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id: uid } = req.usuario;

    try {
        const producto = await Producto.findByIdAndUpdate(id, { estado: false, usuario: uid }, { new: true });
        return res.status(200).json({
            msg: 'El producto ha sido eliminado',
            producto
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Revisar logs del servidor'
        })
    }
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}