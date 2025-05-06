import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ServiceOrderInfo from './components/ServiceOrderInfo/ServiceOrderInfo';
import ServiceOrderPreview from './components/ServiceOrderPreview';
import './App.css';

function App() {
  // Estados para armazenar os dados do formulário
  const [isPreview, setIsPreview] = useState(false);
  const [activeSection, setActiveSection] = useState('report');

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

  // Estado para erros de validação
  const [errors, setErrors] = useState({});

  // Função para alternar entre modo de edição e preview
  const togglePreview = () => {
    setIsPreview(!isPreview);
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

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Salvar dados (aqui você implementaria a lógica real de salvamento)
    console.log('Salvando dados...', {
      manutencao, dataSolicitacao, dataExecucao, tipoEquipamento,
      localizacao, prioridade, numeroOS, requisitante, centroCusto,
      servico, observacao, acaoCorretiva, tagEquipamento
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
    <div className="app-container">
      <Sidebar
        onSave={handleSave}
        onEdit={handleEdit}
        onPreview={togglePreview}
        isPreview={isPreview}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="main-content">
        {activeSection === 'report' && (
          <div className="report-container">
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
                />
                <div className="print-button">
                  <button onClick={handlePrint}>Imprimir</button>
                </div>
              </>
            ) : (
              <ServiceOrderInfo
                manutencao={manutencao}
                setManutencao={setManutencao}
                dataSolicitacao={dataSolicitacao}
                setDataSolicitacao={setDataSolicitacao}
                dataExecucao={dataExecucao}
                setDataExecucao={setDataExecucao}
                tipoEquipamento={tipoEquipamento}
                setTipoEquipamento={setTipoEquipamento}
                localizacao={localizacao}
                setLocalizacao={setLocalizacao}
                prioridade={prioridade}
                setPrioridade={setPrioridade}
                numeroOS={numeroOS}
                setNumeroOS={setNumeroOS}
                requisitante={requisitante}
                setRequisitante={setRequisitante}
                centroCusto={centroCusto}
                servico={servico}
                setServico={setServico}
                observacao={observacao}
                setObservacao={setObservacao}
                acaoCorretiva={acaoCorretiva}
                setAcaoCorretiva={setAcaoCorretiva}
                errors={errors}
              />
            )}
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