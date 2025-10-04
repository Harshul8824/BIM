const User = require("../Model/userModel");
const catchAsync = require("../Utils/catchAsync");
const sendEmail = require("../email");
const generateManagerEmail = require("../Utils/MailTemplate");

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  return res.status(201).json({
    status: "success",
    message: "User Created Succesfully",
    data: user,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  return res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.addClient = catchAsync(async(req, res , next)=>{
  const id = req.params.id;
  const user = await User.findById(id);
  if(!req.body.client){
    return res.status(401).json({
      status : "fail",
      message : "Client not Found"
    });
  }
  user.clients.push_back(req.body.client);
  await user.save();
  res.status(201).json({
    status : "success",
    message : "Client added succesfully"
  })
});

// Send message from client to project manager
exports.addManagerRequest = catchAsync(async(req, res, next) => {
  const { clientId, managerId, message, subject } = req.body;
  
  // Validate required fields
  if (!clientId || !managerId || !message) {
    return res.status(400).json({
      status: "fail",
      message: "Client ID, Manager ID, and message are required"
    });
  }

  try {
    // Find the client and manager
    const client = await User.findById(clientId);
    const manager = await User.findById(managerId);
    
    if (!client) {
      return res.status(404).json({
        status: "fail",
        message: "Client not found"
      });
    }
    
    if (!manager) {
      return res.status(404).json({
        status: "fail",
        message: "Manager not found"
      });
    }

    // Check if client has role 'customer' and manager has role 'manager'
    if (client.role !== 'customer') {
      return res.status(403).json({
        status: "fail",
        message: "Only clients can send messages to managers"
      });
    }

    if (manager.role !== 'manager') {
      return res.status(403).json({
        status: "fail",
        message: "Invalid manager role"
      });
    }

    // Generate email content using the template
    const emailContent = generateManagerEmail({
      name: client.name,
      email: client.email,
      message: message,
      subject: subject || "New Project Message",
      timestamp: new Date()
    });

    // Send email to manager
    await sendEmail(
      res,
      manager.email,
      subject || "New Project Message",
      emailContent.html,
      "Message sent to project manager successfully"
    );

  } catch (error) {
    console.error("Error in addManagerRequest:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal server error"
    });
  }
});



exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(201).json({
    status: "success",
    data: users,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password, role, client, manager } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    { name, email, password, role, client, manager },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: user,
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

// Get all managers
exports.getManagers = catchAsync(async (req, res, next) => {
  const managers = await User.find({ role: 'manager' });
  res.status(200).json({
    status: "success",
    data: managers,
  });
});
