
const {Router} = require('express');
const { check } = require('express-validator');
const { addCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categories');
const { isValidCategoryId } = require('../helpers/db-validators');
const { isAdmin } = require('../middlewares');

const { validateFields } = require('../middlewares/validate');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();
//obtener todas las caegorias - publico
router.get('/', getCategories);
//obtener una caregoria por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidCategoryId),
    validateFields
],getCategoryById);
//crear una caregoria - cualquiera con token
router.post('/',[
    validateJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    validateFields
],addCategory);
//actualizar una categoria - cualquiera con token
router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidCategoryId),
    check('name','El nombre es obligatorio').not().isEmpty(),
    validateFields
],updateCategory);
//borrar una categoria admin
router.delete('/:id',[
    validateJWT,
    isAdmin,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidCategoryId),
    validateFields
],deleteCategory);




module.exports = router;