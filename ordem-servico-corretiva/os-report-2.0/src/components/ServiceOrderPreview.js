import React from 'react';
import './ServiceOrderPreview.css';

const ServiceOrderPreview = ({
    manutencao,
    dataSolicitacao,
    dataExecucao,
    tipoEquipamento,
    localizacao,
    prioridade,
    numeroOS,
    requisitante,
    centroCusto,
    servico,
    observacao,
    acaoCorretiva,
    tagEquipamento,
    status,
    tecnicoResponsavel,
    equipe,
    materials
}) => {

    // Formatar datas para exibição
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    }

    // Mapear status para texto descritivo
    const getStatusText = () => {
        switch (status) {
            case 'normal': return 'Equipamento Normal';
            case 'parcial': return 'Funcionamento Parcial';
            case 'fora': return 'Equipamento Fora de Serviço';
            default: return 'Não definido';
        }
    }

    return (
        <div className="preview-container">
            {/* Cabeçalho */}
            <div className="preview-header">
                <div className="company-logo">
                    <strong>IBSistemas</strong>
                    <span>Facility Solutions</span>
                </div>
                <h1>ORDEM DE SERVIÇO #{numeroOS}</h1>
                <div className="maintenance-type-preview">
                    <strong>{manutencao === 'corretiva' ? 'MANUTENÇÃO CORRETIVA' : 'MANUTENÇÃO PLANEJADA'}</strong>
                </div>
            </div>

            {/* Detalhes da OS */}
            <div className="preview-section">
                <div className="preview-grid">
                    <div className="preview-column">
                        <div className="preview-item">
                            <span className="label">TAG do Equipamento:</span>
                            <span className="value">{tagEquipamento}</span>
                        </div>
                        <div className="preview-item">
                            <span className="label">Tipo de Equipamento:</span>
                            <span className="value">{tipoEquipamento || 'Não informado'}</span>
                        </div>
                        <div className="preview-item">
                            <span className="label">Localização:</span>
                            <span className="value">{localizacao || 'Não informado'}</span>
                        </div>
                        <div className="preview-item">
                            <span className="label">Número da OS:</span>
                            <span className="value">{numeroOS}</span>
                        </div>
                    </div>
                    <div className="preview-column">
                        <div className="preview-item">
                            <span className="label">Data de Solicitação:</span>
                            <span className="value">{formatDate(dataSolicitacao)}</span>
                        </div>
                        <div className="preview-item">
                            <span className="label">Data de Execução:</span>
                            <span className="value">{formatDate(dataExecucao)}</span>
                        </div>
                        <div className="preview-item">
                            <span className="label">Prioridade:</span>
                            <span className="value">{prioridade || 'Não informado'}</span>
                        </div>
                        <div className="preview-item">
                            <span className="label">Requisitante:</span>
                            <span className="value">{requisitante || 'Não informado'}</span>
                        </div>
                        <div className="preview-item">
                            <span className="label">Centro de custo:</span>
                            <span className="value">{centroCusto}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detalhes da Atividade */}
            <div className="preview-section">
                <div className="preview-rich-text">
                    <h3>Serviço (Motivo de abertura da OS):</h3>
                    <div className="rich-content" dangerouslySetInnerHTML={{ __html: servico || 'Não informado' }} />
                </div>

                <div className="preview-rich-text">
                    <h3>Observação (Qual problema):</h3>
                    <div className="rich-content" dangerouslySetInnerHTML={{ __html: observacao || 'Não informado' }} />
                </div>

                <div className="preview-rich-text">
                    <h3>Ação Corretiva (Como foi desenvolvido a atividade):</h3>
                    <div className="rich-content" dangerouslySetInnerHTML={{ __html: acaoCorretiva || 'Não informado' }} />
                </div>
            </div>

            {/* Materiais Utilizados */}
            <div className="preview-section">
                {materials && materials.length > 0 ? (
                    <div className="materials-preview">
                        <table className="materials-table">
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Quantidade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map((material, index) => (
                                    <tr key={index} className="material-preview-item">
                                        <td>{material}</td>
                                        <td className="material-quantity">1</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-materials-preview">
                        Nenhum material utilizado
                    </div>
                )}
            </div>

            {/* Situação do Equipamento */}
            <div className="preview-section">
                <div className="status-box">
                    {getStatusText()}
                </div>
            </div>

            {/* Equipe */}
            <div className="preview-section">
                <div className="preview-item">
                    <span className="label">Técnico Responsável:</span>
                    <span className="value">{tecnicoResponsavel || 'Não atribuído'}</span>
                </div>

                {equipe && equipe.length > 0 ? (
                    <div className="preview-team">
                        <span className="label">Membros da Equipe:</span>
                        <ul className="team-list-preview">
                            {equipe.map((member, idx) => (
                                <li key={idx}>{member}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="preview-team">
                        <span className="label">Membros da Equipe:</span>
                        <div className="empty-team">Nenhum membro adicionado à equipe</div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ServiceOrderPreview;