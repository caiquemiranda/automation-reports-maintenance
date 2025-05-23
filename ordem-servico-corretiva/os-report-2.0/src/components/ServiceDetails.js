import React from 'react';
import './ServiceDetails.css';
import MultiSelect from './MultiSelect';
import SelectAutocomplete from './SelectAutocomplete';

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

const LOCALIZACOES_EXEMPLO = [
    'Sala de Controle',
    'Laboratório',
    'Almoxarifado',
    'Produção'
];

const ServiceDetails = ({
    tagEquipamento, setTagEquipamento,
    tipoEquipamento, setTipoEquipamento,
    localizacao, setLocalizacao,
    numeroOS, setNumeroOS,
    dataSolicitacao, setDataSolicitacao,
    dataExecucao, setDataExecucao,
    prioridade, setPrioridade,
    requisitante, setRequisitante,
    centroCusto,
    errors
}) => {
    return (
        <section className="service-details">
            <h3>Detalhes da OS</h3>
            <div className="details-grid">
                <div className="column">
                    <div className="form-group">
                        <strong>TAG do Equipamento:</strong>
                        <MultiSelect
                            options={TAG_OPTIONS}
                            selected={Array.isArray(tagEquipamento) ? tagEquipamento : tagEquipamento ? [tagEquipamento] : []}
                            onChange={tags => setTagEquipamento(tags)}
                            placeholder="Digite ou selecione uma TAG"
                        />
                    </div>

                    <div className="form-group">
                        <strong>Tipo de Equipamento:</strong>
                        <SelectAutocomplete
                            options={EQUIPMENT_TYPES}
                            value={tipoEquipamento || ''}
                            onChange={setTipoEquipamento}
                            placeholder="Digite ou selecione o tipo"
                            datalistId="tipo-equipamento-list"
                        />
                    </div>

                    <div className="form-group">
                        <strong>Localização:</strong>
                        <SelectAutocomplete
                            options={LOCALIZACOES_EXEMPLO}
                            value={localizacao || ''}
                            onChange={setLocalizacao}
                            placeholder="Digite ou selecione a localização"
                            datalistId="localizacao-list"
                        />
                    </div>

                    <div className="form-group">
                        <strong>Número da OS:</strong>
                        <input
                            type="text"
                            value={numeroOS}
                            onChange={e => setNumeroOS(e.target.value)}
                            required
                            className={errors?.numeroOS ? 'input-error' : ''}
                        />
                    </div>
                </div>

                <div className="column">
                    <div className="form-group">
                        <strong>Data de Solicitação:</strong>
                        <input
                            type="date"
                            value={dataSolicitacao}
                            onChange={e => setDataSolicitacao(e.target.value)}
                            required
                            className={errors?.dataSolicitacao ? 'input-error' : ''}
                        />
                    </div>

                    <div className="form-group">
                        <strong>Data de Execução:</strong>
                        <input
                            type="date"
                            value={dataExecucao}
                            onChange={e => setDataExecucao(e.target.value)}
                            required
                            className={errors?.dataExecucao ? 'input-error' : ''}
                        />
                    </div>

                    <div className="form-group">
                        <strong>Prioridade:</strong>
                        <select
                            value={prioridade}
                            onChange={e => setPrioridade(e.target.value)}
                            required
                            className={errors?.prioridade ? 'input-error' : ''}
                        >
                            <option value="">Selecione a prioridade</option>
                            {PRIORITY_OPTIONS.map(priority => (
                                <option key={priority} value={priority}>{priority}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <strong>Requisitante:</strong>
                        <select
                            value={requisitante}
                            onChange={e => setRequisitante(e.target.value)}
                            required
                            className={errors?.requisitante ? 'input-error' : ''}
                        >
                            <option value="">Selecione o requisitante</option>
                            {REQUESTER_OPTIONS.map(requester => (
                                <option key={requester} value={requester}>{requester}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <strong>Centro de custo:</strong>
                        <span className="static-value">{centroCusto}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceDetails; 