const User = require("../Model/userModel");
const catchAsync = require("../Utils/catchAsync");

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role, client, manager } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
    client,
    manager,
  });

  res.status(201).json({
    status: "success",
    message: "User Created Succesfully",
    data: user,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(201).json({
    status: "success",
    data: users,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  await User.findByIdAndDelete(id);
  res.status(201).json({
    status: "success",
    message: "User deleted successfully",
  });
});
