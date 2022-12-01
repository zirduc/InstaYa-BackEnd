const { response, request } = require("express");
const { subirArchivo } = require("../helpers");
const path = require('path');
const fs = require('fs')
const { v2: cloudinary } = require('cloudinary')
cloudinary.config(process.env.CLOUDINARY_URL);

const { Usuario, Producto } = require('../models')

const cargarArchivo = async (req = request, res = response) => {

    try {
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({ msg })
    }

}

const actualizarImagen = async (req = request, res = response) => {

    const { coleccion, id } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el ${id}` })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el ${id}` })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    try {

        //limpiar imagenes previas
        if (modelo.img) {
            //hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        const nombre = await subirArchivo(req.files, undefined, coleccion)
        modelo.img = nombre;
        await modelo.save();
        return res.json(modelo)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Revisar logs del servidor'
        })
    }

}

const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { coleccion, id } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el ${id}` })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el ${id}` })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    try {

        //limpiar imagenes previas
        if (modelo.img) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id, extension] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;
        await modelo.save();
        return res.json(modelo)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Revisar logs del servidor'
        })
    }

}

const mostrarImagen = async (req = request, res = response) => {
    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el ${id}` })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el ${id}` })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    try {

        //limpiar imagenes previas
        if (modelo.img) {
            //hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen)
            }
        }
        const pathImagen = path.join(__dirname, '../assets', 'no-image.jpg')
        return res.sendFile(pathImagen)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Revisar logs del servidor'
        })
    }

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}