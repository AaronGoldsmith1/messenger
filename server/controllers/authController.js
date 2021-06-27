const { User } = require("../../db/models");
const jwt = require("jsonwebtoken");

const jwtCookieOptions = {
  httpOnly: true,
  maxAge: 86400000,
  sameSite: "strict",
  secure: true,
};

async function registerUser (req, res, next) {
  try {
    // expects {username, email, password} in req.body
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username, password, and email required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.create(req.body);

    const token = jwt.sign(
      { id: user.dataValues.id },
      process.env.SESSION_SECRET,
      { expiresIn: 86400 }
    );

    res.cookie("token", token, jwtCookieOptions);

    res.json({
      ...user.dataValues,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(401).json({ error: "User already exists" });
    } else if (error.name === "SequelizeValidationError") {
      return res.status(401).json({ error: "Validation error" });
    } else next(error);
  }
};

async function loginUser (req, res, next) {
  try {
    // expects username and password in req.body
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username and password required" });

    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      console.log({ error: `No user found for username: ${username}` });
      res.status(401).json({ error: "Wrong username and/or password" });
    } else if (!user.correctPassword(password)) {
      console.log({ error: "Wrong username and/or password" });
      res.status(401).json({ error: "Wrong username and/or password" });
    } else {
      const token = jwt.sign(
        { id: user.dataValues.id },
        process.env.SESSION_SECRET,
        { expiresIn: 86400 }
      );

      res.cookie("token", token, jwtCookieOptions);

      res.json({
        ...user.dataValues,
      });
    }
  } catch (error) {
    next(error);
  }
};

function logoutUser (req, res, next) {
  res.clearCookie("token");
  res.sendStatus(204);
};

 function getUser (req, res, next) {
  if (req.user) {
    return res.json(req.user);
  } else {
    return res.json({});
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
}