// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Build, 
  CalendarMonth, 
  Assessment, 
  ExpandLess, 
  ExpandMore, 
  Dashboard 
} from '@mui/icons-material';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #1e293b;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
`;

const Logo = styled.div`
  padding: 20px;
  font-size: 22px;
  font-weight: bold;
  border-bottom: 1px solid #2d3748;
`;

const MenuItem = styled.div`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-left: ${props => props.active ? '4px solid #3182ce' : '4px solid transparent'};
  background-color: ${props => props.active ? '#2d3748' : 'transparent'};
  
  &:hover {
    background-color: #2d3748;
  }
`;

const MenuIcon = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

const MenuText = styled.div`
  flex-grow: 1;
`;

const SubMenu = styled.div`
  background-color: #2c3e50;
  overflow: hidden;
  max-height: ${props => props.open ? '300px' : '0'};
  transition: max-height 0.3s ease-in-out;
`;

const SubMenuItem = styled(Link)`
  padding: 12px 10px 12px 50px;
  display: block;
  color: #cbd5e0;
  text-decoration: none;
  background-color: ${props => props.active ? '#3c4c5f' : 'transparent'};
  
  &:hover {
    background-color: #3c4c5f;
  }
`;

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({
    corretiva: false,
    planejada: false,
    relatorios: false
  });

  const toggleMenu = (menu) => {
    setOpenMenus({
      ...openMenus,
      [menu]: !openMenus[menu]
    });
  };

  const isActive = (path) => location.pathname === path;
  const isMenuActive = (paths) => paths.some(path => location.pathname.includes(path));

  return (
    <SidebarContainer>
      <Logo>Sistema de Manutenção</Logo>
      
      <MenuItem active={isActive('/')}>
        <MenuIcon><Dashboard /></MenuIcon>
        <MenuText><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></MenuText>
      </MenuItem>
      
      {/* Menu OS Corretiva */}
      <MenuItem 
        active={isMenuActive(['/corretiva'])} 
        onClick={() => toggleMenu('corretiva')}
      >
        <MenuIcon><Build /></MenuIcon>
        <MenuText>OS Corretiva</MenuText>
        {openMenus.corretiva ? <ExpandLess /> : <ExpandMore />}
      </MenuItem>
      <SubMenu open={openMenus.corretiva}>
        <SubMenuItem to="/corretiva/nova" active={isActive('/corretiva/nova')}>
          Nova OS
        </SubMenuItem>
        <SubMenuItem to="/corretiva/consulta" active={isActive('/corretiva/consulta')}>
          Consultar OS
        </SubMenuItem>
        <SubMenuItem to="/corretiva/pendentes" active={isActive('/corretiva/pendentes')}>
          OS Pendentes
        </SubMenuItem>
      </SubMenu>
      
      {/* Menu OS Planejada */}
      <MenuItem 
        active={isMenuActive(['/planejada'])} 
        onClick={() => toggleMenu('planejada')}
      >
        <MenuIcon><CalendarMonth /></MenuIcon>
        <MenuText>OS Planejada</MenuText>
        {openMenus.planejada ? <ExpandLess /> : <ExpandMore />}
      </MenuItem>
      <SubMenu open={openMenus.planejada}>
        <SubMenuItem to="/planejada/nova" active={isActive('/planejada/nova')}>
          Nova OS
        </SubMenuItem>
        <SubMenuItem to="/planejada/consulta" active={isActive('/planejada/consulta')}>
          Consultar OS
        </SubMenuItem>
        <SubMenuItem to="/planejada/calendario" active={isActive('/planejada/calendario')}>
          Calendário
        </SubMenuItem>
      </SubMenu>
      
      {/* Menu Relatórios */}
      <MenuItem 
        active={isMenuActive(['/relatorios'])} 
        onClick={() => toggleMenu('relatorios')}
      >
        <MenuIcon><Assessment /></MenuIcon>
        <MenuText>Relatórios</MenuText>
        {openMenus.relatorios ? <ExpandLess /> : <ExpandMore />}
      </MenuItem>
      <SubMenu open={openMenus.relatorios}>
        <SubMenuItem to="/relatorios/mensal" active={isActive('/relatorios/mensal')}>
          Relatório Mensal
        </SubMenuItem>
        <SubMenuItem to="/relatorios/tecnico" active={isActive('/relatorios/tecnico')}>
          Por Técnico
        </SubMenuItem>
        <SubMenuItem to="/relatorios/equipamento" active={isActive('/relatorios/equipamento')}>
          Por Equipamento
        </SubMenuItem>
      </SubMenu>
    </SidebarContainer>
  );
};

export default Sidebar;