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

    return (
        <SidebarContainer>
            <SidebarHeader>
                <Logo>ManutençãoPRO</Logo>
                <Typography variant="body2" color="text.secondary" sx={{ color: '#90a4ae' }}>
                    Sistema de Gestão de Manutenção
                </Typography>
            </SidebarHeader>

            <SidebarMenu component="nav">
                <MenuItem
                    button
                    component={Link}
                    to="/"
                    active={isActive('/') ? 1 : 0}
                >
                    <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <MenuItemText primary="Dashboard" />
                </MenuItem>

                {/* OS Corretiva */}
                <MenuItem button onClick={handleClickCorretiva}>
                    <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                        <BuildIcon />
                    </ListItemIcon>
                    <MenuItemText primary="OS Corretiva" />
                    {openCorretiva ? <ExpandLess /> : <ExpandMore />}
                </MenuItem>
                <Collapse in={openCorretiva} timeout="auto" unmountOnExit>
                    <NestedList component="div" disablePadding>
                        <NestedItem
                            button
                            component={Link}
                            to="/corretiva/nova"
                            active={isActive('/corretiva/nova') ? 1 : 0}
                        >
                            <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                                <FileIcon />
                            </ListItemIcon>
                            <MenuItemText primary="Nova" />
                        </NestedItem>
                        <NestedItem
                            button
                            component={Link}
                            to="/corretiva/consulta"
                            active={isActive('/corretiva/consulta') ? 1 : 0}
                        >
                            <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                                <FindIcon />
                            </ListItemIcon>
                            <MenuItemText primary="Consulta" />
                        </NestedItem>
                        <NestedItem
                            button
                            component={Link}
                            to="/corretiva/pendentes"
                            active={isActive('/corretiva/pendentes') ? 1 : 0}
                        >
                            <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                                <PendingIcon />
                            </ListItemIcon>
                            <MenuItemText primary="Pendentes" />
                        </NestedItem>
                    </NestedList>
                </Collapse>

                {/* OS Planejada */}
                <MenuItem button onClick={handleClickPlanejada}>
                    <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                        <CalendarIcon />
                    </ListItemIcon>
                    <MenuItemText primary="OS Planejada" />
                    {openPlanejada ? <ExpandLess /> : <ExpandMore />}
                </MenuItem>
                <Collapse in={openPlanejada} timeout="auto" unmountOnExit>
                    <NestedList component="div" disablePadding>
                        <NestedItem
                            button
                            component={Link}
                            to="/planejada/nova"
                            active={isActive('/planejada/nova') ? 1 : 0}
                        >
                            <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                                <FileIcon />
                            </ListItemIcon>
                            <MenuItemText primary="Nova" />
                        </NestedItem>
                        <NestedItem
                            button
                            component={Link}
                            to="/planejada/consulta"
                            active={isActive('/planejada/consulta') ? 1 : 0}
                        >
                            <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                                <FindIcon />
                            </ListItemIcon>
                            <MenuItemText primary="Consulta" />
                        </NestedItem>
                        <NestedItem
                            button
                            component={Link}
                            to="/planejada/calendario"
                            active={isActive('/planejada/calendario') ? 1 : 0}
                        >
                            <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                                <CalendarIcon />
                            </ListItemIcon>
                            <MenuItemText primary="Calendário" />
                        </NestedItem>
                    </NestedList>
                </Collapse>

                {/* Relatórios */}
                <MenuItem button onClick={handleClickRelatorios}>
                    <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                        <ReportIcon />
                    </ListItemIcon>
                    <MenuItemText primary="Relatórios" />
                    {openRelatorios ? <ExpandLess /> : <ExpandMore />}
                </MenuItem>
                <Collapse in={openRelatorios} timeout="auto" unmountOnExit>
                    <NestedList component="div" disablePadding>
                        <NestedItem
                            button
                            component={Link}
                            to="/relatorios/mensal"
                            active={isActive('/relatorios/mensal') ? 1 : 0}
                        >
                            <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                                <ReportIcon />
                            </ListItemIcon>
                            <MenuItemText primary="Mensal" />
                        </NestedItem>
                        <NestedItem
                            button
                            component={Link}
                            to="/relatorios/tecnico"
                            active={isActive('/relatorios/tecnico') ? 1 : 0}
                        >
                            <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                                <PersonIcon />
                            </ListItemIcon>
                            <MenuItemText primary="Por Técnico" />
                        </NestedItem>
                        <NestedItem
                            button
                            component={Link}
                            to="/relatorios/equipamento"
                            active={isActive('/relatorios/equipamento') ? 1 : 0}
                        >
                            <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                                <DevicesIcon />
                            </ListItemIcon>
                            <MenuItemText primary="Por Equipamento" />
                        </NestedItem>
                    </NestedList>
                </Collapse>

                {/* Mapa dos Sensores */}
                <MenuItem
                    button
                    component={Link}
                    to="/mapa-sensores"
                    active={isActive('/mapa-sensores') ? 1 : 0}
                >
                    <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                        <MapIcon />
                    </ListItemIcon>
                    <MenuItemText primary="Ache o Ponto" />
                </MenuItem>
            </SidebarMenu>
        </SidebarContainer>
    );
};

export default Sidebar; 