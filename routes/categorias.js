const { Router } = require('express');
const { check } = require('express-validator');
const { actualizarCategoria, crearCategoria, obtenerCategorias, obtenerCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

//obtener todas las categorias - publico
router.get('/', obtenerCategorias)

//obtener una categoria en particular - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria)

//crear categoria - privado - cualqueir rol con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria)

//actualizar un registro por id - privado
router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarCategoria)

//borrar una categoria solo admins, no borrar en db solo cambiar estado
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria)

module.exports = router;