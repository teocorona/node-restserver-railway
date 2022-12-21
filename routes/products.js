const {Router} = require('express');
const { check } = require('express-validator');
const { addProduct, getProducts, getProductById, deleteProduct, updateProduct } = require('../controllers/products');
const { isValidProductId } = require('../helpers/db-validators');
const { isAdmin } = require('../middlewares');

const { validateFields } = require('../middlewares/validate');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();
//obtener todas las producto - publico
router.get('/', getProducts);
//obtener un producto por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidProductId),
    validateFields
],getProductById);
//crear un producto - cualquiera con token
router.post('/',[
    validateJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    validateFields
],addProduct);
//actualizar un producto - cualquiera con token
router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidProductId),
    validateFields
],updateProduct);
//borrar un producto admin
router.delete('/:id',[
    validateJWT,
    isAdmin,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidProductId),
    validateFields
],deleteProduct);




module.exports = router;