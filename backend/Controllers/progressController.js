const Progress = require("../Model/progressModel");
const catchAsync = require("../Utils/catchAsync");

exports.getAllProgress = catchAsync(async (req, res, next) => {
  const progress = await Progress.find().populate('project client manager');
  res.status(200).json({
    status: "success",
    length: progress.length,
    data: progress,
  });
});

exports.getProgress = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const progress = await Progress.findById(id).populate('project client manager');
  res.status(200).json({
    status: "success",
    data: progress,
  });
});

exports.getProgressByProject = catchAsync(async (req, res, next) => {
  const projectId = req.params.projectId;
  const progress = await Progress.find({ project: projectId }).populate('project client manager');
  res.status(200).json({
    status: "success",
    length: progress.length,
    data: progress,
  });
});

exports.addProgress = catchAsync(async (req, res, next) => {
  const { 
    project, 
    client, 
    manager, 
    description, 
    startDate, 
    endDate, 
    FivedayCost, 
    laboursWorked, 
    actualMaterialUsedToday, 
    workCompletedToday, 
    totalWorkCompleted, 
    externalDelay, 
    internalDelay, 
    matericalCostIndays 
  } = req.body;
  
  const progress = await Progress.create({
    project,
    client,
    manager,
    description,
    startDate,
    endDate,
    FivedayCost,
    laboursWorked,
    actualMaterialUsedToday,
    workCompletedToday,
    totalWorkCompleted,
    externalDelay,
    internalDelay,
    matericalCostIndays,
  });
  
  res.status(201).json({
    status: "success",
    message: "Progress added successfully",
    data: progress,
  });
});

exports.updateProgress = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { 
    project, 
    client, 
    manager, 
    description, 
    startDate, 
    endDate, 
    FivedayCost, 
    laboursWorked, 
    actualMaterialUsedToday, 
    workCompletedToday, 
    totalWorkCompleted, 
    externalDelay, 
    internalDelay, 
    matericalCostIndays 
  } = req.body;
  
  const progress = await Progress.findByIdAndUpdate(
    id,
    { 
      project, 
      client, 
      manager, 
      description, 
      startDate, 
      endDate, 
      FivedayCost, 
      laboursWorked, 
      actualMaterialUsedToday, 
      workCompletedToday, 
      totalWorkCompleted, 
      externalDelay, 
      internalDelay, 
      matericalCostIndays 
    },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    status: "success",
    message: "Progress updated successfully",
    data: progress,
  });
});

exports.deleteProgress = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  await Progress.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: "Progress deleted successfully",
  });
});
