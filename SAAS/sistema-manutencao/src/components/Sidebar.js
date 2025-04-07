import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography,
    Box
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Build as BuildIcon,
    CalendarMonth as CalendarIcon,
    Assessment as ReportIcon,
    ExpandLess,
    ExpandMore,
    LocationOn as MapIcon,
    Engineering as EngineeringIcon,
    FindInPage as FindIcon,
    PendingActions as PendingIcon,
    InsertDriveFile as FileIcon,
    Person as PersonIcon,
    Devices as DevicesIcon
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

const NestedList = styled(List)`
  padding-left: 16px;
  background-color: rgba(0, 0, 0, 0.2);
`;

const NestedItem = styled(ListItem)`
  padding: 8px 16px 8px 30px;
  border-left: 3px solid ${props => props.active ? '#4fc3f7' : 'transparent'};
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const Sidebar = () => {
    const location = useLocation();
    const [openCorretiva, setOpenCorretiva] = useState(true);
    const [openPlanejada, setOpenPlanejada] = useState(false);
    const [openRelatorios, setOpenRelatorios] = useState(false);

    const handleClickCorretiva = () => {
        setOpenCorretiva(!openCorretiva);
    };

    const handleClickPlanejada = () => {
        setOpenPlanejada(!openPlanejada);
    };

    const handleClickRelatorios = () => {
        setOpenRelatorios(!openRelatorios);
    };

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
            children: [
                { text: 'Nova OS', path: '/corretiva/nova' },
                { text: 'Consulta', path: '/corretiva/consulta' },
            ],
        },
        {
            text: 'OS Planejada',
            icon: <CalendarIcon />,
            children: [
                { text: 'Nova OS', path: '/planejada/nova' },
            ],
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