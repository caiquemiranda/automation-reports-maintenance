import React from 'react';

function TopBar({ toggleSidebar }) {
  return (
    <div className="top-bar">
      <div className="top-title">
        <h1>Sistema de Manutenção</h1>
      </div>
      <div className="top-icons">
        <i className="fas fa-bars" id="sidebar-toggle" onClick={toggleSidebar}></i>
        <i className="fas fa-question-circle" id="help-icon"></i>
        <i className="fas fa-cog" id="settings-icon"></i>
        <i className="fas fa-user-circle" id="profile-icon"></i>
      </div>
    </div>
  );
}

export default TopBar; 