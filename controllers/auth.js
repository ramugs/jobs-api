const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide email, password");
  }
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ user: { user: user.name, id: user._id }, token });
};

module.exports = { register, login };
