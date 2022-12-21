
const {Router} = require('express');
const { check } = require('express-validator');
const {
  usersGet,
  usersPut,
  usersPost,
  usersPatch,
  usersDelete,
} = require('../controllers/users');
const { isValidRole, isUniqueEmail, isValidUserId } = require('../helpers/db-validators');
const { haveRole, validateJWT, validateFields } = require('../middlewares');



const router = Router();

router.get('/', usersGet);
router.post('/',[
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('name', 'El nombre debe de contener entre 3 y 30 caracteres').isLength({max:30,min:3}),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  check('password', 'La contraseña debe de contener entre 6 y 30 caracteres').isLength({max:30,min:6}),
  check('email', 'El correo no es válido').isEmail(),
  check('email').custom( isUniqueEmail),
  // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('role').custom( isValidRole ),
  validateFields
], usersPost);
router.put('/:id',[
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(isValidUserId),
  check('role').custom( isValidRole ),
  validateFields
],usersPut);
router.patch('/', usersPatch);
router.delete('/:id',[
  validateJWT,
  // isAdmin,
  haveRole('ADMIN_ROLE', 'SALES_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(isValidUserId),
  validateFields
], usersDelete);




module.exports = router;