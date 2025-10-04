import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userAPI } from '../lib/api/users';
import { projectAPI } from '../lib/api/projects';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Error from '../components/ui/Error';

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchProjects();
    fetchManagers();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getUser(id);
      const user = response.data.data;
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't pre-fill password
        role: user.role || 'customer'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAllProjects();
      setProjects(response.data.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      const managers = response.data.data.filter(user => user.role === 'manager');
      setManagers(managers);
    } catch (err) {
      console.error('Failed to fetch managers:', err);
    }
  };

  const handleProjectAssignment = async (projectId, managerId) => {
    try {
      await projectAPI.assignManager(projectId, managerId);
      // Refresh projects to show updated assignments
      fetchProjects();
    } catch (err) {
      setError(err.message || 'Failed to assign manager');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Remove empty password from update if not provided
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await userAPI.updateUser(id, updateData);
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600 mt-2">Update user information</p>
        </div>

        <Card>
          <Card.Body>
            {error && <Error message={error} className="mb-6" />}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
              
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
              
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password (leave blank to keep current)"
              />
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              {/* Project Assignment Section */}
              {formData.role === 'manager' && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Assignments</h3>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">{project.description}</p>
                          <p className="text-sm text-gray-500">Status: {project.status}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={project.manager || ''}
                            onChange={(e) => handleProjectAssignment(project._id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Manager</option>
                            {managers.map(manager => (
                              <option key={manager._id} value={manager._id}>
                                {manager.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No projects available</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/users')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? <Spinner size="sm" /> : 'Update User'}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default UserEdit;

