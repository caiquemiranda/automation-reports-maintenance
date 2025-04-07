import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Build as BuildIcon,
    CalendarMonth as CalendarIcon,
    LocationOn as MapIcon
} from '@mui/icons-material';

const SidebarContainer = styled.div`
  background-color: #263238;
  color: #fff;
  width: 260px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  transition: all 0.3s ease;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
`;

const SidebarMenu = styled(List)`
  padding-top: 0;
`;

const MenuItem = styled(ListItem)`
  padding: 12px 20px;
  border-left: 3px solid ${props => props.active ? '#4fc3f7' : 'transparent'};
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const MenuItemText = styled(ListItemText)`
  .MuiTypography-root {
    font-size: 14px;
  }
`;

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/',
        },
        {
            text: 'OS Corretiva',
            icon: <BuildIcon />,
            path: '/corretiva/nova',
        },
        {
            text: 'OS Corretiva - Consulta',
            icon: <BuildIcon />,
            path: '/corretiva/consulta',
        },
        {
            text: 'OS Planejada',
            icon: <CalendarIcon />,
            path: '/planejada/nova',
        },
        {
            text: 'Mapa de Sensores',
            icon: <MapIcon />,
            path: '/mapa-sensores',
        },
    ];

    return (
        <SidebarContainer>
            <SidebarHeader>
                <Logo>ManutençãoPRO</Logo>
                <Typography variant="body2" color="text.secondary" sx={{ color: '#90a4ae' }}>
                    Sistema de Gestão de Manutenção
                </Typography>
            </SidebarHeader>

            <SidebarMenu component="nav">
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        button
                        component={Link}
                        to={item.path}
                        active={isActive(item.path) ? 1 : 0}
                    >
                        <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                            {item.icon}
                        </ListItemIcon>
                        <MenuItemText primary={item.text} />
                    </MenuItem>
                ))}
            </SidebarMenu>
        </SidebarContainer>
    );
};

export default Sidebar; 