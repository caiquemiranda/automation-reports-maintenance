import React, { useState, useEffect } from 'react';

function ReportDiario() {
    const [formData, setFormData] = useState({
        dataReport: '',
        equipamento: '',
        setor: '',
        tipoFalha: '',
        descricaoFalha: '',
        tempoParada: '',
        impactoProducao: '',
        acaoImediata: '',
        tecnicoResponsavel: '',
        numeroOS: ''
    });

    const [filtros, setFiltros] = useState({
        dataInicio: '',
        dataFim: '',
        tipoFalha: '',
        impacto: ''
    });

    useEffect(() => {
        // Preenche a data atual no campo de data do formulário
        const hoje = new Date();
        const dataFormatada = hoje.toISOString().split('T')[0];
        setFormData(prevData => ({
            ...prevData,
            dataReport: dataFormatada
        }));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Falha registrada com sucesso!');

        // Reset form except for the date
        const dataReportValue = formData.dataReport;
        setFormData({
            dataReport: dataReportValue,
            equipamento: '',
            setor: '',
            tipoFalha: '',
            descricaoFalha: '',
            tempoParada: '',
            impactoProducao: '',
            acaoImediata: '',
            tecnicoResponsavel: '',
            numeroOS: ''
        });
    };

    const handleFilter = () => {
        alert(`Filtro aplicado: Data Início: ${filtros.dataInicio}, Data Fim: ${filtros.dataFim}, Tipo: ${filtros.tipoFalha}, Impacto: ${filtros.impacto}`);
    };

    return (
        <div>
            <h2>Report Diário de Falhas</h2>

            <div className="form-container">
                <form id="reportDiarioForm" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="dataReport">Data do Report:</label>
                        <input
                            type="date"
                            id="dataReport"
                            name="dataReport"
                            value={formData.dataReport}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="equipamento">Equipamento:</label>
                        <input
                            type="text"
                            id="equipamento"
                            name="equipamento"
                            value={formData.equipamento}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="setor">Setor:</label>
                        <input
                            type="text"
                            id="setor"
                            name="setor"
                            value={formData.setor}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tipoFalha">Tipo de Falha:</label>
                        <select
                            id="tipoFalha"
                            name="tipoFalha"
                            value={formData.tipoFalha}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="eletrica">Elétrica</option>
                            <option value="mecanica">Mecânica</option>
                            <option value="hidraulica">Hidráulica</option>
                            <option value="pneumatica">Pneumática</option>
                            <option value="software">Software</option>
                            <option value="outra">Outra</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="descricaoFalha">Descrição da Falha:</label>
                        <textarea
                            id="descricaoFalha"
                            name="descricaoFalha"
                            rows="3"
                            value={formData.descricaoFalha}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tempoParada">Tempo de Parada (horas):</label>
                        <input
                            type="number"
                            id="tempoParada"
                            name="tempoParada"
                            min="0"
                            step="0.5"
                            value={formData.tempoParada}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="impactoProducao">Impacto na Produção:</label>
                        <select
                            id="impactoProducao"
                            name="impactoProducao"
                            value={formData.impactoProducao}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="baixo">Baixo</option>
                            <option value="medio">Médio</option>
                            <option value="alto">Alto</option>
                            <option value="critico">Crítico</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="acaoImediata">Ação Imediata Tomada:</label>
                        <textarea
                            id="acaoImediata"
                            name="acaoImediata"
                            rows="3"
                            value={formData.acaoImediata}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tecnicoResponsavel">Técnico Responsável:</label>
                        <input
                            type="text"
                            id="tecnicoResponsavel"
                            name="tecnicoResponsavel"
                            value={formData.tecnicoResponsavel}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="numeroOS">Número da OS Relacionada:</label>
                        <input
                            type="text"
                            id="numeroOS"
                            name="numeroOS"
                            value={formData.numeroOS}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit" className="btn-submit">Registrar Falha</button>
                </form>
            </div>

            <div className="table-container">
                <h3>Falhas Recentes</h3>
                <div className="table-filters">
                    <div className="filter-group">
                        <label htmlFor="dataInicio">Data Início:</label>
                        <input
                            type="date"
                            id="dataInicio"
                            name="dataInicio"
                            value={filtros.dataInicio}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="dataFim">Data Fim:</label>
                        <input
                            type="date"
                            id="dataFim"
                            name="dataFim"
                            value={filtros.dataFim}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="tipoFalha">Tipo de Falha:</label>
                        <select
                            id="filterTipoFalha"
                            name="tipoFalha"
                            value={filtros.tipoFalha}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos</option>
                            <option value="eletrica">Elétrica</option>
                            <option value="mecanica">Mecânica</option>
                            <option value="hidraulica">Hidráulica</option>
                            <option value="pneumatica">Pneumática</option>
                            <option value="software">Software</option>
                            <option value="outra">Outra</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="impacto">Impacto:</label>
                        <select
                            id="filterImpacto"
                            name="impacto"
                            value={filtros.impacto}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos</option>
                            <option value="baixo">Baixo</option>
                            <option value="medio">Médio</option>
                            <option value="alto">Alto</option>
                            <option value="critico">Crítico</option>
                        </select>
                    </div>
                    <button className="btn-filter" onClick={handleFilter}>Filtrar</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Equipamento</th>
                            <th>Tipo de Falha</th>
                            <th>Tempo de Parada</th>
                            <th>Impacto</th>
                            <th>OS</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>15/02/2024</td>
                            <td>Compressor de Ar</td>
                            <td>Mecânica</td>
                            <td>2.5 h</td>
                            <td><span className="badge badge-medium">Médio</span></td>
                            <td>OS-2024-010</td>
                            <td>
                                <button className="btn-action"><i className="fas fa-eye"></i></button>
                                <button className="btn-action"><i className="fas fa-edit"></i></button>
                                <button className="btn-action"><i className="fas fa-file-export"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>16/02/2024</td>
                            <td>CLP Linha de Produção</td>
                            <td>Elétrica</td>
                            <td>4 h</td>
                            <td><span className="badge badge-high">Alto</span></td>
                            <td>OS-2024-011</td>
                            <td>
                                <button className="btn-action"><i className="fas fa-eye"></i></button>
                                <button className="btn-action"><i className="fas fa-edit"></i></button>
                                <button className="btn-action"><i className="fas fa-file-export"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>17/02/2024</td>
                            <td>Esteira Transportadora</td>
                            <td>Mecânica</td>
                            <td>1 h</td>
                            <td><span className="badge badge-low">Baixo</span></td>
                            <td>OS-2024-012</td>
                            <td>
                                <button className="btn-action"><i className="fas fa-eye"></i></button>
                                <button className="btn-action"><i className="fas fa-edit"></i></button>
                                <button className="btn-action"><i className="fas fa-file-export"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>18/02/2024</td>
                            <td>Sistema Supervisório</td>
                            <td>Software</td>
                            <td>0.5 h</td>
                            <td><span className="badge badge-low">Baixo</span></td>
                            <td>OS-2024-013</td>
                            <td>
                                <button className="btn-action"><i className="fas fa-eye"></i></button>
                                <button className="btn-action"><i className="fas fa-edit"></i></button>
                                <button className="btn-action"><i className="fas fa-file-export"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>19/02/2024</td>
                            <td>Válvula Proporcional</td>
                            <td>Hidráulica</td>
                            <td>6 h</td>
                            <td><span className="badge badge-progress">Crítico</span></td>
                            <td>OS-2024-014</td>
                            <td>
                                <button className="btn-action"><i className="fas fa-eye"></i></button>
                                <button className="btn-action"><i className="fas fa-edit"></i></button>
                                <button className="btn-action"><i className="fas fa-file-export"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="pagination">
                    <button className="btn-page active">1</button>
                    <button className="btn-page">2</button>
                    <button className="btn-page">3</button>
                    <button className="btn-page">&gt;</button>
                </div>
            </div>
        </div>
    );
}

export default ReportDiario; 