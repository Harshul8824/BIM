import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../lib/api/projects';
import { userAPI } from '../lib/api/users';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Error from '../components/ui/Error';

const ProjectForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [managers, setManagers] = useState([]);
  const [assets, setAssets] = useState([{ name: '', quantity: '', unit: '', cost: '' }]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectType: 'residential',
    startDate: '',
    endDate: '',
    budget: '',
    location: '',
    manager: ''
  });

  React.useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      const managers = response.data.data.filter(user => user.role === 'manager');
      setManagers(managers);
    } catch (err) {
      console.error('Failed to fetch managers:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssetChange = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index][field] = value;
    setAssets(newAssets);
  };

  const addAsset = () => {
    setAssets([...assets, { name: '', quantity: '', unit: '', cost: '' }]);
  };

  const removeAsset = (index) => {
    if (assets.length > 1) {
      const newAssets = assets.filter((_, i) => i !== index);
      setAssets(newAssets);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const projectData = {
        ...formData,
        budget: parseFloat(formData.budget),
        assets: assets.filter(asset => asset.name && asset.quantity && asset.unit && asset.cost),
        status: 'pending'
      };
      
      await projectAPI.createProject(projectData);
      navigate('/projects');
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Construction Project</h1>
          <p className="text-gray-600 mt-2">Fill in the details of your construction project</p>
        </div>

        <Card>
          <Card.Body>
            {error && <Error message={error} className="mb-6" />}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Project Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Project Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  required
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Type
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="infrastructure">Infrastructure</option>
                  </select>
                </div>
              </div>

              <Input
                label="Project Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what you want to build"
                required
              />

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Project location"
                  required
                />
                
                <Input
                  label="Budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Total budget"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
                
                <Input
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Manager Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Project Manager
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a manager</option>
                  {managers.map(manager => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Assets Section */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Required Assets</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addAsset}
                  >
                    Add Asset
                  </Button>
                </div>

                {assets.map((asset, index) => (
                  <div key={index} className="grid md:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <Input
                      label="Asset Name"
                      value={asset.name}
                      onChange={(e) => handleAssetChange(index, 'name', e.target.value)}
                      placeholder="e.g., Cement, Steel"
                      required
                    />
                    <Input
                      label="Quantity"
                      type="number"
                      value={asset.quantity}
                      onChange={(e) => handleAssetChange(index, 'quantity', e.target.value)}
                      placeholder="100"
                      required
                    />
                    <Input
                      label="Unit"
                      value={asset.unit}
                      onChange={(e) => handleAssetChange(index, 'unit', e.target.value)}
                      placeholder="bags, tons, pieces"
                      required
                    />
                    <Input
                      label="Cost"
                      type="number"
                      value={asset.cost}
                      onChange={(e) => handleAssetChange(index, 'cost', e.target.value)}
                      placeholder="10000"
                      required
                    />
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeAsset(index)}
                        disabled={assets.length === 1}
                        className="w-full"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/projects')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? <Spinner size="sm" /> : 'Create Project'}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ProjectForm;




