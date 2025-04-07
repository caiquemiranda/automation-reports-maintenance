import React from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, Typography, IconButton, Badge, Avatar, Box } from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  ExitToApp as LogoutIcon 
} from '@mui/icons-material';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding: 20px;
  background: #f5f5f5;
`;

const Footer = styled.footer`
  padding: 12px 20px;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  text-align: center;
  color: #757575;
  font-size: 12px;
`;

const Header = styled(AppBar)`
  width: calc(100% - 260px) !important;
  margin-left: 260px !important;
  background-color: #fff !important;
  color: #424242 !important;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1) !important;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled(Typography)`
  margin-left: 10px;
  font-weight: 500;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Header position="sticky">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#455a64' }}>
              Sistema de Gestão de Manutenção
            </Typography>
            
            <Box display="flex" alignItems="center">
              <IconButton size="large" color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <UserInfo>
                <Avatar 
                  sx={{ 
                    bgcolor: '#2196f3',
                    width: 35,
                    height: 35
                  }}
                >
                  TS
                </Avatar>
                <UserName variant="body1">Técnico Silva</UserName>
              </UserInfo>
              
              <IconButton 
                size="large" 
                color="inherit" 
                sx={{ ml: 1 }}
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Header>
        
        <ContentWrapper>
          {children}
        </ContentWrapper>
        
        <Footer>
          <Typography variant="body2">
            &copy; 2023 ManutençãoPRO - Sistema de Gestão de Manutenção Industrial - v1.0.0
          </Typography>
        </Footer>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 