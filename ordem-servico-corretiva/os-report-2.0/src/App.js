import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ServiceDetails from './components/ServiceDetails';
import ActivityDetails from './components/ActivityDetails';
import EquipmentStatus from './components/EquipmentStatus';
import TechnicianInfo from './components/TechnicianInfo';
import MaterialsUsed from './components/MaterialsUsed';
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
  const [materials, setMaterials] = useState([]);

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

  // Correção do useEffect de migração de materiais
  useEffect(() => {
    const updatedMaterials = materials.map(material => {
      if (typeof material === 'string') {
        return { name: material, quantity: 1 };
      }
      return material;
    });
    if (JSON.stringify(materials) !== JSON.stringify(updatedMaterials)) {
      setMaterials(updatedMaterials);
    }
  }, [materials]);

  // Correção do useEffect para remover bordas na impressão e preview
  useEffect(() => {
    const removeDashedBorders = () => {
      document.querySelectorAll('.preview-section .value, .preview-section .value *').forEach(el => {
        el.style.setProperty('border', 'none', 'important');
        el.style.setProperty('border-bottom', 'none', 'important');
        el.style.setProperty('border-top', 'none', 'important');
        el.style.setProperty('border-right', 'none', 'important');
        el.style.setProperty('border-left', 'none', 'important');
        el.style.setProperty('border-style', 'none', 'important');
        el.style.setProperty('border-image', 'none', 'important');
      });
    };
    window.addEventListener('beforeprint', removeDashedBorders);
    if (isPreview) {
      removeDashedBorders();
    }
    return () => window.removeEventListener('beforeprint', removeDashedBorders);
  }, [isPreview]);

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
      tecnicoResponsavel, equipe, materials
    });

    alert('Documento salvo com sucesso!');
  };

  const handleEdit = () => {
    // Implementar lógica para edição avançada se necessário
    setIsPreview(false);
  };

  const handlePrint = () => {
    // Adiciona classe para impressão
    document.body.classList.add('printing');

    // Cria uma folha de estilo temporária para a impressão
    const style = document.createElement('style');
    style.id = 'print-style-override';
    style.innerHTML = `
      @media print {
        .preview-item {
          display: flex !important;
          flex-direction: row !important;
          align-items: baseline !important;
          width: 100% !important;
        }
        
        .preview-item .label {
          min-width: 150px !important;
          font-weight: bold !important;
          display: inline-block !important;
          text-align: left !important;
        }
        
        .preview-item .value {
          flex: 1 !important;
          padding-left: 8px !important;
          border-bottom: 1px dotted #000 !important;
          display: inline-block !important;
          text-align: left !important;
        }
        
        .materials-table {
          width: 100% !important;
          border-collapse: collapse !important;
          border: 1px solid #000 !important;
        }
        
        .materials-table th,
        .materials-table td {
          border: 1px solid #000 !important;
          padding: 8px 10px !important;
        }
        
        .status-box {
          border: 1px solid #000 !important;
          background-color: #e6f7ff !important;
          padding: 10px 15px !important;
          border-radius: 4px !important;
          display: inline-block !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Pequeno atraso para garantir que os estilos sejam aplicados
    setTimeout(() => {
      window.print();

      // Remove a classe e o estilo temporário após a impressão
      setTimeout(() => {
        document.body.classList.remove('printing');
        const tempStyle = document.getElementById('print-style-override');
        if (tempStyle) {
          document.head.removeChild(tempStyle);
        }
      }, 500);
    }, 100);
  };

  // Renderizar o conteúdo do documento (compartilhado entre modo edição e preview)
  const renderDocumentContent = () => {
    if (isPreview) {
      return (
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
            materials={materials}
          />
          <div className="print-button">
            <button onClick={handlePrint}>Imprimir</button>
          </div>
        </>
      );
    } else {
      return (
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

          <MaterialsUsed
            materials={materials}
            setMaterials={setMaterials}
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
      );
    }
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
              {renderDocumentContent()}
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