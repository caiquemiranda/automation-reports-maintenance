import React from 'react';

/**
 * Componente de seção de informações com campos editáveis
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.formData - Dados do formulário
 * @param {Function} props.handleInputChange - Função para atualizar os dados
 * @param {Function} props.setOsNumber - Função para atualizar o número da OS
 * @param {string} props.osNumber - Número da ordem de serviço
 * @param {Array} props.requisitantes - Lista de requisitantes disponíveis
 */
const InfoSection = ({ formData, handleInputChange, setOsNumber, osNumber, requisitantes }) => {
    return (
        <div className="info-section">
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">TAG do Equipamento:</div>
                    <div className="info-value">
                        <input
                            type="text"
                            className="form-control"
                            value={formData.codigoManutencao}
                            onChange={(e) => handleInputChange('codigoManutencao', e.target.value)}
                            placeholder="N1-L01-DF-01"
                            required
                        />
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-label">Data de Solicitação:</div>
                    <div className="info-value">
                        <input
                            type="date"
                            className="date-picker"
                            value={formData.dataSolicitacao}
                            onChange={(e) => handleInputChange('dataSolicitacao', e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">Tipo do Equipamento:</div>
                    <div className="info-value">
                        <select
                            className="select-control"
                            value={formData.nomeEquipamento}
                            onChange={(e) => handleInputChange('nomeEquipamento', e.target.value)}
                            required
                        >
                            <option value="">Selecione o equipamento</option>
                            <option value="Detector de Fumaça">Detector de Fumaça</option>
                            <option value="Acionador Manual">Acionador Manual</option>
                            <option value="Modulo de Zona">Modulo de Zona</option>
                        </select>
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-label">Data de Execução:</div>
                    <div className="info-value">
                        <input
                            type="date"
                            className="date-picker"
                            value={formData.dataExecucao}
                            onChange={(e) => handleInputChange('dataExecucao', e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">Localização:</div>
                    <div className="info-value">
                        <input
                            type="text"
                            className="form-control"
                            value={formData.localizacao}
                            onChange={(e) => handleInputChange('localizacao', e.target.value)}
                            placeholder="Dispensário No.XXX.XXX Fábrica de Farinha"
                            required
                        />
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-label">Prioridade:</div>
                    <div className="info-value">
                        <select
                            className="select-control"
                            value={formData.prioridade}
                            onChange={(e) => handleInputChange('prioridade', e.target.value)}
                            required
                        >
                            <option value="">Selecione a prioridade</option>
                            <option value="Urgência">Urgência</option>
                            <option value="Alta">Alta</option>
                            <option value="Média">Média</option>
                            <option value="Baixa">Baixa</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">Número da O.S.:</div>
                    <div className="info-value">
                        <div className="input-group">
                            <span className="input-prefix"></span>
                            <input
                                type="text"
                                className="form-control"
                                value={osNumber}
                                onChange={(e) => setOsNumber(e.target.value)}
                                placeholder="000000"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-label">Requisitante:</div>
                    <div className="info-value">
                        <select
                            className="select-control"
                            value={formData.requisitante || ''}
                            onChange={(e) => handleInputChange('requisitante', e.target.value)}
                            required
                        >
                            <option value="">Selecione um requisitante</option>
                            {requisitantes.map((req) => (
                                <option key={req.id} value={req.nome}>
                                    {req.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="info-row">
                <div className="info-item">
                    <div className="info-label">Centro de custo:</div>
                    <div className="info-value">
                        <input
                            type="text"
                            className="form-control"
                            value="C007"
                            onChange={(e) => handleInputChange('centroCusto', "C007")}
                            disabled
                        />
                    </div>
                </div>
                <div className="info-item">
                    {/* Campo adicional se necessário */}
                </div>
            </div>
        </div>
    );
};

export default InfoSection; 