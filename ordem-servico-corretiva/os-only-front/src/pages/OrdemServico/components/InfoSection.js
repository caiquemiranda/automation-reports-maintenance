import React from 'react';
import './InfoSection.css';
import { useOrdemServico } from '../../../contexts/OrdemServicoContext';
import EditableField from '../../../components/common/EditableField';

const InfoSection = () => {
    const {
        numeroOs,
        info,
        handleInfoChange
    } = useOrdemServico();

    const handleFieldChange = (field) => (value) => {
        handleInfoChange(field, value);
    };

    return (
        <div className="info-section">
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">Código de Manutenção:</div>
                    <EditableField
                        className="info-value"
                        value={info.codigoManutencao}
                        onChange={handleFieldChange('codigoManutencao')}
                    />
                </div>
                <div className="info-item">
                    <div className="info-label">Data de Solicitação:</div>
                    <EditableField
                        className="info-value"
                        value={info.dataSolicitacao}
                        onChange={handleFieldChange('dataSolicitacao')}
                    />
                </div>
            </div>
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">Nome do Equipamento:</div>
                    <EditableField
                        className="info-value"
                        value={info.nomeEquipamento}
                        onChange={handleFieldChange('nomeEquipamento')}
                    />
                </div>
                <div className="info-item">
                    <div className="info-label">Data de Execução:</div>
                    <EditableField
                        className="info-value"
                        value={info.dataExecucao}
                        onChange={handleFieldChange('dataExecucao')}
                    />
                </div>
            </div>
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">Localização:</div>
                    <EditableField
                        className="info-value"
                        value={info.localizacao}
                        onChange={handleFieldChange('localizacao')}
                    />
                </div>
                <div className="info-item">
                    <div className="info-label">Prioridade:</div>
                    <EditableField
                        className="info-value"
                        value={info.prioridade}
                        onChange={handleFieldChange('prioridade')}
                    />
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
                    <EditableField
                        className="info-value"
                        value={info.centroCusto}
                        onChange={handleFieldChange('centroCusto')}
                    />
                </div>
            </div>
        </div>
    );
};

export default InfoSection; 