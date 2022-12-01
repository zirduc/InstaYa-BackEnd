
const { Router } = require('express');
const { check } = require('express-validator');


const { ordenesGetByUid, ordenesPost, ordenesGet, ordenesPut } = require('../controllers/ordenes');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles')
const { validarOrdenes } = require('../middlewares/validar-ordenes');
const { ordenExistePorId, estadoOrdenExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares');

const router = Router();

router.get('/todas', [
    validarJWT,
    esAdminRole,
], ordenesGet)

router.get('/lista', [
    validarJWT,
], ordenesGetByUid)

router.post('/', [
    validarJWT,
    validarOrdenes,
], ordenesPost)

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido de mongo').isMongoId(),
    check('id').custom(ordenExistePorId),
    check('estado').custom(estadoOrdenExiste),
    validarCampos
], ordenesPut)


module.exports = router;