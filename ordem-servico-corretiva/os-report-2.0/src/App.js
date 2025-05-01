import React, { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ServiceOrderInfo from './components/ServiceOrderInfo/ServiceOrderInfo';
import Conclusion from './components/Conclusion/Conclusion';
import TechnicianInfo from './components/TechnicianInfo/TechnicianInfo';
import './App.css';

function App() {
  // Estados dos campos obrigatórios
  const [manutencao, setManutencao] = useState('corretiva');
  const [dataSolicitacao, setDataSolicitacao] = useState('2023-03-08');
  const [dataExecucao, setDataExecucao] = useState('');
  const [tipoEquipamento, setTipoEquipamento] = useState('Detector de Fumaça');
  const [localizacao, setLocalizacao] = useState('Depósito NL-140.215 Fábrica da Família');
  const [prioridade, setPrioridade] = useState('Baixa');
  const [numeroOS] = useState('305489');
  const [requisitante, setRequisitante] = useState('Roberto Santos');
  const [centroCusto, setCentroCusto] = useState('C007');
  const [servico, setServico] = useState('Troca de laço, após o detector de fumaça (NL-140.215-F30)');
  const [observacao, setObservacao] = useState('O dispositivo estava com "falha de laço" ou "laço aberto" no final da inspeção, precisou formato secundário.');
  const [acaoCorretiva, setAcaoCorretiva] = useState('Foi realizado teste do dispositivo por um novo laço de mesmo modelo...');
  const [selectedTech, setSelectedTech] = useState('Carla Fernandes');
  const [materials, setMaterials] = useState([]);
  const [errors, setErrors] = useState({});
  const [conclusion, setConclusion] = useState('normal');

  const validate = () => {
    const newErrors = {};
    if (!manutencao) newErrors.manutencao = true;
    if (!dataSolicitacao) newErrors.dataSolicitacao = true;
    if (!dataExecucao) newErrors.dataExecucao = true;
    if (!tipoEquipamento) newErrors.tipoEquipamento = true;
    if (!localizacao) newErrors.localizacao = true;
    if (!prioridade) newErrors.prioridade = true;
    if (!requisitante) newErrors.requisitante = true;
    if (!centroCusto) newErrors.centroCusto = true;
    if (!servico) newErrors.servico = true;
    if (!observacao) newErrors.observacao = true;
    if (!acaoCorretiva) newErrors.acaoCorretiva = true;
    if (!selectedTech) newErrors.selectedTech = true;
    if (!materials || materials.length === 0) newErrors.materials = true;
    if (!conclusion) newErrors.conclusion = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      alert('Documento salvo com sucesso!');
    } else {
      alert('Preencha todos os campos obrigatórios.');
    }
  };

  return (
    <div className="App">
      <Sidebar />
      <div className="content-with-sidebar">
        <Header />
        <main className="main-content">
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
            setNumeroOS={() => { }}
            requisitante={requisitante}
            setRequisitante={setRequisitante}
            centroCusto={centroCusto}
            setCentroCusto={setCentroCusto}
            servico={servico}
            setServico={setServico}
            observacao={observacao}
            setObservacao={setObservacao}
            acaoCorretiva={acaoCorretiva}
            setAcaoCorretiva={setAcaoCorretiva}
            errors={errors}
          />
          <Conclusion
            conclusion={conclusion}
            setConclusion={setConclusion}
            errors={errors}
          />
          <TechnicianInfo
            selectedTech={selectedTech}
            setSelectedTech={setSelectedTech}
            materials={materials}
            setMaterials={setMaterials}
            errors={errors}
          />
          <button className="sidebar-btn" style={{ marginTop: 24 }} onClick={handleSave}>Salvar documento</button>
        </main>
      </div>
    </div>
  );
}

export default App;
