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

// Database
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
    }
  }, []);

  // Salvar dados quando houver mudanças
  useEffect(() => {
    const data = {
      formData,
      osNumber,
      manutencaoCorretiva,
      naoProgramados,
      conclusao,
      attachments
    };

    saveFormData(data);
  }, [formData, osNumber, manutencaoCorretiva, naoProgramados, conclusao, attachments]);

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

  return (
    <div className="main-container">
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
      </div>
    </div>
  );
}

export default App;
