const validateFields = require('./validate');
const validateRoles = require('./validate-role');
const validateJWT = require('./validate-jwt');
const validateFile = require('./validate-file');


module.exports = {
    ...validateFields,
    ...validateRoles,
    ...validateJWT,
    ...validateFile,
}