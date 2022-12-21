const { response, request, json } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { createJWT } = require("../helpers/create-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Usuario o Password incorrectos - correo",
      });
    }
    if (!user.state) {
      return res.status(400).json({
        msg: "Usuario o Password incorrectos - deshabilitado",
      });
    }
    const passwordOk = bcryptjs.compareSync(password, user.password);
    if (!passwordOk) {
      return res.status(400).json({
        msg: "Usuario o Password incorrectos - password",
      });
    }
    const token = await createJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error. Hable con el administrador - no se pudo hacer el login",
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const {id_token} = req.body;

  try {
    const {name, email, img} = await googleVerify(id_token);
    
    let user = await User.findOne({email});

    if(!user){
      const data = {
        name,
        email,
        password: '***',
        img,
        google: true,
      }
      user = new User(data);
      await user.save();
    }

    if(!user.state){
      return res.status(401).json({
        msg: "Error. Hable con el administrador - usuario bloquedo",
      });
    }

    const token = await createJWT(user.id);

    return res.status(200).json({
      user,
      token
    });
   
  } catch (error) {
    return res.status(400).json({
      msg: "El token no se pudo verificar",
    });
  }

}

module.exports = {
  login,
  googleSignIn,
};
