const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "reportapp");
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    console.log(req.user);
    if (req.user.role !== "admin") {
      res.status(401).send();
      return;
    }
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate!" });
  }

  //   next();
};

module.exports = authAdmin;
