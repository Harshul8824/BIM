const mongoose = require("mongoose");
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a project title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a project description"],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a client"],
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a manager"],
  },
  description: {
    type: String,
    required: [true, "Please provide a project description"],
  },
  cost: {
    type: Number,
    required: true,
  },
  plannedLabour: {
    type: Number,
    required: true,
  },
  plannedMaterial: {},
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
