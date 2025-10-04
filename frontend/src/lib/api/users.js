// Mock data for standalone frontend
let mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'customer',
    createdAt: new Date().toISOString()
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userAPI = {
  // Get all users
  getAllUsers: async () => {
    await delay(500);
    return {
      data: {
        status: 'success',
        data: mockUsers
      }
    };
  },
  
  // Get user by ID
  getUser: async (id) => {
    await delay(300);
    const user = mockUsers.find(u => u._id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      data: {
        status: 'success',
        data: user
      }
    };
  },
  
  // Create new user
  createUser: async (userData) => {
    await delay(800);
    const newUser = {
      _id: String(mockUsers.length + 1),
      ...userData,
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return {
      data: {
        status: 'success',
        message: 'User Created Successfully',
        data: newUser
      }
    };
  },
  
  // Update user
  updateUser: async (id, userData) => {
    await delay(600);
    const userIndex = mockUsers.findIndex(u => u._id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return {
      data: {
        status: 'success',
        message: 'User updated successfully',
        data: mockUsers[userIndex]
      }
    };
  },
  
  // Delete user
  deleteUser: async (id) => {
    await delay(400);
    const userIndex = mockUsers.findIndex(u => u._id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    mockUsers.splice(userIndex, 1);
    return {
      data: {
        status: 'success',
        message: 'User deleted successfully'
      }
    };
  },
};

