import React, { useState } from 'react';

function Sidebar({ collapsed }) {
    const [activeSubmenus, setActiveSubmenus] = useState({});

    const toggleSubmenu = (key) => {
        setActiveSubmenus({
            ...activeSubmenus,
            [key]: !activeSubmenus[key]
        });
    };

    return (
        <div className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
            <ul className="sidebar-menu">
                <li><a href="#/home"><i className="fas fa-home"></i> HOME</a></li>
                <li><a href="#/dashboard"><i className="fas fa-chart-line"></i> DASHBOARD</a></li>
                <li className={`has-submenu ${activeSubmenus['ras'] ? 'active' : ''}`}>
                    <a href="#" onClick={() => toggleSubmenu('ras')}><i className="fas fa-file-alt"></i> RAS</a>
                    <ul className="submenu">
                        <li><a href="#/ras">Relatório Análise de Solução</a></li>
                    </ul>
                </li>
                <li><a href="#/cronograma-anual"><i className="fas fa-calendar-alt"></i> CRONOGRAMA ANUAL</a></li>
                <li className={`has-submenu ${activeSubmenus['cronograma'] ? 'active' : ''}`}>
                    <a href="#" onClick={() => toggleSubmenu('cronograma')}><i className="fas fa-calendar-week"></i> CRONOGRAMA MENSAL</a>
                    <ul className="submenu">
                        <li><a href="#/cronograma-mensal">Com Funcionários</a></li>
                    </ul>
                </li>
                <li className={`has-submenu ${activeSubmenus['os'] ? 'active' : ''}`}>
                    <a href="#" onClick={() => toggleSubmenu('os')}><i className="fas fa-tools"></i> OS</a>
                    <ul className="submenu">
                        <li><a href="#/os-corretiva">Corretiva</a></li>
                        <li><a href="#/os-planejada">Planejada</a></li>
                        <li><a href="#/os-preventiva">Preventiva</a></li>
                        <li><a href="#/historico-os">Histórico</a></li>
                    </ul>
                </li>
                <li><a href="#/report-mensal"><i className="fas fa-file-export"></i> REPORT MENSAL</a></li>
                <li><a href="#/report-diario"><i className="fas fa-exclamation-triangle"></i> REPORT DIÁRIO FALHAS</a></li>
                <li><a href="#/dispositivos"><i className="fas fa-map-marked-alt"></i> MAPA DISPOSITIVOS</a></li>
                <li><a href="#/analise-dados"><i className="fas fa-chart-bar"></i> ANÁLISE DE DADOS</a></li>
                <li className={`has-submenu ${activeSubmenus['dados'] ? 'active' : ''}`}>
                    <a href="#" onClick={() => toggleSubmenu('dados')}><i className="fas fa-database"></i> DADOS</a>
                    <ul className="submenu">
                        <li><a href="#/dados-equipamentos">Equipamentos</a></li>
                        <li><a href="#/dados-funcionarios">Funcionários</a></li>
                        <li><a href="#/dados-relatorios">Relatórios</a></li>
                        <li><a href="#/dados-exportacao">Exportação</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar; 