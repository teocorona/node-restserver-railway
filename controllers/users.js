const { response, request } = require('express');

const usersGet = (req = request, res = response) => {
    const queryParams = req.query;
    res.json({
        msg: "get API - controller",
        queryParams
    });
}
const usersPost = (req = request, res = response) => {
    const {nombre} = req.body
    res.json({
        msg: "post API - controller",
        nombre
    });
}
const usersPut = (req = request, res = response) => {
    const id = req.params.id
    res.json({
        msg: "put API - controller",
        id
    });
}
const usersPatch = (req = request, res = response) => {
    res.json({
        msg: "patch API - controller"
    });
}
const usersDelete = (req = request, res = response) => {
    res.json({
        msg: "delet API - controller"
    });
}



module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}