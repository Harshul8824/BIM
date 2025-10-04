const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Project",
  },
  client: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  manager: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },

  FivedayCost: {
    type: Number,
    required: true,
  },
  laboursWorked: {
    type: Number,
    required: true,
  },
  actualMaterialUsedToday: {
    type: String,
    required: true,
    //User will write it from frontend
  },
  workCompletedToday: {
    type: Number,
    required: true,
    //for specific day in percent
  },
  totalWorkCompleted: {
    type: Number,
    //for specific day in percent
  },
  externalDelay: {
    type: Number,
    required: true,
  },
  internalDelay: {
    type: Number,
    required: true,
  },
  matericalCostIndays: {
    type: Number,
    required: true,
  },
});

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
