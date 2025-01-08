import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useLocalStorage('projects', []);
  const [activeTimerProjectId, setActiveTimerProjectId] = useState(null);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const newTotalTime = projects.reduce((total, project) => {
      // Convert timeSpent to seconds and sum them
      return total + Math.floor(project.timeSpent / 1000);
    }, 0);
    setTotalTime(newTotalTime); // Store total time in seconds
  }, [projects]);

  const addProject = (name) => {
    const newProject = {
      id: Date.now(),
      name,
      timeSpent: 0,  // time spent in milliseconds
      isRunning: true // Timer should start immediately
    };
    setProjects([...projects, newProject]);  // Update the projects list
    setActiveTimerProjectId(newProject.id);  // Set this project as the active timer
  };  

  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const updateProjectTime = (id, timeSpent, isRunning) => {
    setProjects(projects.map(project => 
      project.id === id 
        ? { ...project, timeSpent, isRunning }
        : { ...project, isRunning: false }
    ));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeTimerProjectId,
      totalTime,
      addProject,
      deleteProject,
      updateProjectTime,
      setActiveTimerProjectId
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);