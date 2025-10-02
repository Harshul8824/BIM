// Mock data for construction projects
let mockProjects = [
  {
    _id: '1',
    title: 'Residential Building Complex',
    description: 'Construction of a 5-story residential building with 20 apartments',
    projectType: 'residential',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    status: 'in progress',
    client: '1', // John Doe
    manager: '2', // Jane Smith
    budget: 2500000,
    location: 'Downtown District',
    assets: [
      { name: 'Cement', quantity: 500, unit: 'bags', cost: 15000 },
      { name: 'Steel Rods', quantity: 200, unit: 'tons', cost: 80000 },
      { name: 'Bricks', quantity: 10000, unit: 'pieces', cost: 25000 },
      { name: 'Sand', quantity: 100, unit: 'trucks', cost: 12000 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Commercial Office Building',
    description: 'Construction of a modern office building with parking facility',
    projectType: 'commercial',
    startDate: '2024-02-01',
    endDate: '2025-06-30',
    status: 'pending',
    client: '3', // Mike Johnson
    manager: '2', // Jane Smith
    budget: 5000000,
    location: 'Business District',
    assets: [
      { name: 'Cement', quantity: 800, unit: 'bags', cost: 24000 },
      { name: 'Steel Rods', quantity: 350, unit: 'tons', cost: 140000 },
      { name: 'Glass Panels', quantity: 200, unit: 'panels', cost: 50000 },
      { name: 'Elevator System', quantity: 2, unit: 'units', cost: 200000 }
    ],
    createdAt: new Date().toISOString()
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const projectAPI = {
  // Get all projects
  getAllProjects: async () => {
    await delay(500);
    return {
      data: {
        status: 'success',
        data: mockProjects
      }
    };
  },
  
  // Get project by ID
  getProject: async (id) => {
    await delay(300);
    const project = mockProjects.find(p => p._id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return {
      data: {
        status: 'success',
        data: project
      }
    };
  },
  
  // Get projects by client
  getProjectsByClient: async (clientId) => {
    await delay(400);
    const clientProjects = mockProjects.filter(p => p.client === clientId);
    return {
      data: {
        status: 'success',
        data: clientProjects
      }
    };
  },
  
  // Create new project
  createProject: async (projectData) => {
    await delay(800);
    const newProject = {
      _id: String(mockProjects.length + 1),
      ...projectData,
      createdAt: new Date().toISOString()
    };
    mockProjects.push(newProject);
    return {
      data: {
        status: 'success',
        message: 'Project Created Successfully',
        data: newProject
      }
    };
  },
  
  // Update project
  updateProject: async (id, projectData) => {
    await delay(600);
    const projectIndex = mockProjects.findIndex(p => p._id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    mockProjects[projectIndex] = { ...mockProjects[projectIndex], ...projectData };
    return {
      data: {
        status: 'success',
        message: 'Project updated successfully',
        data: mockProjects[projectIndex]
      }
    };
  },
  
  // Delete project
  deleteProject: async (id) => {
    await delay(400);
    const projectIndex = mockProjects.findIndex(p => p._id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    mockProjects.splice(projectIndex, 1);
    return {
      data: {
        status: 'success',
        message: 'Project deleted successfully'
      }
    };
  },
  
  // Assign manager to project
  assignManager: async (projectId, managerId) => {
    await delay(500);
    const projectIndex = mockProjects.findIndex(p => p._id === projectId);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    mockProjects[projectIndex].manager = managerId;
    return {
      data: {
        status: 'success',
        message: 'Manager assigned successfully',
        data: mockProjects[projectIndex]
      }
    };
  }
};




