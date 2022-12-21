const { request, response } = require("express");
const { Product, Category } = require("../models");

const getProducts = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const [total, products] = await Promise.all([
        Product.count({ state: true }),
        Product.find({ state: true })
            .skip(Number(from))
            .limit(Number(limit))
            .populate("category", "name")
            .populate("user", "name"),
    ]);
    res.json({
        total,
        products,
    });
};

const getProductById = async (req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate("category", "name")
        .populate("user", "name");
    res.json({
        product,
    });
};

const addProduct = async (req = request, res = response) => {
    const categoryName = req.body.category?.toUpperCase() || "SIN CATEGORIA"
    const categoryDB = await Category.findOne({ name: categoryName });
    const category = categoryDB ? categoryDB : await new Category({ name: categoryName, user: req.user._id }).save();
    const name = req.body.name.toUpperCase();
    const productDB = await Product.find({ name, category: category._id });
    if (productDB.length>0) {
        return res.status(400).json({
            msg: `${name} ya existe en la categoria: ${category.name}`,
        });
    }
    const data = {
        name,
        description: req.body.description,
        price: req.body.price,
        category: category._id,
        user: req.user._id,
    };
    const product = new Product(data);
    await product.save();
    res.status(201).json(product);
};

const updateProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, state, user, ...rest } = req.body;
    if (rest.name){
        rest.name = rest.name.toUpperCase();
    }
    if (rest.category){
        const categoryName = rest.category.toUpperCase();
        const categoryDB = await Category.findOne({ name: categoryName });
        rest.category = categoryDB ? categoryDB : await new Category({ name: categoryName, user: req.user._id }).save();
    }
    const productDB = await Product.find({ name: rest.name, category:rest.category });
    if (productDB.length>0) {
        return res.status(400).json({
            msg: `${rest.name} ya existe en la categoria: ${rest.category.name}`,
        });
    }
    rest.user = req.user._id;
    const product = await Product
    .findByIdAndUpdate(id, rest, {new: true,})
    .populate("user", "name")
    .populate("category", "name");
    res.json(product);
};

const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
        id,
        { state: false, user: req.user._id },
        { new: true }
    ).populate("user", "name").populate("category", "name");
    res.json(product);
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};
