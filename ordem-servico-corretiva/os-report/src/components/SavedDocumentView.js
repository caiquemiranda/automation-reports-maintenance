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

    return (
        <div className="main-container">
            <div className="document-control-panel">
                <button className="btn-action" onClick={onBack}>Voltar</button>
                <h2>Documento Finalizado - OS-{document.osNumber}</h2>
                <button className="btn-action" onClick={handlePrint}>Imprimir</button>
            </div>

            <div className="container document-readonly" id="document">
                {/* Cabeçalho */}
                <div className="document-status">
                    <span>Status: Finalizado</span>
                    <span>Data de gravação: {formatDate(document.dataSalvamento)}</span>
                </div>

                <div className="header">
                    <div className="title">
                        <h1 className="text-center">
                            ORDEM DE SERVIÇO CORRETIVA - OS-{document.osNumber}
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
                                <label>NÃO PROGRAMADOS</label>
                            </div>
                        </div>
                    </div>
                    <div className="logo">
                        <img src="/logo_IBS.png" alt="IBSystems Logo" className="logo-img" />
                    </div>
                </div>

                <div className="divider"></div>

                {/* Seção de Informações */}
                <div className="info-section">
                    <div className="info-row">
                        <div className="info-item">
                            <div className="info-label">Código de Manutenção:</div>
                            <div className="info-value readonly">{document.formData.codigoManutencao || '—'}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">Data de Solicitação:</div>
                            <div className="info-value readonly">{formatDate(document.formData.dataSolicitacao)}</div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <div className="info-label">Nome do Equipamento:</div>
                            <div className="info-value readonly">{document.formData.nomeEquipamento}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">Data de Execução:</div>
                            <div className="info-value readonly">{formatDate(document.formData.dataExecucao)}</div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <div className="info-label">Localização:</div>
                            <div className="info-value readonly">{document.formData.localizacao}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">Prioridade:</div>
                            <div className="info-value readonly">{document.formData.prioridade}</div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <div className="info-label">Número da O.S.:</div>
                            <div className="info-value readonly">OS-{document.osNumber}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">Requisitante:</div>
                            <div className="info-value readonly">{document.formData.requisitante || '—'}</div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <div className="info-label">Centro de custo:</div>
                            <div className="info-value readonly">{document.formData.centroCusto}</div>
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
                    <div className="section-content readonly">{document.formData.servico}</div>
                </div>

                {/* Seção de Observação */}
                <div className="observation-section">
                    <div className="section-label">OBSERVAÇÃO:</div>
                    <div className="section-content readonly">{document.formData.observacao}</div>
                </div>

                {/* Seção de Ação Corretiva */}
                <div className="action-section">
                    <div className="section-label">Ação Corretiva:</div>
                    <div className="section-content readonly">
                        <p>{document.formData.acaoCorretiva}</p>
                        {document.actionItems && document.actionItems.length > 0 && (
                            <div className="action-items-readonly">
                                <ul>
                                    {document.actionItems.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Seção de Anexos */}
                {document.attachments && document.attachments.length > 0 && (
                    <div className="attachment-section">
                        <div className="section-label">ANEXOS:</div>
                        <div className="attachment-container-readonly">
                            {document.attachments.map((attachment) => (
                                <div key={attachment.id} className="attachment-item-readonly">
                                    <img
                                        src={attachment.src}
                                        alt="Anexo"
                                        className="attachment-image"
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
                                type="checkbox"
                                checked={document.conclusao.normal}
                                readOnly
                                disabled
                            />
                            <label>Equipamento normal</label>
                        </div>
                        <div className="conclusion-option">
                            <input
                                type="checkbox"
                                checked={document.conclusao.parcial}
                                readOnly
                                disabled
                            />
                            <label>Equipamento parcial</label>
                        </div>
                        <div className="conclusion-option">
                            <input
                                type="checkbox"
                                checked={document.conclusao.inoperante}
                                readOnly
                                disabled
                            />
                            <label>Equipamento inoperante</label>
                        </div>
                    </div>
                </div>

                {/* Seção de Assinaturas */}
                <div className="signatures-section">
                    <table>
                        <thead>
                            <tr>
                                <th>ASSISTENTE</th>
                                <th>CLIENTE</th>
                                <th>SUPERVISOR/PREVENTIVA</th>
                                <th>FREQUÊNCIA DE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><div className="signature-line"></div></td>
                                <td><div className="signature-line"></div></td>
                                <td><div className="signature-line"></div></td>
                                <td><div className="signature-line"></div></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="date-line">DATA: {formatDate(document.formData.datas[0])}</div>
                                </td>
                                <td>
                                    <div className="date-line">DATA: {formatDate(document.formData.datas[1])}</div>
                                </td>
                                <td>
                                    <div className="date-line">DATA: {formatDate(document.formData.datas[2])}</div>
                                </td>
                                <td>
                                    <div className="date-line">DATA: {formatDate(document.formData.datas[3])}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SavedDocumentView; 