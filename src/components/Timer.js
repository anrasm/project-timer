import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import { useProject } from '../context/ProjectContext';

export const Timer = ({ project }) => {
  const [isRunning, setIsRunning] = useState(project.isRunning);
  const timerRef = useRef(null);
  const { 
    updateProjectTime, 
    activeTimerProjectId, 
    setActiveTimerProjectId,
    projects 
  } = useProject();

  useEffect(() => {
    setIsRunning(activeTimerProjectId === project.id);
  }, [activeTimerProjectId, project.id]);

  useEffect(() => {
    if (isRunning && activeTimerProjectId === project.id) {
      timerRef.current = setInterval(() => {
        // Find the current project in the latest projects array
        const currentProject = projects.find(p => p.id === project.id);
        if (currentProject) {  // Only update if project still exists
          const newTime = currentProject.timeSpent + 1;
          updateProjectTime(project.id, newTime, true);
        } else {
          // If project no longer exists, clear the interval
          clearInterval(timerRef.current);
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, activeTimerProjectId, project.id, projects]);

  const startTimer = () => {
    setActiveTimerProjectId(project.id);
    // Get the latest project data
    const currentProject = projects.find(p => p.id === project.id);
    if (currentProject) {
      updateProjectTime(project.id, currentProject.timeSpent, true);
    }
  };

  const pauseTimer = () => {
    setActiveTimerProjectId(null);
    // Get the latest project data
    const currentProject = projects.find(p => p.id === project.id);
    if (currentProject) {
      updateProjectTime(project.id, currentProject.timeSpent, false);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`;
  };

  // Get the latest time from projects array
  const currentProject = projects.find(p => p.id === project.id);
  const currentTime = currentProject ? currentProject.timeSpent : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <span>{formatTime(currentTime)}</span>
      {!isRunning ? (
        <Button onClick={startTimer} color="primary" variant="contained">Start</Button>
      ) : (
        <Button onClick={pauseTimer} color="warning" variant="contained">Pause</Button>
      )}
    </div>
  );
};