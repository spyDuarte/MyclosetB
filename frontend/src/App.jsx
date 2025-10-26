import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import AppLayout from './components/layout/AppLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import WardrobeForm from './pages/WardrobeForm.jsx';
import LookBuilder from './pages/LookBuilder.jsx';

function App() {
  return (
    <AppLayout>
      <Box as="main" role="main" flex="1" px={{ base: 4, md: 8 }} py={{ base: 4, md: 6 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wardrobe/new" element={<WardrobeForm />} />
          <Route path="/looks/new" element={<LookBuilder />} />
        </Routes>
      </Box>
    </AppLayout>
  );
}

export default App;
