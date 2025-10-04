import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../lib/api/projects';
import { userAPI } from '../lib/api/users';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Error from '../components/ui/Error';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsResponse, usersResponse] = await Promise.all([
        projectAPI.getAllProjects(),
        userAPI.getAllUsers()
      ]);
      setProjects(projectsResponse.data.data);
      setUsers(usersResponse.data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.deleteProject(id);
        setProjects(projects.filter(project => project._id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete project');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectTypeColor = (type) => {
    switch (type) {
      case 'residential': return 'bg-purple-100 text-purple-800';
      case 'commercial': return 'bg-indigo-100 text-indigo-800';
      case 'industrial': return 'bg-orange-100 text-orange-800';
      case 'infrastructure': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Error message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Construction Projects</h1>
          <Link to="/projects/new">
            <Button variant="primary">
              Create New Project
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <Card.Body>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first construction project</p>
              <Link to="/projects/new">
                <Button variant="primary">Create Project</Button>
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <Card key={project._id}>
                <Card.Body>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProjectTypeColor(project.projectType)}`}>
                          {project.projectType}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{project.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Budget</p>
                          <p className="font-medium">${project.budget?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Client</p>
                          <p className="font-medium">{getUserName(project.client)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Manager</p>
                          <p className="font-medium">{getUserName(project.manager)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Start Date</p>
                          <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">End Date</p>
                          <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {project.assets && project.assets.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-2">Required Assets:</p>
                          <div className="flex flex-wrap gap-2">
                            {project.assets.slice(0, 3).map((asset, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800">
                                {asset.name} ({asset.quantity} {asset.unit})
                              </span>
                            ))}
                            {project.assets.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800">
                                +{project.assets.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Link to={`/projects/${project._id}/edit`}>
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(project._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;




