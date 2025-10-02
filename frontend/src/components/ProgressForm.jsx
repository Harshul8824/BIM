import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

const ProgressForm = ({ project, onProgressAdded, onBack }) => {
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: new Date(),
    // Actual values (current implementation)
    cost: '',
    rawMaterials: '',
    internalDelay: '',
    externalDelay: '',
    labourCount: '',
    notes: '',
    // ML Model Required Fields
    plannedCost: '',
    plannedLabour: '',
    plannedMaterial: '',
    actualCost: '',
    actualLabour: '',
    actualMaterial: '',
    workCompletedPercent: '',
    externalDelay: '',
    internalDelay: '',
    delayLabel: ''
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

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (
      !formData.cost ||
      !formData.rawMaterials ||
      !formData.internalDelay ||
      !formData.externalDelay ||
      !formData.labourCount ||
      !formData.notes ||
      !formData.plannedCost ||
      !formData.plannedLabour ||
      !formData.plannedMaterial ||
      !formData.actualCost ||
      !formData.actualLabour ||
      !formData.actualMaterial ||
      !formData.workCompletedPercent ||
      !formData.delayLabel
    ) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.startDate >= formData.endDate) {
      setError('End date must be after start date');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newProgressEntry = {
        id: Date.now().toString(),
        // Current implementation fields
        cost: parseFloat(formData.cost),
        rawMaterials: parseFloat(formData.rawMaterials),
        internalDelay: parseInt(formData.internalDelay, 10),
        externalDelay: parseInt(formData.externalDelay, 10),
        labourCount: parseInt(formData.labourCount, 10),
        notes: formData.notes,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        createdAt: new Date().toISOString(),
        // ML Model Required Variables
        plannedCost: parseFloat(formData.plannedCost),
        plannedLabour: parseInt(formData.plannedLabour, 10),
        plannedMaterial: parseFloat(formData.plannedMaterial),
        actualCost: parseFloat(formData.actualCost),
        actualLabour: parseInt(formData.actualLabour, 10),
        actualMaterial: parseFloat(formData.actualMaterial),
        workCompletedPercent: parseFloat(formData.workCompletedPercent),
        externalDelay: parseInt(formData.externalDelay, 10),
        internalDelay: parseInt(formData.internalDelay, 10),
        delayLabel: formData.delayLabel
      };

      // Update projects in localStorage
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const updatedProjects = storedProjects.map(p =>
        p.id === project.id
          ? { ...p, progressEntries: [...(p.progressEntries || []), newProgressEntry] }
          : p
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));

      onProgressAdded();
      setSuccess(true);
      setFormData({
        startDate: new Date(),
        endDate: new Date(),
        // Current implementation fields
        cost: '',
        rawMaterials: '',
        internalDelay: '',
        externalDelay: '',
        labourCount: '',
        notes: '',
        // ML Model Required Fields
        plannedCost: '',
        plannedLabour: '',
        plannedMaterial: '',
        actualCost: '',
        actualLabour: '',
        actualMaterial: '',
        workCompletedPercent: '',
        externalDelay: '',
        internalDelay: '',
        delayLabel: ''
      });

      // Hide success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Failed to add progress entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <Card.Header>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add Progress</h2>
              <p className="text-gray-600">Project: {project.name}</p>
            </div>
          </div>
        </Card.Header>

        <Card.Body>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">Progress entry added successfully!</p>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  dateFormat="MMM dd, yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  dateFormat="MMM dd, yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <Input
              label="Cost During This Period"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleChange}
              placeholder="Enter cost amount"
              required
            />

            <Input
              label="Raw Materials Investment"
              name="rawMaterials"
              type="number"
              value={formData.rawMaterials}
              onChange={handleChange}
              placeholder="Enter amount invested in raw materials"
              required
            />

            <Input
              label="Internal Delay Count"
              name="internalDelay"
              type="number"
              value={formData.internalDelay}
              onChange={handleChange}
              placeholder="Enter number of internal delays"
              required
            />

            <Input
              label="External Delay Count"
              name="externalDelay"
              type="number"
              value={formData.externalDelay}
              onChange={handleChange}
              placeholder="Enter number of external delays"
              required
            />

            <Input
              label="Labour Count"
              name="labourCount"
              type="number"
              value={formData.labourCount}
              onChange={handleChange}
              placeholder="Enter number of labourers"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes/Comments
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes or comments"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* ML Model Required Fields */}
            <div className="border-t pt-6">
              {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">ML Model Data</h3> */}
              
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Planned Cost"
                  name="plannedCost"
                  type="number"
                  value={formData.plannedCost}
                  onChange={handleChange}
                  placeholder="Enter planned cost"
                  required
                />

                <Input
                  label="Planned Labour"
                  name="plannedLabour"
                  type="number"
                  value={formData.plannedLabour}
                  onChange={handleChange}
                  placeholder="Enter planned labour count"
                  required
                />

                <Input
                  label="Planned Material"
                  name="plannedMaterial"
                  type="number"
                  value={formData.plannedMaterial}
                  onChange={handleChange}
                  placeholder="Enter planned material cost"
                  required
                />

                <Input
                  label="Actual Cost"
                  name="actualCost"
                  type="number"
                  value={formData.actualCost}
                  onChange={handleChange}
                  placeholder="Enter actual cost"
                  required
                />

                <Input
                  label="Actual Labour"
                  name="actualLabour"
                  type="number"
                  value={formData.actualLabour}
                  onChange={handleChange}
                  placeholder="Enter actual labour count"
                  required
                />

                <Input
                  label="Actual Material"
                  name="actualMaterial"
                  type="number"
                  value={formData.actualMaterial}
                  onChange={handleChange}
                  placeholder="Enter actual material cost"
                  required
                />

                <Input
                  label="Work Completed (%)"
                  name="workCompletedPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.workCompletedPercent}
                  onChange={handleChange}
                  placeholder="Enter work completion percentage"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delay Label
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="delayLabel"
                    value={formData.delayLabel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select delay type</option>
                    <option value="No Delay">No Delay</option>
                    <option value="Weather Delay">Weather Delay</option>
                    <option value="Material Delay">Material Delay</option>
                    <option value="Labour Delay">Labour Delay</option>
                    <option value="Equipment Delay">Equipment Delay</option>
                    <option value="Permit Delay">Permit Delay</option>
                    <option value="Client Delay">Client Delay</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="flex-1"
              >
                {loading ? 'Adding Progress...' : 'Add Progress'}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default ProgressForm;
