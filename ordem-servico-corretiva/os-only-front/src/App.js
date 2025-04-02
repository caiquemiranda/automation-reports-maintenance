import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import InfoSection from './components/InfoSection';
import ServiceSection from './components/ServiceSection';
import AttachmentSection from './components/AttachmentSection';
import ConclusionSection from './components/ConclusionSection';
import ResponsavelMaterialSection from './components/SignatureSection';
import EditControls from './components/EditControls';

function App() {
    const [formData, setFormData] = useState({
        numeroOs: '305470',
        manutencaoCorretiva: true,
        naoProgramados: false,
        codigoManutencao: '__________',
        dataSolicitacao: '26/05/2023',
        nomeEquipamento: 'Sistema de Alarme de Incêndio',
        dataExecucao: '27/05/2023',
        localizacao: 'Dispensário No.140.215 Fábrica de Farinha',
        prioridade: 'Rotina Pamoate',
        centroCusto: 'C097',
        servico: 'Troca da lente, após o detector de Fumaça (N)-140.215.F30',
        observacao: 'O dispositivo encontrava-se danificado como citou "no cheiro" no final de inspeção, pessoal fumando escondido.',
        acaoCorretiva: 'Foi realizada a troca do dispositivo por um novo do mesmo modelo (sensor de fumaça convencional), onde foi realizada a limpeza interna das conexões e ajuste no dispositivo, o que normalizou o seu funcionamento conforme especificações. Programação e instalação do detector de fumaça após a troca do equipamento que apresentava problema.',
        acaoCorretivaItens: [
            'Teste de formato',
            'Teste de comunicação com painel',
            'Funcionamento do detector'
        ],
        anexos: [],
        conclusao: {
            equipamentoNormal: false,
            equipamentoParcial: false,
            equipamentoInoperante: false
        },
        tecnicoResponsavel: '',
        materiaisUtilizados: ''
    });

    const handleChange = (section, field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value
            }
        }));
    };

    const handleFieldChange = (field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSave = () => {
        alert('Funcionalidade de salvar seria implementada aqui (ex: exportar para PDF)');
    };

    const handleAddAttachment = (files) => {
        if (!files.length) return;

        const newAttachments = Array.from(files).map(file => ({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            file: file,
            url: URL.createObjectURL(file),
            description: 'Descrição da imagem...'
        }));

        setFormData(prevData => ({
            ...prevData,
            anexos: [...prevData.anexos, ...newAttachments]
        }));
    };

    const handleRemoveAttachment = (id) => {
        setFormData(prevData => ({
            ...prevData,
            anexos: prevData.anexos.filter(anexo => anexo.id !== id)
        }));
    };

    return (
        <div className="main-container">
            <EditControls
                onSave={handleSave}
                onPrint={handlePrint}
            />

            <div className="container" id="document">
                <Header
                    numeroOs={formData.numeroOs}
                    manutencaoCorretiva={formData.manutencaoCorretiva}
                    naoProgramados={formData.naoProgramados}
                    onChange={handleFieldChange}
                />

                <div className="divider"></div>

                <InfoSection
                    formData={formData}
                    onChange={handleFieldChange}
                />

                <div className="divider strong-divider"></div>

                <ServiceSection
                    servico={formData.servico}
                    observacao={formData.observacao}
                    acaoCorretiva={formData.acaoCorretiva}
                    acaoCorretivaItens={formData.acaoCorretivaItens}
                    onChange={handleFieldChange}
                />

                <AttachmentSection
                    anexos={formData.anexos}
                    onAddAttachment={handleAddAttachment}
                    onRemoveAttachment={handleRemoveAttachment}
                    onChangeDescription={(id, desc) => {
                        setFormData(prevData => ({
                            ...prevData,
                            anexos: prevData.anexos.map(anexo =>
                                anexo.id === id ? { ...anexo, description: desc } : anexo
                            )
                        }));
                    }}
                />

                <ConclusionSection
                    conclusao={formData.conclusao}
                    onChange={(field, value) => handleChange('conclusao', field, value)}
                />

                <ResponsavelMaterialSection
                    tecnicoResponsavel={formData.tecnicoResponsavel}
                    materiaisUtilizados={formData.materiaisUtilizados}
                    onChange={handleFieldChange}
                />
            </div>
        </div>
    );
}

export default App;
