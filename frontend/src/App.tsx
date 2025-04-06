import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, alpha, useTheme } from '@mui/material';
import StoryList from './components/StoryList';
import StoryDetail from './components/StoryDetail';
import SubmitStory from './components/SubmitStory';

const App: React.FC = () => {
  const theme = useTheme();
  // 设置背景图片URL
  const backgroundImageUrl = `${process.env.PUBLIC_URL}/images/backgrounds/image.png`;
  
  return (
    <Router>
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              剑网三818江湖录
            </Typography>
            <Button color="inherit" component={Link} to="/">
              818列表
            </Button>
            <Button color="inherit" component={Link} to="/submit">
              提交818
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ 
          flexGrow: 1, 
          py: 3,
          bgcolor: alpha('#fff', 0.3),
          backdropFilter: 'blur(2px)',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 1,
          overflowX: 'hidden'  // 防止水平滚动
        }}>
          <Container sx={{ position: 'relative' }}>
            <Routes>
              <Route path="/" element={<StoryList />} />
              <Route path="/stories/:id" element={<StoryDetail />} />
              <Route path="/submit" element={<SubmitStory />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
