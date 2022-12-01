const { request, response, } = require('express');
const bcryptjs = require('bcryptjs');
const generarJWT = require('../helpers/generarJWT')

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    // const usuarios = await Usuario.find({ estado: true })
    //     .skip(desde)
    //     .limit(limite);

    // const total = await Usuario.countDocuments({ estado: true })

    const [usuariosActivos, usuariosInactivos, total] = await Promise.all([
        Usuario.find({ estado: true })
            .skip(Number(desde))
            .limit(Number(limite)),
        Usuario.find({ estado: false }),
        Usuario.countDocuments({ estado: true })
    ])

    res.json({
        total,
        usuariosActivos,
        usuariosInactivos
    });
}

const usuariosPost = async (req = request, res = response) => {

    try {
        const { nombre, correo, password, rol } = req.body;

        const usuario = new Usuario({ nombre, correo, password, rol });

        //encryptar la constraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        //generar token
        const token = await generarJWT(usuario._id);

        //guardar en base de datos
        await usuario.save();

        return res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            MSG: 'Revisar logs del servidor'
        })
    }

}

const usuariosPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //todo validar contra base de datos
    if (password) {
        const salt = bcryptjs.genSaltSync();

        resto.password = bcryptjs.hashSync(password, salt);

    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;

    //Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioAutenticado = req.usuario;
    res.json({ usuario, usuarioAutenticado });
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'Patch api - controlador'
    });
}

const usuariosGetById = async (req = request, res = response) => {

    const { id } = req.params;
    try {
        const usuario = await Usuario.findById(id);
        return res.status(200).json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Revisar logs del servidor' })
    }
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch,
    usuariosGetById
}