import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

const CreateProject = ({ onProjectCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    clientName: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate || !formData.budget || !formData.clientName) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newProject = {
        id: Date.now().toString(),
        ...formData,
        budget: parseFloat(formData.budget),
        status: 'active',
        createdAt: new Date().toISOString(),
        progressEntries: []
      };

      onProjectCreated(newProject);
      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        clientName: ''
      });

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
          <p className="text-gray-600">Fill in the details to create a new construction project</p>
        </Card.Header>

        <Card.Body>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">Project created successfully!</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
              />

              <Input
                label="Client Name"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
                required
              />
            </div>

            <Input
              label="Project Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the project details"
              required
            />

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

            <Input
              label="Budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter project budget"
              required
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="flex-1"
              >
                {loading ? 'Creating Project...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default CreateProject;
