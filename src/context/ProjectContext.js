import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useLocalStorage('projects', []);
  const [activeTimerProjectId, setActiveTimerProjectId] = useState(null);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const newTotalTime = projects.reduce((total, project) => {
      return total + Math.floor(project.timeSpent / 1000);
    }, 0);
    setTotalTime(newTotalTime);
  }, [projects]);

  const addProject = (name) => {
    const newProjectId = Date.now();

    // Update existing projects and add new one
    setProjects(prevProjects => {
      // Stop any running projects and save their time
      const updatedProjects = prevProjects.map(project => {
        if (project.isRunning) {
          const elapsed = Date.now() - project.lastStartTime;
          return {
            ...project,
            isRunning: false,
            timeSpent: project.timeSpent + elapsed,
          };
        }
        return project;
      });

      // Add new project
      return [...updatedProjects, {
        id: newProjectId,
        name,
        timeSpent: 0,
        isRunning: true,
        lastStartTime: Date.now()
      }];
    });

    // Set new project as active
    setActiveTimerProjectId(newProjectId);
  };

  const deleteProject = (id) => {
    if (activeTimerProjectId === id) {
      setActiveTimerProjectId(null);
    }
    setProjects(projects.filter(project => project.id !== id));
  };

  const updateProjectTime = (id, timeSpent, isRunning) => {
    setProjects(prevProjects => 
      prevProjects.map(project => {
        if (project.id === id) {
          // Update the current project
          return {
            ...project,
            timeSpent,
            isRunning,
            lastStartTime: isRunning ? Date.now() : null
          };
        }
        // Stop other projects if this one is starting
        if (isRunning) {
          return {
            ...project,
            isRunning: false
          };
        }
        return project;
      })
    );
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