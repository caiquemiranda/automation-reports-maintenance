import React from 'react';

/**
 * Componente para visualização de documento salvo (apenas leitura)
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.document - Documento a ser exibido
 * @param {Function} props.onBack - Função para voltar à edição
 */
const SavedDocumentView = ({ document, onBack }) => {
    if (!document) {
        return (
            <div className="document-not-found">
                <h2>Documento não encontrado</h2>
                <button className="btn-action" onClick={onBack}>Voltar</button>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';

        try {
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('pt-BR', options);
        } catch (error) {
            return dateString;
        }
    };

    // Extrair dados do documento
    const formData = document.dados?.formData || {};
    const attachments = document.dados?.attachments || [];
    const actionItems = document.dados?.actionItems || [];
    const conclusao = document.dados?.conclusao || { normal: false, parcial: false, inoperante: false };

    return (
        <div className="main-container">
            <div className="document-control-panel">
                <button className="btn-action" onClick={onBack}>Voltar</button>
                <h2>Documento Finalizado - OS-{document.osNumber}</h2>
                <button className="btn-action" onClick={handlePrint}>Imprimir</button>
            </div>

            <div className="container document-readonly" id="document">
                {/* Cabeçalho */}
                <div className="header">
                    <div className="logo">
                        <img src="/logo_IBS.png" alt="IBSystems Logo" className="logo-img" />
                    </div>
                    <div className="title-container">
                        <h1 className="text-center">
                            ORDEM DE SERVIÇO - OS-{document.osNumber}
                        </h1>
                        <div className="checkboxes">
                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={document.manutencaoCorretiva}
                                    readOnly
                                    disabled
                                />
                                <label>MANUTENÇÃO CORRETIVA</label>
                            </div>
                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={document.naoProgramados}
                                    readOnly
                                    disabled
                                />
                                <label>MANUTENÇÃO PLANEJADA</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                {/* Seção de Informações */}
                <div className="info-section">
                    <div className="info-row">
                        <div className="info-item">
                            <div className="info-label">Código de Manutenção:</div>
                            <div className="info-value readonly">{formData.codigoManutencao || document.codigoManutencao || '—'}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">Data de Solicitação:</div>
                            <div className="info-value readonly">{formatDate(formData.dataSolicitacao || document.dataSolicitacao)}</div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <div className="info-label">Nome do Equipamento:</div>
                            <div className="info-value readonly">{formData.nomeEquipamento || document.nomeEquipamento}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">Data de Execução:</div>
                            <div className="info-value readonly">{formatDate(formData.dataExecucao || document.dataExecucao)}</div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <div className="info-label">Localização:</div>
                            <div className="info-value readonly">{formData.localizacao || document.localizacao}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">Prioridade:</div>
                            <div className="info-value readonly">{formData.prioridade}</div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <div className="info-label">Número da O.S.:</div>
                            <div className="info-value readonly">OS-{document.osNumber}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">Requisitante:</div>
                            <div className="info-value readonly">{formData.requisitante || document.requisitante || '—'}</div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <div className="info-label">Centro de custo:</div>
                            <div className="info-value readonly">{formData.centroCusto}</div>
                        </div>
                        <div className="info-item">
                            {/* Campo adicional se necessário */}
                        </div>
                    </div>
                </div>

                <div className="divider strong-divider"></div>

                {/* Seção de Serviço */}
                <div className="service-section">
                    <div className="section-label">SERVIÇO:</div>
                    <div className="section-content readonly">{formData.servico}</div>
                </div>

                {/* Seção de Observação */}
                <div className="observation-section">
                    <div className="section-label">OBSERVAÇÃO:</div>
                    <div className="section-content readonly">{formData.observacao}</div>
                </div>

                {/* Seção de Ação Corretiva */}
                <div className="action-section">
                    <div className="section-label">Ação Corretiva:</div>
                    <div className="section-content readonly">
                        <p>{formData.acaoCorretiva}</p>
                        {actionItems && actionItems.length > 0 && (
                            <div className="action-items-readonly">
                                <ul>
                                    {actionItems.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Seção de Anexos */}
                {attachments && attachments.length > 0 && (
                    <div className="attachment-section">
                        <div className="section-label">ANEXOS:</div>
                        <div className="attachment-container-readonly">
                            {attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="attachment-item-readonly"
                                    style={{
                                        width: attachment.width === 'auto' ? 'auto' : `${attachment.width}px`
                                    }}
                                >
                                    <img
                                        src={attachment.src}
                                        alt="Anexo"
                                        className="attachment-image"
                                        style={{
                                            width: attachment.width === 'auto' ? 'auto' : '100%',
                                            height: attachment.height === 'auto' ? 'auto' : `${attachment.height}px`,
                                            maxHeight: attachment.height === 'auto' ? '150px' : 'none'
                                        }}
                                    />
                                    <div className="attachment-description-readonly">
                                        {attachment.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Seção de Conclusão */}
                <div className="conclusion-section">
                    <div className="section-label">CONCLUSÃO:</div>
                    <div className="conclusion-options">
                        <div className="conclusion-option">
                            <input
                                type="radio"
                                checked={conclusao.normal}
                                readOnly
                                disabled
                            />
                            <label>Equipamento normal</label>
                        </div>
                        <div className="conclusion-option">
                            <input
                                type="radio"
                                checked={conclusao.parcial}
                                readOnly
                                disabled
                            />
                            <label>Equipamento parcial</label>
                        </div>
                        <div className="conclusion-option">
                            <input
                                type="radio"
                                checked={conclusao.inoperante}
                                readOnly
                                disabled
                            />
                            <label>Equipamento inoperante</label>
                        </div>
                    </div>
                </div>

                {/* Seção de Técnico e Materiais */}
                <div className="tecnico-material-section">
                    <div className="section-container">
                        <div className="tecnico-section">
                            <div className="section-label">TÉCNICO RESPONSÁVEL:</div>
                            <div className="section-content readonly">
                                {formData.tecnicoResponsavel || '—'}
                            </div>
                        </div>

                        <div className="material-section">
                            <div className="section-label">MATERIAL UTILIZADO:</div>
                            <div className="section-content readonly">
                                {Array.isArray(formData.materiaisUtilizados) && formData.materiaisUtilizados.length > 0 ? (
                                    <ul className="material-list-readonly">
                                        {formData.materiaisUtilizados.map((material, index) => (
                                            <li key={index}>
                                                {material}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-materials">Nenhum material adicionado</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedDocumentView; 