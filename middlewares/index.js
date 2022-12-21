const validateFields = require('./validate');
const validateRoles = require('./validate-role');
const validateJWT = require('./validate-jwt');


module.exports = {
    ...validateFields,
    ...validateRoles,
    ...validateJWT,
}