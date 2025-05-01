import React, { useState } from 'react';
import SummernoteEditor from './SummernoteEditor';
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
}) => {
    const [editField, setEditField] = useState(null);
    return (
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