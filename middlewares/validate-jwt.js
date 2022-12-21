const { request, response } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETKEY);
        req.uid = uid;

        const user = await User.findById(uid);
        if(!user){
            return res.status(401).json({
                msg: 'Token no válido - usuario cno existe en db'
            })
        }

        if(!user.state){
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado false'
            })
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }


}

module.exports = {
    validateJWT
}