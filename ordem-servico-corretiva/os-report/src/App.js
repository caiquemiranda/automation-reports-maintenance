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

    // Verifica se há um documento para visualizar na URL
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('document');
    if (documentId) {
      obterDocumentoPorId(documentId);
    }
  }, []);

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

      saveFormData(data);
    }
  }, [formData, osNumber, manutencaoCorretiva, naoProgramados, conclusao, attachments, actionItems, viewMode]);

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
      // Salva o documento na API
      const documentoSalvo = await documentosService.criarDocumento(documentoData);

      // Atualiza o estado com o documento salvo
      setSavedDocument(documentoSalvo);
      setViewMode('view');

      // Atualiza a URL para refletir o documento visualizado
      const url = new URL(window.location);
      url.searchParams.set('document', documentoSalvo.id);
      window.history.pushState({}, '', url);
    } catch (err) {
      console.error('Erro ao salvar documento:', err);
      setError('Não foi possível salvar o documento. Por favor, tente novamente.');
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

  // Renderiza o documento em modo de visualização
  if (viewMode === 'view' && savedDocument) {
    return <SavedDocumentView document={savedDocument} onBack={handleBackToEdit} />;
  }

  // Renderiza o formulário em modo de edição
  return (
    <div className="main-container">
      {error && <div className="error-message">{error}</div>}

      <div className="edit-buttons">
        <button className="btn-action" onClick={handlePrint}>Imprimir Documento</button>
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
  );
}

export default App;
