
const { request, response } = require('express');
const { compareSync } = require('bcryptjs');
const Usuario = require('../models/usuario');
const generarJWT = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {
        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Este correo no existe'
            })
        }

        //si sigue activo en la base de datos
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Este Usuario no esta activo, hable con el administrador'
            })
        }

        // Verificar la contraseña
        const verificacionContraseña = compareSync(password, usuario.password);
        if (!verificacionContraseña) {
            return res.status(400).json({
                msg: 'La contraseña no es valida'
            })
        }

        // Generar el jwt
        const token = await generarJWT(usuario.id);
        return res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salio mal, hable con el administrador'
        })
    }

}

const googleSingIn = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //crearlo
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario en base de datos 
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar el jwt
        const token = await generarJWT(usuario.id);

        return res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: 'El token no se pudo verificar'
        })
    }

}


module.exports = {
    login,
    googleSingIn
}