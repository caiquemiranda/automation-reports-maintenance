import React, { useState } from 'react';
import SummernoteEditor from './SummernoteEditor';
import './ServiceOrderInfo.css';

// Opções predefinidas para os selects
const TAG_OPTIONS = [
    'NL-IQ207-603',
    'NL-IQ207-604',
    'NL-IQ207-605',
    'NL-IQ208-701',
    'NL-IQ208-702'
];

const EQUIPMENT_TYPES = [
    'Ar Condicionado',
    'Elevador',
    'Gerador',
    'Bomba Hidráulica',
    'Sistema Elétrico',
    'Equipamento de Rede'
];

const PRIORITY_OPTIONS = [
    'Alta',
    'Média',
    'Baixa',
    'Crítica',
    'Preventiva'
];

const REQUESTER_OPTIONS = [
    'João Silva',
    'Maria Oliveira',
    'Carlos Santos',
    'Ana Souza',
    'Pedro Lima',
    'Luciana Costa'
];

const ServiceOrderInfo = ({
    manutencao, setManutencao,
    dataSolicitacao, setDataSolicitacao,
    dataExecucao, setDataExecucao,
    tipoEquipamento, setTipoEquipamento,
    localizacao, setLocalizacao,
    prioridade, setPrioridade,
    numeroOS, setNumeroOS,
    requisitante, setRequisitante,
    centroCusto = 'C007', // Valor fixo
    servico, setServico,
    observacao, setObservacao,
    acaoCorretiva, setAcaoCorretiva,
    tagEquipamento, setTagEquipamento,
    errors
}) => {
    const [editField, setEditField] = useState(null);

    // Handler para atualizar o número da OS e o título simultaneamente
    const handleNumeroOSChange = (e) => {
        setNumeroOS(e.target.value);
    };

    return (
        <section className="service-order-info">
            <div className="logo-section">
                <div className="company-info">
                    <strong>IBSistemas</strong>
                    <span>Facility Solutions</span>
                </div>
            </div>

            <div className="os-title-centered">
                <h2>OS {numeroOS}</h2>
            </div>

            <div className="maintenance-radio-group">
                <label>
                    <input
                        type="radio"
                        name="manutencao"
                        value="corretiva"
                        checked={manutencao === 'corretiva'}
                        onChange={() => setManutencao('corretiva')}
                        required
                    />
                    MANUTENÇÃO CORRETIVA
                </label>
                <label>
                    <input
                        type="radio"
                        name="manutencao"
                        value="planejada"
                        checked={manutencao === 'planejada'}
                        onChange={() => setManutencao('planejada')}
                        required
                    />
                    MANUTENÇÃO PLANEJADA
                </label>
            </div>

            <div className="info-grid-two-columns">
                <div className="form-group">
                    <strong>TAG do Equipamento:</strong>
                    <select
                        value={tagEquipamento || ''}
                        onChange={e => setTagEquipamento(e.target.value)}
                        className={errors.tagEquipamento ? 'input-error' : ''}
                    >
                        <option value="">Selecione a TAG</option>
                        {TAG_OPTIONS.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <strong>Data de Solicitação:</strong>
                    <input
                        type="date"
                        value={dataSolicitacao}
                        onChange={e => setDataSolicitacao(e.target.value)}
                        required
                        className={errors.dataSolicitacao ? 'input-error' : ''}
                    />
                </div>

                <div className="form-group">
                    <strong>Tipo de Equipamento:</strong>
                    <select
                        value={tipoEquipamento}
                        onChange={e => setTipoEquipamento(e.target.value)}
                        required
                        className={errors.tipoEquipamento ? 'input-error' : ''}
                    >
                        <option value="">Selecione o tipo</option>
                        {EQUIPMENT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <strong>Data de Execução:</strong>
                    <input
                        type="date"
                        value={dataExecucao}
                        onChange={e => setDataExecucao(e.target.value)}
                        required
                        className={errors.dataExecucao ? 'input-error' : ''}
                    />
                </div>

                <div className="form-group">
                    <strong>Localização:</strong>
                    <input
                        type="text"
                        value={localizacao}
                        onChange={e => setLocalizacao(e.target.value)}
                        required
                        className={errors.localizacao ? 'input-error' : ''}
                    />
                </div>

                <div className="form-group">
                    <strong>Prioridade:</strong>
                    <select
                        value={prioridade}
                        onChange={e => setPrioridade(e.target.value)}
                        required
                        className={errors.prioridade ? 'input-error' : ''}
                    >
                        <option value="">Selecione a prioridade</option>
                        {PRIORITY_OPTIONS.map(priority => (
                            <option key={priority} value={priority}>{priority}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <strong>Número da OS:</strong>
                    <input
                        type="text"
                        value={numeroOS}
                        onChange={handleNumeroOSChange}
                        required
                        className={errors.numeroOS ? 'input-error' : ''}
                    />
                </div>

                <div className="form-group">
                    <strong>Requisitante:</strong>
                    <select
                        value={requisitante}
                        onChange={e => setRequisitante(e.target.value)}
                        required
                        className={errors.requisitante ? 'input-error' : ''}
                    >
                        <option value="">Selecione o requisitante</option>
                        {REQUESTER_OPTIONS.map(requester => (
                            <option key={requester} value={requester}>{requester}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <strong>Centro de custo:</strong>
                    <span className="static-value">C007</span>
                </div>
            </div>

            <div className="service-edit-block">
                <div>
                    <strong>Serviço:</strong>
                    {editField === 'servico' ? (
                        <SummernoteEditor
                            initialContent={servico}
                            onSave={html => { setServico(html); setEditField(null); }}
                            onClose={() => setEditField(null)}
                        />
                    ) : (
                        <div onClick={() => setEditField('servico')} className="summernote-preview" dangerouslySetInnerHTML={{ __html: servico }} />
                    )}
                </div>
                <div>
                    <strong>Observação:</strong>
                    {editField === 'observacao' ? (
                        <SummernoteEditor
                            initialContent={observacao}
                            onSave={html => { setObservacao(html); setEditField(null); }}
                            onClose={() => setEditField(null)}
                        />
                    ) : (
                        <div onClick={() => setEditField('observacao')} className="summernote-preview" dangerouslySetInnerHTML={{ __html: observacao }} />
                    )}
                </div>
                <div>
                    <strong>Ação Corretiva:</strong>
                    {editField === 'acaoCorretiva' ? (
                        <SummernoteEditor
                            initialContent={acaoCorretiva}
                            onSave={html => { setAcaoCorretiva(html); setEditField(null); }}
                            onClose={() => setEditField(null)}
                        />
                    ) : (
                        <div onClick={() => setEditField('acaoCorretiva')} className="summernote-preview" dangerouslySetInnerHTML={{ __html: acaoCorretiva }} />
                    )}
                </div>
            </div>
        </section>
    );
};

export default ServiceOrderInfo;