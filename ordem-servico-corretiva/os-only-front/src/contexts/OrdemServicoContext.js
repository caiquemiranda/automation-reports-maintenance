import React, { createContext, useState, useContext } from 'react';

const OrdemServicoContext = createContext();

export const useOrdemServico = () => useContext(OrdemServicoContext);

export const OrdemServicoProvider = ({ children }) => {
    const [numeroOs, setNumeroOs] = useState('305470');
    const [attachments, setAttachments] = useState([]);
    const [info, setInfo] = useState({
        codigoManutencao: '__________',
        dataSolicitacao: '26/05/2023',
        nomeEquipamento: 'Sistema de Alarme de Incêndio',
        dataExecucao: '27/05/2023',
        localizacao: 'Dispensário No.140.215 Fábrica de Farinha',
        prioridade: 'Rotina Pamoate',
        centroCusto: 'C097'
    });
    const [servico, setServico] = useState('Troca da lente, após o detector de Fumaça (N)-140.215.F30');
    const [observacao, setObservacao] = useState('O dispositivo encontrava-se danificado como citou "no cheiro" no final de inspeção, pessoal fumando escondido.');
    const [acaoCorretiva, setAcaoCorretiva] = useState(`
    <p>Foi realizada a troca do dispositivo por um novo do mesmo modelo (sensor de fumaça convencional),
        onde foi realizado a limpeza interna das conexões e ajuste no dispositivo, o que normalizou o
        seu funcionamento conforme especificações. Programação e instalação do detector de fumaça após a
        troca do equipamento que apresentava problema.</p>
    <ul>
        <li>Teste de formato</li>
        <li>Teste de comunicação com painel</li>
        <li>Funcionamento do detector</li>
    </ul>
  `);
    const [conclusion, setConclusion] = useState({
        equipamentoNormal: false,
        equipamentoParcial: false,
        equipamentoInoperante: false
    });
    const [dates, setDates] = useState({
        assistenteDate: '__/__/____',
        clienteDate: '__/__/____',
        supervisorDate: '__/__/____',
        frequenciaDate: '__/__/____'
    });

    const handleOsNumberChange = (value) => {
        setNumeroOs(value);
    };

    const handleInfoChange = (field, value) => {
        setInfo({
            ...info,
            [field]: value
        });
    };

    const handleServicoChange = (value) => {
        setServico(value);
    };

    const handleObservacaoChange = (value) => {
        setObservacao(value);
    };

    const handleAcaoCorretivaChange = (value) => {
        setAcaoCorretiva(value);
    };

    const handleConclusionChange = (field) => {
        setConclusion({
            ...conclusion,
            [field]: !conclusion[field]
        });
    };

    const handleDateChange = (field, value) => {
        setDates({
            ...dates,
            [field]: value
        });
    };

    const handleAddAttachment = (files) => {
        const newAttachments = [...attachments];

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newAttachments.push({
                    id: Date.now() + Math.random(),
                    src: e.target.result,
                    description: 'Descrição da imagem...'
                });
                setAttachments([...newAttachments]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveAttachment = (id) => {
        setAttachments(attachments.filter(attachment => attachment.id !== id));
    };

    const handleUpdateAttachmentDescription = (id, description) => {
        setAttachments(attachments.map(attachment =>
            attachment.id === id ? { ...attachment, description } : attachment
        ));
    };

    const value = {
        numeroOs,
        info,
        servico,
        observacao,
        acaoCorretiva,
        conclusion,
        dates,
        attachments,
        handleOsNumberChange,
        handleInfoChange,
        handleServicoChange,
        handleObservacaoChange,
        handleAcaoCorretivaChange,
        handleConclusionChange,
        handleDateChange,
        handleAddAttachment,
        handleRemoveAttachment,
        handleUpdateAttachmentDescription
    };

    return (
        <OrdemServicoContext.Provider value={value}>
            {children}
        </OrdemServicoContext.Provider>
    );
};

export default OrdemServicoContext; 