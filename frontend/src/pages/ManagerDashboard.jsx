import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Eye, Calendar, DollarSign, Package } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CreateProject from '../components/CreateProject';
import ProjectList from '../components/ProjectList';
import ProgressForm from '../components/ProgressForm';
import ProgressList from '../components/ProgressList';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [showProgressList, setShowProgressList] = useState(false);
  const [activeSection, setActiveSection] = useState('create');

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleProjectCreated = (newProject) => {
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setActiveSection('list');
  };

  const handleViewProgress = (project) => {
    setSelectedProject(project);
    setShowProgressList(true);
    setShowProgressForm(false);
  };

  const handleAddProgress = (project) => {
    setSelectedProject(project);
    setShowProgressForm(true);
    setShowProgressList(false);
  };

  const handleProgressAdded = () => {
    setShowProgressForm(false);
    setSelectedProject(null);
  };

  const handleBackToList = () => {
    setShowProgressForm(false);
    setShowProgressList(false);
    setSelectedProject(null);
  };

  const stats = {
    totalProjects: projects.length,
    totalBudget: projects.reduce((sum, project) => sum + (project.budget || 0), 0),
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manager Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome, {user?.name} ({user?.username})
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-blue-50 border-blue-200">
            <Card.Body className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900">{stats.totalProjects}</h3>
              <p className="text-blue-700">Total Projects</p>
            </Card.Body>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <Card.Body className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-900">
                ${stats.totalBudget.toLocaleString()}
              </h3>
              <p className="text-green-700">Total Budget</p>
            </Card.Body>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <Card.Body className="text-center">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-900">{stats.activeProjects}</h3>
              <p className="text-yellow-700">Active Projects</p>
            </Card.Body>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <Card.Body className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-900">{stats.completedProjects}</h3>
              <p className="text-purple-700">Completed</p>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'create', label: 'Create Project', icon: Plus },
                { id: 'list', label: 'Existing Projects', icon: Package },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSection(tab.id);
                    setShowProgressForm(false);
                    setShowProgressList(false);
                    setSelectedProject(null);
                  }}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeSection === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'create' && (
            <CreateProject onProjectCreated={handleProjectCreated} />
          )}

          {activeSection === 'list' && !showProgressForm && !showProgressList && (
            <ProjectList
              projects={projects}
              onViewProgress={handleViewProgress}
              onAddProgress={handleAddProgress}
            />
          )}

          {showProgressForm && selectedProject && (
            <ProgressForm
              project={selectedProject}
              onProgressAdded={handleProgressAdded}
              onBack={handleBackToList}
            />
          )}

          {showProgressList && selectedProject && (
            <ProgressList
              project={selectedProject}
              onBack={handleBackToList}
              onAddProgress={() => handleAddProgress(selectedProject)}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
