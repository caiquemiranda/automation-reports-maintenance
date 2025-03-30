import React, { useState, useEffect } from 'react';
import './App.css';

// Componentes
import Header from './components/Header';
import InfoSection from './components/InfoSection';
import ServiceSection from './components/ServiceSection';
import ObservationSection from './components/ObservationSection';
import ActionSection from './components/ActionSection';
import AttachmentSection from './components/AttachmentSection';
import ConclusionSection from './components/ConclusionSection';
import SignaturesSection from './components/SignaturesSection';
import SavedDocumentView from './components/SavedDocumentView';
import Sidebar from './components/Sidebar';

// Serviços
import { documentosService } from './services/api';
import { initDB, saveFormData, getFormData } from './utils/database';

// Dados iniciais para lista de requisitantes
const REQUISITANTES = [
  { id: 1, nome: 'Carlos Eduardo' },
  { id: 2, nome: 'Mariana Alves' },
  { id: 3, nome: 'Roberto Santos' },
  { id: 4, nome: 'Ana Carolina' },
  { id: 5, nome: 'Pedro Henrique' }
];

// Dados iniciais do formulário
const initialFormData = {
  codigoManutencao: '',
  dataSolicitacao: '',
  nomeEquipamento: 'Sistema de Alarme de Incêndio',
  dataExecucao: '',
  localizacao: 'Dispensário No.140.215 Fábrica de Farinha',
  prioridade: 'Rotina Pamoate',
  requisitante: '',
  centroCusto: 'C097',
  servico: 'Troca da lente, após o detector de Fumaça (N)-140.215.F30',
  observacao: 'O dispositivo encontrava-se danificado como citou "no cheiro" no final de inspeção, pessoal fumando escondido.',
  acaoCorretiva: 'Foi realizada a troca do dispositivo por um novo do mesmo modelo (sensor de fumaça convencional), onde foi realizado a limpeza interna das conexões e ajuste no dispositivo, o que normalizou o seu funcionamento conforme especificações. Programação e instalação do detector de fumaça após a troca do equipamento que apresentava problema.',
  datas: ['', '', '', '']
};

