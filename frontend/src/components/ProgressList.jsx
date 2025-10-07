import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Calendar, DollarSign, Package, FileText, Trash2, Brain } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const ProgressList = ({ project, onBack, onAddProgress }) => {
  const [progressEntries, setProgressEntries] = useState([]);
  const [mlLoading, setMlLoading] = useState({});
  const [mlResults, setMlResults] = useState({});

  useEffect(() => {
    // Load progress entries from localStorage
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const currentProject = storedProjects.find(p => p.id === project.id);
    setProgressEntries(currentProject?.progressEntries || []);
  }, [project.id]);

  const handleDeleteProgress = (entryId) => {
    if (window.confirm('Are you sure you want to delete this progress entry?')) {
      const updatedEntries = progressEntries.filter(entry => entry.id !== entryId);
      setProgressEntries(updatedEntries);

      // Update localStorage
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const updatedProjects = storedProjects.map(p => 
        p.id === project.id 
          ? { ...p, progressEntries: updatedEntries }
          : p
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }
  };

  const handleGenerateInsights = async (entry) => {
    // Set loading state for this specific entry
    setMlLoading(prev => ({ ...prev, [entry.id]: true }));
    
    try {
      // Prepare data for ML model with all required variables (matching your Flask API format)
      const data = {
        "Project_ID": parseInt(project.id) || 101,
        "Update_Day": Math.ceil((new Date() - new Date(entry.startDate)) / (1000 * 60 * 60 * 24)) || 12,
        "Planned_Cost": entry.plannedCost || 0,
        "Planned_Labour": entry.plannedLabour || 0,
        "Planned_Material": entry.plannedMaterial || 0,
        "Actual_Cost": entry.actualCost || 0,
        "Actual_Labour": entry.actualLabour || 0,
        "Actual_Material": entry.actualMaterial || 0,
        "%Work_Completed": entry.workCompletedPercent || 0,
        "External_Delay": entry.externalDelay || 0,
        "Internal_Delay": entry.internalDelay || 0,
        "Delay_Label": getDelayLabelValue(entry.delayLabel)
      };

      console.log('Sending data to ML model:', data);

      // Send data to Flask ML model API
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('ML Model Response:', result);

      // Store the result for this entry
      setMlResults(prev => ({ 
        ...prev, 
        [entry.id]: {
          prediction: result.prediction,
          probability: result.probability,
          timestamp: new Date().toISOString()
        }
      }));

    } catch (error) {
      console.error("Error calling ML model:", error);
      
      // Store error result
      setMlResults(prev => ({ 
        ...prev, 
        [entry.id]: {
          error: `Failed to get prediction: ${error.message}`,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      // Clear loading state
      setMlLoading(prev => ({ ...prev, [entry.id]: false }));
    }
  };

  // Helper function to convert delay label to numeric value
  const getDelayLabelValue = (delayLabel) => {
    const delayMap = {
      "No Delay": 0,
      "Weather Delay": 1,
      "Material Delay": 2,
      "Labour Delay": 3,
      "Equipment Delay": 4,
      "Permit Delay": 5,
      "Client Delay": 6,
      "Other": 7
    };
    return delayMap[delayLabel] || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return formatDate(startDate);
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const totalCost = progressEntries.reduce((sum, entry) => sum + (entry.cost || 0), 0);

  if (progressEntries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
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
                <h2 className="text-2xl font-bold text-gray-900">Progress History</h2>
                <p className="text-gray-600">Project: {project.name}</p>
              </div>
            </div>
          </Card.Header>

          <Card.Body className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Entries</h3>
            <p className="text-gray-600 mb-6">
              This project doesn't have any progress entries yet
            </p>
            <Button
              variant="primary"
              onClick={onAddProgress}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Progress Entry
            </Button>
          </Card.Body>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
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
                <h2 className="text-2xl font-bold text-gray-900">Progress History</h2>
                <p className="text-gray-600">Project: {project.name}</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={onAddProgress}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Progress
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Entries</p>
                  <p className="text-2xl font-bold text-blue-900">{progressEntries.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Cost</p>
                  <p className="text-2xl font-bold text-green-900">${totalCost.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Materials Used</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {progressEntries.filter(entry => entry.materials).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Entries */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Progress Entries ({progressEntries.length})
            </h3>

            {progressEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-blue-500">
                  <Card.Body>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            Progress Entry #{index + 1}
                          </h4>
                          <span className="text-sm text-gray-500">
                            Added {formatDate(entry.createdAt)}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateRange(entry.startDate, entry.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>${entry.cost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleGenerateInsights(entry)}
                          loading={mlLoading[entry.id]}
                          disabled={mlLoading[entry.id]}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Brain className="w-4 h-4" />
                          {mlLoading[entry.id] ? 'Generating...' : 'Generate Insights'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProgress(entry.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Materials Used
                        </h5>
                        <p className="text-gray-700 bg-gray-50 rounded-md p-3">
                          {entry.rawMaterials || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Notes
                        </h5>
                        <p className="text-gray-700 bg-gray-50 rounded-md p-3">
                          {entry.notes}
                        </p>
                      </div>

                      {/* ML Model Data Display */}
                      {entry.plannedCost && (
                        <div className="border-t pt-4">
                          <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            ML Model Data
                          </h5>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-blue-50 rounded-md p-3">
                              <h6 className="font-medium text-blue-900 mb-2">Planned vs Actual</h6>
                              <div className="space-y-1 text-blue-800">
                                <div>Cost: ${entry.plannedCost?.toLocaleString()} → ${entry.actualCost?.toLocaleString()}</div>
                                <div>Labour: {entry.plannedLabour} → {entry.actualLabour}</div>
                                <div>Material: ${entry.plannedMaterial?.toLocaleString()} → ${entry.actualMaterial?.toLocaleString()}</div>
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-md p-3">
                              <h6 className="font-medium text-green-900 mb-2">Progress & Delays</h6>
                              <div className="space-y-1 text-green-800">
                                <div>Work Completed: {entry.workCompletedPercent}%</div>
                                <div>Internal Delays: {entry.internalDelay}</div>
                                <div>External Delays: {entry.externalDelay}</div>
                                <div>Delay Type: {entry.delayLabel}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ML Prediction Results */}
                      {mlResults[entry.id] && (
                        <div className="border-t pt-4">
                          <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            ML Prediction Results
                          </h5>
                          {mlResults[entry.id].error ? (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                              <p className="text-red-800 text-sm">
                                <strong>Error:</strong> {mlResults[entry.id].error}
                              </p>
                              <p className="text-red-600 text-xs mt-1">
                                Generated at: {new Date(mlResults[entry.id].timestamp).toLocaleString()}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-purple-800 text-sm">
                                    <strong>Prediction:</strong> {mlResults[entry.id].prediction}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-purple-800 text-sm">
                                    <strong>Probability:</strong> {mlResults[entry.id].probability}
                                  </p>
                                </div>
                              </div>
                              <p className="text-purple-600 text-xs mt-2">
                                Generated at: {new Date(mlResults[entry.id].timestamp).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default ProgressList;
