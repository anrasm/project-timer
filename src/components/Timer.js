import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import { useProject } from '../context/ProjectContext';

export const Timer = ({ project }) => {
  const [time, setTime] = useState(project.timeSpent); // Track time in milliseconds
  const [isRunning, setIsRunning] = useState(project.isRunning);
  const startTimeRef = useRef(null);  // Tracks the start time of the timer
  const timeRef = useRef(time); // To ensure we keep track of the time correctly
  const animationFrameRef = useRef(null); // Reference for requestAnimationFrame

  // Destructure the necessary functions from the context
  const { updateProjectTime } = useProject();

  useEffect(() => {
    // Start or resume the timer
    if (isRunning) {
      startTimeRef.current = Date.now() - timeRef.current; // Time offset from last pause
      const updateTime = () => {
        const elapsed = Date.now() - startTimeRef.current; // Time difference
        timeRef.current = elapsed;
        setTime(elapsed);
        animationFrameRef.current = requestAnimationFrame(updateTime); // Keep updating
      };
      animationFrameRef.current = requestAnimationFrame(updateTime); // Start the animation loop
    } else {
      // If the timer is paused, stop the animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    // Cleanup on component unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    // Update the project state with the current time spent when paused
    updateProjectTime(project.id, time, false);
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
      {!isRunning ? (
        <Button onClick={startTimer} color="primary" variant="contained">Start</Button>
      ) : (
        <Button onClick={pauseTimer} color="warning" variant="contained">Pause</Button>
      )}
    </div>
  );
};