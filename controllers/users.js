const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const usersGet = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  // const users = await User.find({state: true})
  //     .skip(Number(from))
  //     .limit(Number(limit));
  // const total = await User.count({state:true})
  const [total, users] = await Promise.all([
    User.count({ state: true }),
    User.find({ state: true }).skip(Number(from)).limit(Number(limit)),
  ]);
  res.json({
    total,
    users,
  });
};

const usersPost = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });
  //encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);
  //guardar en db
  await user.save();
  res.json(user);
};

const usersPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...rest } = req.body;
  if (password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }
  const user = await User.findByIdAndUpdate(id, rest);
  res.json(user);
};

const usersPatch = (req = request, res = response) => {
  res.json({
    msg: "patch API - controller",
  });
};

const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const { uid, user: userAuthenticated } = req;
  //borrar fisicamente
  // const user = await User.findByIdAndDelete(id);
  const user = await User.findByIdAndUpdate(id, { state: false });
  
  res.json({
    user,
    uid,
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};
