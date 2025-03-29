import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        Sistema de Relatórios de Manutenção
      </div>
      <div className="nav-links">
        <Link to="/">Início</Link>
        <Link to="/novo-relatorio">Novo Relatório</Link>
      </div>
    </div>
  );
};

export default Navbar; 