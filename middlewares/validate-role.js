const { request, response } = require("express");

const isAdmin = (req = request, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Se quiere verificar el role sin validar antes el token",
    });
  }
  const { role, name } = req.user;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} no es administrador`,
    });
  }

  next();
};

const haveRole = (...roles) => {
  return (req = request, res = response, next) => {
    console.log(roles);
    console.log(req.user.role);
    if (!req.user) {
      return res.status(500).json({
        msg: "Se quiere verificar el role sin validar antes el token",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: "No tiene el rol necesario para hacer esta accion",
      });
    }
    next();
  };
};

module.exports = {
  isAdmin,
  haveRole,
};
