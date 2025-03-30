import React, { useState, useEffect } from 'react';
import { documentosService } from '../services/api';

/**
 * Componente de barra lateral com opções de navegação e histórico
 * @param {Object} props 
 * @param {Function} props.onSelectDocument - Função chamada quando um documento é selecionado
 */
const Sidebar = ({ onSelectDocument }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar documentos do histórico
  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const docs = await documentosService.listarDocumentos(0, 10);
      setDocuments(docs);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError('Não foi possível carregar o histórico de documentos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar histórico quando a barra lateral for aberta
  useEffect(() => {
    if (isVisible) {
      loadDocuments();
    }
  }, [isVisible]);

  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('pt-BR', options);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="sidebar-toggle" onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? '<<' : '>>'}
      </div>
      
      {isVisible && (
        <div className="sidebar-content">
          <h3>Histórico</h3>
          
          {isLoading && <div className="loading">Carregando...</div>}
          
          {error && <div className="error-message">{error}</div>}
          
          {!isLoading && !error && (
            <div className="document-list">
              {documents.length === 0 ? (
                <p>Nenhum documento salvo encontrado.</p>
              ) : (
                <ul>
                  {documents.map(doc => (
                    <li key={doc.id} onClick={() => onSelectDocument(doc.id)}>
                      <div className="doc-title">OS-{doc.osNumber}</div>
                      <div className="doc-info">
                        {doc.nomeEquipamento || 'Sem título'}
                      </div>
                      <div className="doc-date">
                        {formatDate(doc.data_criacao)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          <button
            className="btn-refresh"
            onClick={loadDocuments}
            disabled={isLoading}
          >
            Atualizar
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 