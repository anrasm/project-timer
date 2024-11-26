import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import { ProjectProvider } from './context/ProjectContext';
import { ProjectList } from './components/ProjectList';

function App() {
  return (
    <ProjectProvider>
      <CssBaseline />
      <Container maxWidth="md">
        <ProjectList />
      </Container>
    </ProjectProvider>
  );
}

export default App;