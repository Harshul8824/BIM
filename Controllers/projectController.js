const Project = require("../Model/ProjectModel");

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
  const { title, description, startDate, endDate, status, client, manager } =
    req.body;
  const project = await Project.create({
    title,
    description,
    startDate,
    endDate,
    status,
    client,
    manager,
  });
  res.status(201).json({
    status: "success",
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
