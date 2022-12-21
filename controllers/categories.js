const { request, response } = require("express");
const { Category, User } = require("../models");

const getCategories = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const [total, categories] = await Promise.all([
    Category.count({ state: true }),
    Category.find({ state: true })
      .skip(Number(from))
      .limit(Number(limit))
      .populate("user", "name"),
  ]);
  res.json({
    total,
    categories,
  });
};

const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", "name");
  res.json({
    category,
  });
};

// const getCategoryByName = async (req = request, res = response) => {
//   try {
//     const { name } = req.query;
//     const category = await Category.findOne({name});
//     res.json({
//       category
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(404).json({
//       msg: "Error. Hable con el administrador - no se encontro la categoria nombre",
//     });
//   }
// };

const addCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({ name });
  if (categoryDB) {
    return res.status(400).json({
      msg: `La categoria ${name}, ya existe`,
    });
  }
  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);

  //guardar en db
  await category.save();
  res.status(201).json(category);
};

const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, state, user, ...rest } = req.body;
  rest.name = rest.name.toUpperCase();
  const name = rest.name;
  const categoryDB = await Category.findOne({ name });
  console.log(categoryDB);
  if (categoryDB) {
    return res.status(400).json({
      msg: `La categoria ${rest.name}, ya existe`,
    });
  }
  rest.user = req.user._id;
  const category = await Category.findByIdAndUpdate(id, rest, {
    new: true,
  }).populate("user", "name");
  res.json(category);
};

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(
    id,
    { state: false, user: req.user._id },
    { new: true }
  ).populate("user", "name");
  res.json(category);
};

module.exports = {
  getCategories,
  getCategoryById,
  // getCategoryByName,
  addCategory,
  updateCategory,
  deleteCategory,
};
