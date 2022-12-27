 
const {Router} = require('express');
const { check } = require('express-validator');
const { loadFile, updateFile, getFile, updateFileCloudinary } = require('../controllers/uploads');
const { isValidColection } = require('../helpers');
const { validateFile } = require('../middlewares');

const { validateFields } = require('../middlewares/validate');

const router = Router();

router.post('/',validateFile, loadFile);
router.put('/:colection/:id',[
    validateFile,
    check('id', 'No es un ID válido').isMongoId(),
    check('colection').custom( c => isValidColection(c, ['users', 'products'])),
    validateFields
],updateFileCloudinary);
router.get('/:colection/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('colection').custom( c => isValidColection(c, ['users', 'products'])),
    validateFields
],getFile);

// router.post('/google',[
//     check('id_token', 'id_token es necesario').not().isEmpty(),
//     validateFields
// ], googleSignIn );





module.exports = router;