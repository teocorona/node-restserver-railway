const jwt = require('jsonwebtoken')

const createJWT = (uid = '') => {
    return new Promise ( (resolve, reject) => {
        const payload = {uid};
        jwt.sign(payload, process.env.SECRETKEY,{
            expiresIn: '24h'
        }, (err, token) => {
            if(err){
                console.log(err)
                reject('No se pudo generar el token')
            } else {
                resolve(token)
            }
        })

    })

}


module.exports={
    createJWT
}