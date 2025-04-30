import React from 'react';
import './ServiceOrderInfo.css';

const ServiceOrderInfo = ({
    manutencao, setManutencao,
    dataSolicitacao, setDataSolicitacao,
    dataExecucao, setDataExecucao,
    tipoEquipamento, setTipoEquipamento,
    localizacao, setLocalizacao,
    prioridade, setPrioridade,
    numeroOS, setNumeroOS,
    requisitante, setRequisitante,
    centroCusto, setCentroCusto,
    servico, setServico,
    observacao, setObservacao,
    acaoCorretiva, setAcaoCorretiva,
    errors
}) => (
    <section className="service-order-info">
        <div className="logo-section">
            <img src="/logo192.png" alt="Logo IBSistemas" className="logo" />
            <div className="company-info">
                <strong>IBSistemas</strong>
                <span>Facility Solutions</span>
            </div>
        </div>
        <div className="os-title-centered">
            <h2>OS {numeroOS}</h2>
        </div>
        <div className="radio-group">
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
        <div className="info-grid">
            <div><strong>IAG do Equipamento:</strong> NL-IQ207-603</div>
            <div>
                <strong>Data de Solicitação:</strong>
                <input type="date" value={dataSolicitacao} onChange={e => setDataSolicitacao(e.target.value)} required className={errors.dataSolicitacao ? 'input-error' : ''} />
            </div>
            <div>
                <strong>Tipo de Equipamento:</strong>
                <input type="text" value={tipoEquipamento} onChange={e => setTipoEquipamento(e.target.value)} required className={errors.tipoEquipamento ? 'input-error' : ''} />
            </div>
            <div>
                <strong>Data de Execução:</strong>
                <input type="date" value={dataExecucao} onChange={e => setDataExecucao(e.target.value)} required className={errors.dataExecucao ? 'input-error' : ''} />
            </div>
            <div>
                <strong>Localização:</strong>
                <input type="text" value={localizacao} onChange={e => setLocalizacao(e.target.value)} required className={errors.localizacao ? 'input-error' : ''} />
            </div>
            <div>
                <strong>Prioridade:</strong>
                <input type="text" value={prioridade} onChange={e => setPrioridade(e.target.value)} required className={errors.prioridade ? 'input-error' : ''} />
            </div>
            <div><strong>Número da OS:</strong> {numeroOS}</div>
            <div>
                <strong>Requisitante:</strong>
                <input type="text" value={requisitante} onChange={e => setRequisitante(e.target.value)} required className={errors.requisitante ? 'input-error' : ''} />
            </div>
            <div>
                <strong>Centro de custo:</strong>
                <input type="text" value={centroCusto} onChange={e => setCentroCusto(e.target.value)} required className={errors.centroCusto ? 'input-error' : ''} />
            </div>
        </div>
        <div className="service-edit-block">
            <div>
                <strong>Serviço:</strong>
                <textarea value={servico} onChange={e => setServico(e.target.value)} required className={errors.servico ? 'input-error' : ''} />
            </div>
            <div>
                <strong>Observação:</strong>
                <textarea value={observacao} onChange={e => setObservacao(e.target.value)} required className={errors.observacao ? 'input-error' : ''} />
            </div>
            <div>
                <strong>Ação Corretiva:</strong>
                <textarea value={acaoCorretiva} onChange={e => setAcaoCorretiva(e.target.value)} required className={errors.acaoCorretiva ? 'input-error' : ''} />
            </div>
        </div>
    </section>
);

export default ServiceOrderInfo; 