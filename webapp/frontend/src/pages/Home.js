import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Sistema de Relatórios de Manutenção</h1>
      <p>
        Bem-vindo ao sistema de geração de relatórios de manutenção. Este sistema permite criar relatórios de manutenção detalhados e exportá-los para o formato Word.
      </p>
      
      <div className="features" style={{ marginTop: '30px' }}>
        <h2>Funcionalidades</h2>
        <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li>Criação de relatórios detalhados</li>
          <li>Adição de peças utilizadas no serviço</li>
          <li>Exportação para formato Word</li>
          <li>Interface amigável e intuitiva</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/novo-relatorio" className="btn">
          Criar Novo Relatório
        </Link>
      </div>
    </div>
  );
};

export default Home; 