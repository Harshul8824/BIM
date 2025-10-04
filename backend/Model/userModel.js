const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please tell us your email!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please tell us your password!"],
  },
  role: {
    type: String,
    enum: ["customer", "manager"],
    default: "customer",
  },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
