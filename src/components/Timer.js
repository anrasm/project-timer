import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import { useProject } from '../context/ProjectContext';

export const Timer = ({ project }) => {
  const [time, setTime] = useState(project.timeSpent);
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastUpdateRef = useRef(null);  
  const { updateProjectTime, activeTimerProjectId, setActiveTimerProjectId } = useProject();

  useEffect(() => {
    // Reset and sync with project state when not running
    if (!project.isRunning || project.id !== activeTimerProjectId) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      startTimeRef.current = null;
      lastUpdateRef.current = null;
      setTime(project.timeSpent);
      return;
    }

    // Start or resume timer
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now() - project.timeSpent;
      lastUpdateRef.current = Date.now();
    }

    const updateTime = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;

      // Update time state
      setTime(elapsed);
      
      // Update project time less frequently
      if (!lastUpdateRef.current || now - lastUpdateRef.current >= 1000) {
        updateProjectTime(project.id, elapsed, true);
        lastUpdateRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(updateTime);
    };

    animationFrameRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [project.isRunning, project.timeSpent, activeTimerProjectId, project.id]);

  const startTimer = () => {
    setActiveTimerProjectId(project.id);
    updateProjectTime(project.id, time, true);
  };

  const pauseTimer = () => {
    updateProjectTime(project.id, time, false);
    setActiveTimerProjectId(null);
  };

  const formatTime = (totalMilliseconds) => {
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    const milliseconds = totalMilliseconds % 1000;
    return `${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s:${milliseconds.toString().padStart(3, '0')}ms`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <span>{formatTime(time)}</span>
      {(!project.isRunning || project.id !== activeTimerProjectId) ? (
        <Button onClick={startTimer} color="primary" variant="contained">Start</Button>
      ) : (
        <Button onClick={pauseTimer} color="warning" variant="contained">Pause</Button>
      )}
    </div>
  );
};