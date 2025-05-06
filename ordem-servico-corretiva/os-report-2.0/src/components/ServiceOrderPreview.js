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
    centroCusto = 'C007',
    servico,
    observacao,
    acaoCorretiva,
    tagEquipamento

}) => {

    // Formatar datas para exibição
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

        ;

    return (<div className="service-order-preview" > <div className="preview-header" > <div className="preview-company" > <strong>IBSistemas</strong> <span>Facility Solutions</span> </div> <div className="preview-os" > <h2>ORDEM DE SERVIÇO Nº {
        numeroOS
    }

    </h2> </div> </div> <div className="preview-maintenance-type" > <div className="maintenance-type-box" > <div className={
        `maintenance-option $ {
                manutencao==='corretiva' ? 'selected' : ''
            }

            `
    }

    > <div className="checkbox" > {
        manutencao === 'corretiva' ? '✓' : ''
    }

        </div> <span>MANUTENÇÃO CORRETIVA</span> </div> <div className={
            `maintenance-option $ {
                manutencao==='planejada' ? 'selected' : ''
            }

            `
        }

        > <div className="checkbox" > {
            manutencao === 'planejada' ? '✓' : ''
        }

            </div> <span>MANUTENÇÃO PLANEJADA</span> </div> </div> </div> <div className="preview-info-grid" > <div className="preview-info-item" > <span className="preview-label" >TAG do Equipamento:</span> <span className="preview-value" > {
                tagEquipamento
            }

            </span> </div> <div className="preview-info-item" > <span className="preview-label" >Data de Solicitação:</span> <span className="preview-value" > {
                formatDate(dataSolicitacao)
            }

            </span> </div> <div className="preview-info-item" > <span className="preview-label" >Tipo de Equipamento:</span> <span className="preview-value" > {
                tipoEquipamento
            }

            </span> </div> <div className="preview-info-item" > <span className="preview-label" >Data de Execução:</span> <span className="preview-value" > {
                formatDate(dataExecucao)
            }

            </span> </div> <div className="preview-info-item" > <span className="preview-label" >Localização:</span> <span className="preview-value" > {
                localizacao
            }

            </span> </div> <div className="preview-info-item" > <span className="preview-label" >Prioridade:</span> <span className="preview-value" > {
                prioridade
            }

            </span> </div> <div className="preview-info-item" > <span className="preview-label" >Número da OS:</span> <span className="preview-value" > {
                numeroOS
            }

            </span> </div> <div className="preview-info-item" > <span className="preview-label" >Centro de custo:</span> <span className="preview-value" > {
                centroCusto
            }

            </span> </div> <div className="preview-info-item" > <span className="preview-label" >Requisitante:</span> <span className="preview-value" > {
                requisitante
            }

            </span> </div> </div> <div className="preview-description-section" > <div className="preview-description-item" > <h3>Serviço</h3> <div className="preview-content" dangerouslySetInnerHTML={
                {
                    __html: servico
                }
            }

            /> </div> <div className="preview-description-item" > <h3>Observação</h3> <div className="preview-content" dangerouslySetInnerHTML={
                {
                    __html: observacao
                }
            }

            /> </div> <div className="preview-description-item" > <h3>Ação Corretiva</h3> <div className="preview-content" dangerouslySetInnerHTML={
                {
                    __html: acaoCorretiva
                }
            }

            /> </div> </div> <div className="preview-footer" > <div className="signature-line" > <span>_______________________________</span> <p>Responsável Técnico</p> </div> <div className="signature-line" > <span>_______________________________</span> <p>Solicitante</p> </div> </div> </div>);
};

export default ServiceOrderPreview;