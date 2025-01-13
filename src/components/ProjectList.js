import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Box,
  Stack
} from '@mui/material';
import { useProject } from '../context/ProjectContext';
import { Timer } from './Timer';

export const ProjectList = () => {
  const [newProjectName, setNewProjectName] = useState('');
  const { projects, addProject, deleteProject, totalTime } = useProject();

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName);
      setNewProjectName('');
    }
  };

  const formatTotalTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, px: 2 }}>
      <Box 
        display="flex"
        gap={2} mb={4}
        flexDirection={{ xs: 'column', sm: 'row' }}  
      >
        <TextField 
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          label="Project Name"
          variant="outlined"
          fullWidth
        />
        <Button 
          onClick={handleAddProject} 
          variant="contained" 
          color="primary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          Add Project
        </Button>
      </Box>

      <List>
        {projects.map(project => (
          <ListItem 
            key={project.id} 
            divider 
            sx={{ 
              py: 2,
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <ListItemText 
              primary={project.name} 
              primaryTypographyProps={{ 
                sx: { flexGrow: 1, mr: 2 } 
              }}
              sx={{
                display: { xs: 'block', sm: 'initial' },
                width: { xs: '100%', sm: 'auto' }
              }}
            />
            <Timer project={project} />
            <Button 
              onClick={() => deleteProject(project.id)} 
              color="error" 
              variant="contained"
              sx={{ ml: 0 }}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>

      <Typography 
        variant="h6" 
        align="center" 
        sx={{ mt: 4 }}
      >
        Total Time: {formatTotalTime(totalTime)}
      </Typography>
    </Container>
  );
};