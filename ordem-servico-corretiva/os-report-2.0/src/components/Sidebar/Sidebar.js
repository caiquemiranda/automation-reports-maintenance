import React from 'react';
import './Sidebar.css';

const Sidebar = () => (
    <aside className="sidebar">
        <button className="sidebar-btn">Salvar documento</button>
        <button className="sidebar-btn">Editar documento</button>
        <button className="sidebar-btn">Preview documento</button>
    </aside>
);

export default Sidebar; 