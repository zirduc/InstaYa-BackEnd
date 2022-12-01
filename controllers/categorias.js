
const { request, response } = require('express');
const { isValidObjectId, trusted } = require('mongoose');
const { Categoria } = require('../models')

const crearCategoria = async (req, res) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);

}

const obtenerCategorias = async (req = request, res = response) => {
    const { desde = 0, limite = 5 } = req.query;


    try {
        const [categorias, total] = await Promise.all([
            Categoria.find({ estado: true })
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('usuario', 'nombre')
                .lean(),
            Categoria.countDocuments({ estado: true })
        ])

        if (categorias.length === 0) {
            return res.status(200).json({
                msg: 'No hay categorias aun'
            })
        }

        return res.status(200).json({
            categorias,
            total
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Revise los logs'
        })
    }
}

const obtenerCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    try {
        const categoria = await Categoria.findById(id)
            .populate('usuario', 'nombre')
            .lean();
        if (!categoria) {
            return res.status(200).json({
                msg: 'La categoría no existe'
            })
        }

        return res.status(200).json(categoria);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Revisar logs del servidor'
        })
    }
}

const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const { nombre = '' } = req.body;
    const uid = req.usuario;

    try {
        const categoria = await Categoria.findByIdAndUpdate(id, {
            nombre: nombre.toUpperCase(),
            usuario: uid
        });

        if (categoria) {
            return res.status(200).json({
                msg: 'todo bien',
                categoria
            })

        }

        return res.status(200).json({
            msg: 'Categoria no existe',
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'revisar logs'
        })
    }
}

const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    try {

        const categoria = await Categoria.findByIdAndUpdate(id, {
            estado: false
        }).lean();

        if (!categoria) {
            return res.status(200).json({
                msg: 'Esta categoria no Existe'
            })
        }

        return res.status(200).json({
            msg: 'Categoria borrada satisfactoriamente',
            categoria
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Revisar logs del servidor'
        })
    }

}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}