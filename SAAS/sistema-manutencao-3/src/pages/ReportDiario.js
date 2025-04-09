import React, { useState, useEffect } from 'react';

function ReportDiario() {
    const [formData, setFormData] = useState({
        dataReport: '',
        fotoPainel: null,
        painel: '',
        tipoDispositivo: '',
        tagDispositivo: '',
        tipoFalha: '',
        numeroOS: '',
        observacoes: ''
    });

    const [filtros, setFiltros] = useState({
        dataInicio: '',
        dataFim: '',
        painel: '',
        tipoDispositivo: '',
        tipoFalha: ''
    });

    // Opções para os campos de seleção
    const opcoesDispositivos = [
        { value: 'acionador', label: 'Acionador Manual' },
        { value: 'detector', label: 'Detector de Fumaça' },
        { value: 'modulo', label: 'Módulo de Monitoramento' },
        { value: 'linear', label: 'Detector Linear' }
    ];

    const opcoesPaineis = [
        { value: 'painel-01', label: 'Painel-01' },
        { value: 'painel-02', label: 'Painel-02' },
        { value: 'painel-03', label: 'Painel-03' }
    ];

    const opcoesFalhas = [
        { value: 'no-answer', label: 'No Answer' },
        { value: 'open-circuit', label: 'Open Circuit' },
        { value: 'short-circuit', label: 'Short Circuit' },
        { value: 'bad-answer', label: 'Bad Answer' }
    ];

    // Tags de dispositivos baseadas no tipo de dispositivo selecionado
    const [tagsDispositivos, setTagsDispositivos] = useState([]);

    // Opções para os números de OS
    const opcoesOS = ['345.534', '3456.788', '434.555'];

    // Reports salvos para exibição no histórico
    const [reportsSalvos, setReportsSalvos] = useState([
        {
            id: 1,
            data: '2024-02-15',
            painel: 'Painel-01',
            tipoDispositivo: 'Detector de Fumaça',
            tagDispositivo: 'N1-L02-DF-004-Local01',
            tipoFalha: 'No Answer',
            numeroOS: '345.534'
        },
        {
            id: 2,
            data: '2024-02-16',
            painel: 'Painel-02',
            tipoDispositivo: 'Acionador Manual',
            tagDispositivo: 'N1-L02-AM-006-Local03',
            tipoFalha: 'Open Circuit',
            numeroOS: '3456.788'
        },
        {
            id: 3,
            data: '2024-02-18',
            painel: 'Painel-03',
            tipoDispositivo: 'Módulo de Monitoramento',
            tagDispositivo: 'N1-L02-MM-008-LocalSala',
            tipoFalha: 'Short Circuit',
            numeroOS: '434.555'
        }
    ]);

    const [reportsFiltrados, setReportsFiltrados] = useState([]);
    const [fotoPreview, setFotoPreview] = useState(null);

    useEffect(() => {
        // Preenche a data atual no campo de data do formulário
        const hoje = new Date();
        const dataFormatada = hoje.toISOString().split('T')[0];
        setFormData(prevData => ({
            ...prevData,
            dataReport: dataFormatada
        }));

        // Inicia com todos os reports no histórico
        setReportsFiltrados(reportsSalvos);
    }, []);

    useEffect(() => {
        // Atualiza as tags de dispositivos com base no tipo selecionado
        if (formData.tipoDispositivo) {
            // Simular diferentes tags baseadas no tipo de dispositivo
            let prefixo = '';
            switch (formData.tipoDispositivo) {
                case 'acionador':
                    prefixo = 'AM';
                    break;
                case 'detector':
                    prefixo = 'DF';
                    break;
                case 'modulo':
                    prefixo = 'MM';
                    break;
                case 'linear':
                    prefixo = 'DL';
                    break;
                default:
                    prefixo = 'XX';
            }

            // Gerar algumas tags de exemplo
            const tags = [];
            for (let i = 1; i <= 5; i++) {
                tags.push(`N1-L02-${prefixo}-00${i}-Local${i}`);
            }
            setTagsDispositivos(tags);
        } else {
            setTagsDispositivos([]);
        }
    }, [formData.tipoDispositivo]);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                fotoPainel: file
            }));

            // Criar preview da imagem
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Criar um novo report
        const novoReport = {
            id: reportsSalvos.length + 1,
            data: formData.dataReport,
            painel: opcoesPaineis.find(op => op.value === formData.painel)?.label || formData.painel,
            tipoDispositivo: opcoesDispositivos.find(op => op.value === formData.tipoDispositivo)?.label || formData.tipoDispositivo,
            tagDispositivo: formData.tagDispositivo,
            tipoFalha: opcoesFalhas.find(op => op.value === formData.tipoFalha)?.label || formData.tipoFalha,
            numeroOS: formData.numeroOS,
            observacoes: formData.observacoes
        };

        // Adicionar ao array de reports
        const novosReports = [...reportsSalvos, novoReport];
        setReportsSalvos(novosReports);
        setReportsFiltrados(novosReports);

        alert('Falha registrada com sucesso!');

        // Reset form except for the date
        const dataReportValue = formData.dataReport;
        setFormData({
            dataReport: dataReportValue,
            fotoPainel: null,
            painel: '',
            tipoDispositivo: '',
            tagDispositivo: '',
            tipoFalha: '',
            numeroOS: '',
            observacoes: ''
        });
        setFotoPreview(null);
    };

    const handleFilter = () => {
        let resultados = [...reportsSalvos];

        if (filtros.dataInicio) {
            resultados = resultados.filter(report => report.data >= filtros.dataInicio);
        }

        if (filtros.dataFim) {
            resultados = resultados.filter(report => report.data <= filtros.dataFim);
        }

        if (filtros.painel) {
            const painelLabel = opcoesPaineis.find(op => op.value === filtros.painel)?.label || filtros.painel;
            resultados = resultados.filter(report => report.painel === painelLabel);
        }

        if (filtros.tipoDispositivo) {
            const dispositivoLabel = opcoesDispositivos.find(op => op.value === filtros.tipoDispositivo)?.label || filtros.tipoDispositivo;
            resultados = resultados.filter(report => report.tipoDispositivo === dispositivoLabel);
        }

        if (filtros.tipoFalha) {
            const falhaLabel = opcoesFalhas.find(op => op.value === filtros.tipoFalha)?.label || filtros.tipoFalha;
            resultados = resultados.filter(report => report.tipoFalha === falhaLabel);
        }

        setReportsFiltrados(resultados);
    };

    const exportarReport = (id) => {
        const report = reportsSalvos.find(r => r.id === id);
        if (report) {
            alert(`Report ID ${id} exportado como PDF.`);
        }
    };

    const verDetalhes = (id) => {
        const report = reportsSalvos.find(r => r.id === id);
        if (report) {
            alert(`Detalhes do Report ID ${id}: ${JSON.stringify(report)}`);
        }
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
                        <label htmlFor="fotoPainel">Foto do Painel:</label>
                        <input
                            type="file"
                            id="fotoPainel"
                            name="fotoPainel"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {fotoPreview && (
                            <div className="image-preview" style={{ marginTop: '10px' }}>
                                <img
                                    src={fotoPreview}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="painel">Painel:</label>
                        <select
                            id="painel"
                            name="painel"
                            value={formData.painel}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            {opcoesPaineis.map(opcao => (
                                <option key={opcao.value} value={opcao.value}>
                                    {opcao.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipoDispositivo">Tipo de Dispositivo:</label>
                        <select
                            id="tipoDispositivo"
                            name="tipoDispositivo"
                            value={formData.tipoDispositivo}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            {opcoesDispositivos.map(opcao => (
                                <option key={opcao.value} value={opcao.value}>
                                    {opcao.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tagDispositivo">Tag do Dispositivo:</label>
                        <select
                            id="tagDispositivo"
                            name="tagDispositivo"
                            value={formData.tagDispositivo}
                            onChange={handleInputChange}
                            disabled={!formData.tipoDispositivo}
                            required
                        >
                            <option value="">Selecione...</option>
                            {tagsDispositivos.map(tag => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
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
                            {opcoesFalhas.map(opcao => (
                                <option key={opcao.value} value={opcao.value}>
                                    {opcao.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="numeroOS">Número da OS:</label>
                        <select
                            id="numeroOS"
                            name="numeroOS"
                            value={formData.numeroOS}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            {opcoesOS.map(os => (
                                <option key={os} value={os}>
                                    {os}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="observacoes">Observações:</label>
                        <textarea
                            id="observacoes"
                            name="observacoes"
                            rows="3"
                            value={formData.observacoes}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit">Salvar Report</button>
                        <button type="button" className="btn-reset" onClick={() => {
                            const dataReportValue = formData.dataReport;
                            setFormData({
                                dataReport: dataReportValue,
                                fotoPainel: null,
                                painel: '',
                                tipoDispositivo: '',
                                tagDispositivo: '',
                                tipoFalha: '',
                                numeroOS: '',
                                observacoes: ''
                            });
                            setFotoPreview(null);
                        }}>Limpar</button>
                    </div>
                </form>
            </div>

            <div className="table-container">
                <h3>Histórico de Reports Diários</h3>
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
                        <label htmlFor="painel">Painel:</label>
                        <select
                            id="filterPainel"
                            name="painel"
                            value={filtros.painel}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos</option>
                            {opcoesPaineis.map(opcao => (
                                <option key={opcao.value} value={opcao.value}>
                                    {opcao.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="tipoDispositivo">Tipo de Dispositivo:</label>
                        <select
                            id="filterTipoDispositivo"
                            name="tipoDispositivo"
                            value={filtros.tipoDispositivo}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos</option>
                            {opcoesDispositivos.map(opcao => (
                                <option key={opcao.value} value={opcao.value}>
                                    {opcao.label}
                                </option>
                            ))}
                        </select>
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
                            {opcoesFalhas.map(opcao => (
                                <option key={opcao.value} value={opcao.value}>
                                    {opcao.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="btn-filter" onClick={handleFilter}>Filtrar</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Painel</th>
                            <th>Dispositivo</th>
                            <th>Tag</th>
                            <th>Tipo de Falha</th>
                            <th>OS</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportsFiltrados.map(report => (
                            <tr key={report.id}>
                                <td>{new Date(report.data).toLocaleDateString('pt-BR')}</td>
                                <td>{report.painel}</td>
                                <td>{report.tipoDispositivo}</td>
                                <td>{report.tagDispositivo}</td>
                                <td>
                                    <span className={`badge ${report.tipoFalha === 'No Answer' ? 'badge-high' :
                                            report.tipoFalha === 'Open Circuit' ? 'badge-medium' :
                                                report.tipoFalha === 'Short Circuit' ? 'badge-waiting' :
                                                    'badge-low'
                                        }`}>
                                        {report.tipoFalha}
                                    </span>
                                </td>
                                <td>{report.numeroOS}</td>
                                <td>
                                    <button className="btn-action" onClick={() => verDetalhes(report.id)}>
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="btn-action" onClick={() => exportarReport(report.id)}>
                                        <i className="fas fa-file-export"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
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