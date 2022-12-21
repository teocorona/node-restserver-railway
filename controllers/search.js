const { response, request } = require("express");
const { isValidObjectId } = require("mongoose");

const { User, Category, Product } = require('../models')

const allowedColections = [
    'user',
    'category',
    'product',
    'role'
]

const searchUsers = async (term = '', res = response) => {
    const isMongoID = isValidObjectId(term);
    if (isMongoID) {
        const user = await User.findById(term);
        return res.json({
            results: user ? [user] : []
        })
    }
    const regex = new RegExp(term, 'i')
    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    });
    return res.json({
        results: users
    })
}
const searchCategories = async (term = '', res = response) => {
    const isMongoID = isValidObjectId(term);
    if (isMongoID) {
        const category = await Category.findById(term);
        return res.json({
            results: category ? [category] : []
        })
    }
    const regex = new RegExp(term, 'i')
    const categories = await Category.find({name: regex, state: true });
    return res.json({
        results: categories
    })
}
const searchProducts = async (term = '', res = response) => {
    const isMongoID = isValidObjectId(term);
    if (isMongoID) {
        const product = await Product.findById(term).populate('category','name');
        return res.json({
            results: product ? [product] : []
        })
    }
    const regex = new RegExp(term, 'i')
    const products = await Product.find({
        $or: [{ name: regex }],
        $and: [{ state: true }]
    }).populate('category','name');
    return res.json({
        results: products
    })
}


const search = (req = request, res = response) => {

    const { colection, term } = req.params
    if (!allowedColections.includes(colection)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${allowedColections}`
        })
    }

    switch (colection) {
        case 'user':
            searchUsers(term, res);
            break;
        case 'category':
            searchCategories(term, res);
            break;
        case 'product':
            searchProducts(term, res);
            break;
        default:
            res.json({
                msg: 'esta busqueda no esta habilitada'
            })
            break;
    }

}


module.exports = {
    search
}