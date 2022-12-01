

const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { productoExiste, existeCategoriaNombre, productoExistePorId } = require('../helpers/db-validators');
const { validarJWT, esAdminRole, validarCampos } = require('../middlewares');

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'El id no es un mongoId').isMongoId(),
    check('id').custom(productoExistePorId),
    validarCampos,
], obtenerProducto)

router.post('/', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(productoExiste),
    check('categoria', 'La categoria es requerida').not().isEmpty(),
    check('categoria').custom(existeCategoriaNombre),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es un mongoId').isMongoId(),
    check('id').custom(productoExistePorId),
    validarCampos,
], actualizarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es un mongoId').isMongoId(),
    check('id').custom(productoExistePorId),
    validarCampos,
], borrarProducto)







module.exports = router;