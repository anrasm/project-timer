import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import { useProject } from '../context/ProjectContext';

export const Timer = ({ project }) => {
  const [time, setTime] = useState(project.timeSpent);
  const [isRunning, setIsRunning] = useState(project.isRunning);
  const timerRef = useRef(null);
  const { updateProjectTime, activeTimerProjectId, setActiveTimerProjectId } = useProject();

  useEffect(() => {
    setIsRunning(activeTimerProjectId === project.id);
  }, [activeTimerProjectId, project.id]);

  useEffect(() => {
    if (isRunning && activeTimerProjectId === project.id) {
      timerRef.current = setInterval(() => {
        const newTime = time + 1;
        setTime(newTime);
        updateProjectTime(project.id, newTime, true);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, activeTimerProjectId, project.id, time]);

  const startTimer = () => {
    setActiveTimerProjectId(project.id);
    updateProjectTime(project.id, time, true);
  };

  const pauseTimer = () => {
    setActiveTimerProjectId(null);
    updateProjectTime(project.id, time, false);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <span>{formatTime(time)}</span>
      {!isRunning ? (
        <Button onClick={startTimer} color="primary" variant="contained">Start</Button>
      ) : (
        <Button onClick={pauseTimer} color="warning" variant="contained">Pause</Button>
      )}
    </div>
  );
};