import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import { ProjectProvider } from './context/ProjectContext';
import { ProjectList } from './components/ProjectList';

function App() {
  return (
    <ProjectProvider>
      <CssBaseline />
      <Container maxWidth="md" sx={{ px: 0 }}>
        <ProjectList />
      </Container>
    </ProjectProvider>
  );
}

export default App;