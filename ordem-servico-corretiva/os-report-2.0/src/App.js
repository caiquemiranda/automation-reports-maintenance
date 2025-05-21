import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ServiceDetails from './components/ServiceDetails';
import ActivityDetails from './components/ActivityDetails';
import EquipmentStatus from './components/EquipmentStatus';
import TechnicianInfo from './components/TechnicianInfo';
import ServiceOrderPreview from './components/ServiceOrderPreview';
import DocumentContainer from './components/DocumentContainer';
import './App.css';

function App() {
  // Estados para armazenar os dados do formulário
  const [isPreview, setIsPreview] = useState(false);
  const [activeSection, setActiveSection] = useState('report');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Estados para todos os campos do formulário
  const [manutencao, setManutencao] = useState('corretiva');
  const [dataSolicitacao, setDataSolicitacao] = useState('');
  const [dataExecucao, setDataExecucao] = useState('');
  const [tipoEquipamento, setTipoEquipamento] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [numeroOS, setNumeroOS] = useState('2023001');
  const [requisitante, setRequisitante] = useState('');
  const [centroCusto] = useState('C007');
  const [servico, setServico] = useState('');
  const [observacao, setObservacao] = useState('');
  const [acaoCorretiva, setAcaoCorretiva] = useState('');
  const [tagEquipamento, setTagEquipamento] = useState('NL-IQ207-603');
  const [status, setStatus] = useState('normal');
  const [tecnicoResponsavel, setTecnicoResponsavel] = useState('');
  const [equipe, setEquipe] = useState([]);

  // Estado para erros de validação
  const [errors, setErrors] = useState({});

  // Monitorar o estado da sidebar
  useEffect(() => {
    const handleSidebarChange = (expanded) => {
      setSidebarExpanded(expanded);
    };

    // Adicionar evento de monitoramento da sidebar (exemplo)
    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const isExpanded = sidebarElement.classList.contains('expanded');
            handleSidebarChange(isExpanded);
          }
        });
      });

      observer.observe(sidebarElement, { attributes: true });
      return () => observer.disconnect();
    }
  }, []);

  // Função para alternar entre modo de edição e preview
  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  // Função para atualizações da sidebar
  const handleSidebarToggle = (expanded) => {
    setSidebarExpanded(expanded);
  };

  // Funções de ação para a barra lateral
  const handleSave = () => {
    // Validar formulário
    let formErrors = {};

    if (!dataSolicitacao) formErrors.dataSolicitacao = true;
    if (!dataExecucao) formErrors.dataExecucao = true;
    if (!tipoEquipamento) formErrors.tipoEquipamento = true;
    if (!localizacao) formErrors.localizacao = true;
    if (!prioridade) formErrors.prioridade = true;
    if (!requisitante) formErrors.requisitante = true;
    if (!tecnicoResponsavel) formErrors.tecnicoResponsavel = true;

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Salvar dados (aqui você implementaria a lógica real de salvamento)
    console.log('Salvando dados...', {
      manutencao, dataSolicitacao, dataExecucao, tipoEquipamento,
      localizacao, prioridade, numeroOS, requisitante, centroCusto,
      servico, observacao, acaoCorretiva, tagEquipamento, status,
      tecnicoResponsavel, equipe
    });

    alert('Documento salvo com sucesso!');
  };

  const handleEdit = () => {
    // Implementar lógica para edição avançada se necessário
    setIsPreview(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`app-container ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <Sidebar
        onSave={handleSave}
        onEdit={handleEdit}
        onPreview={togglePreview}
        isPreview={isPreview}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onSidebarToggle={handleSidebarToggle}
      />

      <div className="main-content">
        {activeSection === 'report' && (
          <div className="report-container">
            <DocumentContainer isPreview={isPreview}>
              {isPreview ? (
                <>
                  <ServiceOrderPreview
                    manutencao={manutencao}
                    dataSolicitacao={dataSolicitacao}
                    dataExecucao={dataExecucao}
                    tipoEquipamento={tipoEquipamento}
                    localizacao={localizacao}
                    prioridade={prioridade}
                    numeroOS={numeroOS}
                    requisitante={requisitante}
                    centroCusto={centroCusto}
                    servico={servico}
                    observacao={observacao}
                    acaoCorretiva={acaoCorretiva}
                    tagEquipamento={tagEquipamento}
                    status={status}
                    tecnicoResponsavel={tecnicoResponsavel}
                    equipe={equipe}
                  />
                  <div className="print-button">
                    <button onClick={handlePrint}>Imprimir</button>
                  </div>
                </>
              ) : (
                <div className="form-container">
                  <Header
                    numeroOS={numeroOS}
                    manutencao={manutencao}
                    setManutencao={setManutencao}
                  />

                  <ServiceDetails
                    tagEquipamento={tagEquipamento}
                    setTagEquipamento={setTagEquipamento}
                    tipoEquipamento={tipoEquipamento}
                    setTipoEquipamento={setTipoEquipamento}
                    localizacao={localizacao}
                    setLocalizacao={setLocalizacao}
                    numeroOS={numeroOS}
                    setNumeroOS={setNumeroOS}
                    dataSolicitacao={dataSolicitacao}
                    setDataSolicitacao={setDataSolicitacao}
                    dataExecucao={dataExecucao}
                    setDataExecucao={setDataExecucao}
                    prioridade={prioridade}
                    setPrioridade={setPrioridade}
                    requisitante={requisitante}
                    setRequisitante={setRequisitante}
                    centroCusto={centroCusto}
                    errors={errors}
                  />

                  <ActivityDetails
                    servico={servico}
                    setServico={setServico}
                    observacao={observacao}
                    setObservacao={setObservacao}
                    acaoCorretiva={acaoCorretiva}
                    setAcaoCorretiva={setAcaoCorretiva}
                  />

                  <EquipmentStatus
                    status={status}
                    setStatus={setStatus}
                  />

                  <TechnicianInfo
                    tecnicoResponsavel={tecnicoResponsavel}
                    setTecnicoResponsavel={setTecnicoResponsavel}
                    equipe={equipe}
                    setEquipe={setEquipe}
                    errors={errors}
                  />
                </div>
              )}
            </DocumentContainer>
          </div>
        )}

        {activeSection === 'history' && (
          <div className="history-container">
            <h2>Histórico de Ordens de Serviço</h2>
            <p>Aqui será exibido o histórico de ordens de serviço.</p>
            {/* Implementar o componente de histórico aqui */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;