const { Category, Role, User, Product } = require('../models');


const isValidRole = async (role = '') => {
  const roleExists = await Role.findOne({ role })
  if (!roleExists) {
    throw new Error(`${role} no existe en la base de datos`)
  }
}

const isUniqueEmail = async (email) => {
  const uniqueEmail = await User.findOne({ email });
  if (uniqueEmail) {
    throw new Error(`${email} ya esta registrado`)
  }
}

const isValidUserId = async (id) => {
  const isValid = await User.findById(id);
  if (!isValid) {
    throw new Error(`El usuario con el id:${id} no existe`)
  }
}

const isValidCategoryId = async (id) => {
  const isValid = await Category.findById(id);
  if (!isValid) {
    throw new Error(`La categoria con el id:${id} no existe`)
  }
}

const isValidProductId = async (id) => {
  const isValid = await Product.findById(id);
  if (!isValid) {
    throw new Error(`El producto con el id:${id} no existe`)
  }
}

const isValidColection = async (colection = '', colections = []) => {
  const included = colections.includes(colection);
  if(!included){
    throw new Error(`Colection ${colection} don't exist`)
  }
  return true;
}

module.exports = {
  isValidRole,
  isUniqueEmail,
  isValidUserId,
  isValidCategoryId,
  isValidProductId,
  isValidColection
}