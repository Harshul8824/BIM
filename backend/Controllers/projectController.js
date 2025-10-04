const Project = require("../Model/ProjectModel");
const catchAsync = require("../Utils/catchAsync");

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find();
  if (!projects) {
    res.status(401).json({
      status: "fail",
      message: "no projects found",
    });
  }
  res.status(201).json({
    status: "success",
    length: projects.length,
    data: projects,
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const project = await Project.findById(id);
  res.status(201).json({
    status: "success",
    data: project,
  });
});

exports.addProject = catchAsync(async (req, res, next) => {
  const { title, description, startDate, endDate, status, client, manager, cost, plannedLabour, plannedMaterial } =
    req.body;
  const project = await Project.create({
    title,
    description,
    startDate,
    endDate,
    status,
    client,
    manager,
    cost,
    plannedLabour,
    plannedMaterial,
  });
  res.status(201).json({
    status: "success",
    data: project,
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { title, description, startDate, endDate, status, client, manager, cost, plannedLabour, plannedMaterial } = req.body;
  const project = await Project.findByIdAndUpdate(
    id,
    { title, description, startDate, endDate, status, client, manager, cost, plannedLabour, plannedMaterial },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    message: "Project updated successfully",
    data: project,
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  await Project.findByIdAndDelete(id);
  res.status(204).json({
    status: "success",
  });
});
