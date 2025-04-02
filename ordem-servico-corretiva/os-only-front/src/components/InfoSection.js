import React, { useState } from 'react';
import './InfoSection.css';

const InfoSection = ({ numeroOs }) => {
    const [info, setInfo] = useState({
        codigoManutencao: '__________',
        dataSolicitacao: '26/05/2023',
        nomeEquipamento: 'Sistema de Alarme de Incêndio',
        dataExecucao: '27/05/2023',
        localizacao: 'Dispensário No.140.215 Fábrica de Farinha',
        prioridade: 'Rotina Pamoate',
        centroCusto: 'C097'
    });

    const handleInfoChange = (field, e) => {
        setInfo({
            ...info,
            [field]: e.target.textContent
        });
    };

    return (
        <div className="info-section">
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">Código de Manutenção:</div>
                    <div
                        className="info-value"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleInfoChange('codigoManutencao', e)}
                    >
                        {info.codigoManutencao}
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-label">Data de Solicitação:</div>
                    <div
                        className="info-value"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleInfoChange('dataSolicitacao', e)}
                    >
                        {info.dataSolicitacao}
                    </div>
                </div>
            </div>
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">Nome do Equipamento:</div>
                    <div
                        className="info-value"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleInfoChange('nomeEquipamento', e)}
                    >
                        {info.nomeEquipamento}
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-label">Data de Execução:</div>
                    <div
                        className="info-value"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleInfoChange('dataExecucao', e)}
                    >
                        {info.dataExecucao}
                    </div>
                </div>
            </div>
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">Localização:</div>
                    <div
                        className="info-value"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleInfoChange('localizacao', e)}
                    >
                        {info.localizacao}
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-label">Prioridade:</div>
                    <div
                        className="info-value"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleInfoChange('prioridade', e)}
                    >
                        {info.prioridade}
                    </div>
                </div>
            </div>
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">Número da O.S.:</div>
                    <div className="info-value os-number">
                        OS-{numeroOs}
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-label">Centro de custo:</div>
                    <div
                        className="info-value"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleInfoChange('centroCusto', e)}
                    >
                        {info.centroCusto}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoSection; 