function App() {
  const [osNumber, setOsNumber] = useState('305470');
  const [manutencaoCorretiva, setManutencaoCorretiva] = useState(true);
  const [naoProgramados, setNaoProgramados] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [conclusao, setConclusao] = useState({
    normal: false,
    parcial: false,
    inoperante: false
  });
  const [attachments, setAttachments] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' ou 'view'
  const [savedDocument, setSavedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Controlador da visibilidade da barra lateral
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  // Formatação das datas para o formato do componente date
  useEffect(() => {
    const formatDatasToDateInput = () => {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

      setFormData(prev => ({
        ...prev,
        dataSolicitacao: prev.dataSolicitacao || today,
        dataExecucao: prev.dataExecucao || tomorrowFormatted,
      }));
    };

    formatDatasToDateInput();
  }, []);

  // Inicializar o banco de dados e carregar dados salvos
  useEffect(() => {
    initDB();
    const savedData = getFormData();

    if (savedData) {
      if (savedData.formData) setFormData(savedData.formData);
      if (savedData.osNumber) setOsNumber(savedData.osNumber);
      if (savedData.manutencaoCorretiva !== undefined) setManutencaoCorretiva(savedData.manutencaoCorretiva);
      if (savedData.naoProgramados !== undefined) setNaoProgramados(savedData.naoProgramados);
      if (savedData.conclusao) setConclusao(savedData.conclusao);
      if (savedData.attachments) setAttachments(savedData.attachments);
      if (savedData.actionItems) setActionItems(savedData.actionItems);
    }

    // Verificar o serviço de backend ao iniciar
    checkBackendService();

    // Verifica se há um documento para visualizar na URL
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('document');
    if (documentId) {
      obterDocumentoPorId(documentId);
    }

    // Adicionar um listener para detectar cliques na barra lateral
    document.addEventListener('click', (e) => {
      if (e.target.closest('.sidebar-toggle')) {
        toggleSidebar();
      }
    });

    // Limpar listener quando o componente for desmontado
    return () => {
      document.removeEventListener('click', toggleSidebar);
    };
  }, []);

  // Verifica se o serviço de backend está funcionando
  const checkBackendService = async () => {
    try {
      // Tenta acessar o endpoint de health check
      await fetch(`${process.env.REACT_APP_API_URL}/health`);
      console.log('Backend conectado com sucesso');
    } catch (err) {
      console.error('Erro ao conectar ao backend:', err);
      setError('Não foi possível conectar ao servidor. Alguns recursos podem não funcionar corretamente.');
    }
  };

  // Salvar dados quando houver mudanças
  useEffect(() => {
    // Só salva se estiver no modo de edição
    if (viewMode === 'edit') {
      const data = {
        formData,
        osNumber,
        manutencaoCorretiva,
        naoProgramados,
        conclusao,
        attachments,
        actionItems
      };

      // Salvar apenas localmente no IndexedDB
      saveFormData(data);

      // Não salvar automaticamente no backend a cada alteração
      // const hasMinimumData = formData.nomeEquipamento && osNumber;
      // if (hasMinimumData) {
      //   autoSaveToDatabase(data);
      // }
    }
  }, [formData, osNumber, manutencaoCorretiva, naoProgramados, conclusao, attachments, actionItems, viewMode]);

  // Função para salvar automaticamente no banco de dados
  // Comentada para evitar o salvamento automático a cada alteração
  /*
  const autoSaveToDatabase = async (data) => {
    try {
      // Prepara o documento para ser salvo
      const documentoData = {
        osNumber,
        manutencaoCorretiva,
        naoProgramados,
        dados: {
          formData,
          attachments,
          actionItems,
          conclusao
        },
        // Extrair campos principais para facilitar busca
        codigoManutencao: formData.codigoManutencao,
        dataSolicitacao: formData.dataSolicitacao,
        dataExecucao: formData.dataExecucao,
        nomeEquipamento: formData.nomeEquipamento,
        localizacao: formData.localizacao,
        requisitante: formData.requisitante
      };

      // Verificar se já existe um documento com este número de OS
      try {
        const documentosExistentes = await documentosService.listarDocumentos(0, 100);
        const documentoExistente = documentosExistentes.find(doc => doc.osNumber === osNumber);
        
        if (documentoExistente) {
          // Atualiza o documento existente
          await documentosService.atualizarDocumento(documentoExistente.id, documentoData);
          console.log('Documento atualizado automaticamente no banco de dados');
        } else {
          // Cria um novo documento
          await documentosService.criarDocumento(documentoData);
          console.log('Documento salvo automaticamente no banco de dados');
        }
      } catch (err) {
        console.error('Erro ao verificar documentos existentes:', err);
      }
    } catch (err) {
      console.error('Erro no salvamento automático:', err);
    }
  };
  */

  const obterDocumentoPorId = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const documento = await documentosService.obterDocumento(id);
      setSavedDocument(documento);
      setViewMode('view');
    } catch (err) {
      console.error('Erro ao obter documento:', err);
      setError('Não foi possível carregar o documento. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleDateChange = (index, value) => {
    const newDates = [...formData.datas];
    newDates[index] = value;
    setFormData({
      ...formData,
      datas: newDates
    });
  };

  const handleConclusaoChange = (field, value) => {
    setConclusao({
      ...conclusao,
      [field]: value
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDocument = async () => {
    setIsLoading(true);
    setError(null);

    // Prepara o documento para ser salvo
    const documentoData = {
      osNumber,
      manutencaoCorretiva,
      naoProgramados,
      dados: {
        formData,
        attachments,
        actionItems,
        conclusao
      },
      // Extrair campos principais para facilitar busca
      codigoManutencao: formData.codigoManutencao,
      dataSolicitacao: formData.dataSolicitacao,
      dataExecucao: formData.dataExecucao,
      nomeEquipamento: formData.nomeEquipamento,
      localizacao: formData.localizacao,
      requisitante: formData.requisitante
    };

    try {
      let documentoSalvo;

      // Verificar se o backend está disponível
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/health`, { 
          method: 'GET',
          timeout: 5000 
        });
      } catch (healthError) {
        console.error('Backend não está acessível:', healthError);
        setError('O servidor de backend não está disponível. Verifique se o serviço está em execução.');
        setIsLoading(false);
        return;
      }

      // Primeiro, tenta recuperar todos os documentos para verificar se já existe um com o mesmo número de OS
      const documentosExistentes = await documentosService.listarDocumentos(0, 100);
      const documentoExistente = documentosExistentes.find(doc => doc.osNumber === osNumber);

      if (documentoExistente) {
        // Se já existe um documento com o mesmo número de OS, atualiza-o
        console.log('Encontrado documento existente, atualizando...', documentoExistente.id);
        documentoSalvo = await documentosService.atualizarDocumento(documentoExistente.id, documentoData);
      } else {
        // Caso contrário, cria um novo documento
        console.log('Criando novo documento...');
        documentoSalvo = await documentosService.criarDocumento(documentoData);
      }

      // Atualiza o estado com o documento salvo
      setSavedDocument(documentoSalvo);
      setViewMode('view');

      // Atualiza a URL para refletir o documento visualizado - usar um formato claro com o número da OS
      const url = new URL(window.location);
      url.searchParams.delete('document'); // Remover parâmetro antigo se existir
      url.pathname = `/documento/${documentoSalvo.osNumber}/${documentoSalvo.id}`; // Formato mais claro
      window.history.pushState({}, '', url);

      // Exibir mensagem de sucesso para o usuário
      console.log(`Documento salvo com sucesso: OS-${osNumber}`);
      // Forçar a atualização do banco de dados para refletir as mudanças
      await documentosService.listarDocumentos(0, 1, true); // true = forçar atualização do cache
    } catch (err) {
      console.error('Erro detalhado ao salvar documento:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      // Mensagem de erro mais específica para o usuário
      let mensagemErro = 'Não foi possível salvar o documento.';
      
      if (err.response) {
        if (err.response.status === 404) {
          mensagemErro += ' Endpoint da API não encontrado. Verifique se o backend está em execução.';
        } else if (err.response.status === 500) {
          mensagemErro += ' Erro interno no servidor.';
        } else {
          mensagemErro += ` Erro ${err.response.status}: ${err.response.statusText || ''}`;
        }
        
        if (err.response.data && err.response.data.detail) {
          mensagemErro += ` Detalhe: ${err.response.data.detail}`;
        }
      } else if (err.request) {
        mensagemErro += ' Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está em execução.';
      } else {
        mensagemErro += ` ${err.message}`;
      }
      
      setError(mensagemErro);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEdit = () => {
    setViewMode('edit');
    setSavedDocument(null);

    // Remove o parâmetro de documento da URL
    const url = new URL(window.location);
    url.searchParams.delete('document');
    window.history.pushState({}, '', url);
  };

  const handleSelectDocument = (documentId) => {
    obterDocumentoPorId(documentId);
  };

  // Renderiza o documento em modo de visualização
  if (viewMode === 'view' && savedDocument) {
    return (
      <>
        <Sidebar onSelectDocument={handleSelectDocument} />
        <SavedDocumentView document={savedDocument} onBack={handleBackToEdit} />
      </>
    );
  }

  // Renderiza o formulário em modo de edição
  return (
    <>
      <Sidebar onSelectDocument={handleSelectDocument} />

      <div className={`main-container ${sidebarVisible ? 'with-sidebar' : ''}`}>
        {error && <div className="error-message">{error}</div>}

        <div className="edit-buttons">
          <button className="btn-action" onClick={handlePrint}>Imprimir Documento</button>
          <button className="btn-action" onClick={toggleSidebar}>{sidebarVisible ? 'Ocultar Histórico' : 'Mostrar Histórico'}</button>
        </div>

        <div className="container" id="document">
          <Header
            osNumber={osNumber}
            setOsNumber={setOsNumber}
            manutencaoCorretiva={manutencaoCorretiva}
            setManutencaoCorretiva={setManutencaoCorretiva}
            naoProgramados={naoProgramados}
            setNaoProgramados={setNaoProgramados}
          />

          <div className="divider"></div>

          <InfoSection
            formData={formData}
            handleInputChange={handleInputChange}
            osNumber={osNumber}
            setOsNumber={setOsNumber}
            requisitantes={REQUISITANTES}
          />

          <div className="divider strong-divider"></div>

          <ServiceSection
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <ObservationSection
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <ActionSection
            formData={formData}
            handleInputChange={handleInputChange}
            actionItems={actionItems}
            setActionItems={setActionItems}
          />

          <AttachmentSection
            attachments={attachments}
            setAttachments={setAttachments}
          />

          <ConclusionSection
            conclusao={conclusao}
            handleConclusaoChange={handleConclusaoChange}
          />

          <SignaturesSection
            formData={formData}
            handleDateChange={handleDateChange}
          />

          {/* Botão para salvar o documento */}
          <div className="save-document-container">
            <button
              className="btn-save-document"
              onClick={handleSaveDocument}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Documento Final'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
