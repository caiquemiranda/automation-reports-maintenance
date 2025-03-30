import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [osNumber, setOsNumber] = useState('305470');
  const [manutencaoCorretiva, setManutencaoCorretiva] = useState(true);
  const [naoProgramados, setNaoProgramados] = useState(false);
  const [formData, setFormData] = useState({
    codigoManutencao: '__________',
    dataSolicitacao: '26/05/2023',
    nomeEquipamento: 'Sistema de Alarme de Incêndio',
    dataExecucao: '27/05/2023',
    localizacao: 'Dispensário No.140.215 Fábrica de Farinha',
    prioridade: 'Rotina Pamoate',
    centroCusto: 'C097',
    servico: 'Troca da lente, após o detector de Fumaça (N)-140.215.F30',
    observacao: 'O dispositivo encontrava-se danificado como citou "no cheiro" no final de inspeção, pessoal fumando escondido.',
    acaoCorretiva: `Foi realizada a troca do dispositivo por um novo do mesmo modelo (sensor de fumaça convencional),
    onde foi realizado a limpeza interna das conexões e ajuste no dispositivo, o que normalizou o seu
    funcionamento conforme especificações. Programação e instalação do detector de fumaça após a troca
    do equipamento que apresentava problema.`,
    datas: ['__/__/____', '__/__/____', '__/__/____', '__/__/____']
  });
  const [conclusao, setConclusao] = useState({
    normal: false,
    parcial: false,
    inoperante: false
  });
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleOsNumberChange = (e) => {
    setOsNumber(e.target.value);
  };

  const handleAttachmentUpload = (e) => {
    const files = e.target.files;

    if (!files.length) return;

    const newAttachments = [...attachments];

    Array.from(files).forEach(file => {
      const reader = new FileReader();

      reader.onload = (event) => {
        newAttachments.push({
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          src: event.target.result,
          description: 'Descrição da imagem...'
        });
        setAttachments([...newAttachments]);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleAttachmentDescriptionChange = (id, description) => {
    const updatedAttachments = attachments.map(attachment =>
      attachment.id === id ? { ...attachment, description } : attachment
    );
    setAttachments(updatedAttachments);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    alert('Funcionalidade de salvar seria implementada aqui (ex: exportar para PDF)');
  };

  const handleDateChange = (index, value) => {
    const newDates = [...formData.datas];
    newDates[index] = value;
    setFormData({
      ...formData,
      datas: newDates
    });
  };

  const handleConclusaoChange = (field, value) => {
    setConclusao({
      ...conclusao,
      [field]: value
    });
  };

  return (
    <div className="main-container">
      <div className="edit-buttons">
        <button className="btn-action" onClick={handleSave}>Salvar Documento</button>
        <button className="btn-action" onClick={handlePrint}>Imprimir</button>
      </div>

      <div className="container" id="document">
        <div className="header">
          <div className="title">
            <h1 className="text-center">ORDEM DE SERVIÇO CORRETIVA - OS-<span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setOsNumber(e.target.textContent)}
            >{osNumber}</span></h1>
            <div className="checkboxes">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="manutencao"
                  name="manutencao"
                  checked={manutencaoCorretiva}
                  onChange={(e) => setManutencaoCorretiva(e.target.checked)}
                />
                <label htmlFor="manutencao">MANUTENÇÃO CORRETIVA</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="naoprogramados"
                  name="naoprogramados"
                  checked={naoProgramados}
                  onChange={(e) => setNaoProgramados(e.target.checked)}
                />
                <label htmlFor="naoprogramados">NÃO PROGRAMADOS</label>
              </div>
            </div>
          </div>
          <div className="logo">
            <img src="/logo_IBS.png" alt="IBSystems Logo" className="logo-img" />
          </div>
        </div>

        <div className="divider"></div>

        <div className="info-section">
          <div className="info-row">
            <div className="info-item">
              <div className="info-label">Código de Manutenção:</div>
              <div
                className="info-value"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleInputChange('codigoManutencao', e.target.textContent)}
              >{formData.codigoManutencao}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Data de Solicitação:</div>
              <div
                className="info-value"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleInputChange('dataSolicitacao', e.target.textContent)}
              >{formData.dataSolicitacao}</div>
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <div className="info-label">Nome do Equipamento:</div>
              <div
                className="info-value"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleInputChange('nomeEquipamento', e.target.textContent)}
              >{formData.nomeEquipamento}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Data de Execução:</div>
              <div
                className="info-value"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleInputChange('dataExecucao', e.target.textContent)}
              >{formData.dataExecucao}</div>
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <div className="info-label">Localização:</div>
              <div
                className="info-value"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleInputChange('localizacao', e.target.textContent)}
              >{formData.localizacao}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Prioridade:</div>
              <div
                className="info-value"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleInputChange('prioridade', e.target.textContent)}
              >{formData.prioridade}</div>
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <div className="info-label">Número da O.S.:</div>
              <div
                className="info-value os-number"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const num = e.target.textContent.replace('OS-', '');
                  setOsNumber(num);
                }}
              >OS-{osNumber}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Centro de custo:</div>
              <div
                className="info-value"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleInputChange('centroCusto', e.target.textContent)}
              >{formData.centroCusto}</div>
            </div>
          </div>
        </div>

        <div className="divider strong-divider"></div>

        <div className="service-section">
          <div className="section-label">SERVIÇO:</div>
          <div
            className="section-content"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleInputChange('servico', e.target.textContent)}
          >{formData.servico}</div>
        </div>

        <div className="observation-section">
          <div className="section-label">OBSERVAÇÃO:</div>
          <div
            className="section-content"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleInputChange('observacao', e.target.textContent)}
          >{formData.observacao}</div>
        </div>

        <div className="action-section">
          <div className="section-label">Ação Corretiva:</div>
          <div
            className="section-content"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleInputChange('acaoCorretiva', e.target.textContent)}
          >
            <p>{formData.acaoCorretiva}</p>
            <ul>
              <li>Teste de formato</li>
              <li>Teste de comunicação com painel</li>
              <li>Funcionamento do detector</li>
            </ul>
          </div>
        </div>

        <div className="attachment-section">
          <div className="section-label">ANEXOS:</div>
          <div className="attachment-container">
            <div id="image-attachments">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="attachment-item">
                  <img
                    src={attachment.src}
                    alt="Anexo"
                    className="attachment-image"
                  />
                  <div
                    className="attachment-description"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleAttachmentDescriptionChange(attachment.id, e.target.textContent)}
                  >
                    {attachment.description}
                  </div>
                  <button
                    className="remove-attachment"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <div className="attachment-controls">
              <div className="attachment-button">
                <label htmlFor="attachment-upload" className="btn-attachment">Adicionar imagem</label>
                <input
                  type="file"
                  id="attachment-upload"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleAttachmentUpload}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="conclusion-section">
          <div className="section-label">CONCLUSÃO:</div>
          <div className="conclusion-options">
            <div className="conclusion-option">
              <input
                type="checkbox"
                id="temporario-normal"
                checked={conclusao.normal}
                onChange={(e) => handleConclusaoChange('normal', e.target.checked)}
              />
              <label htmlFor="temporario-normal">Equipamento normal</label>
            </div>
            <div className="conclusion-option">
              <input
                type="checkbox"
                id="equipamento-parcial"
                checked={conclusao.parcial}
                onChange={(e) => handleConclusaoChange('parcial', e.target.checked)}
              />
              <label htmlFor="equipamento-parcial">Equipamento parcial</label>
            </div>
            <div className="conclusion-option">
              <input
                type="checkbox"
                id="equipamento-inop"
                checked={conclusao.inoperante}
                onChange={(e) => handleConclusaoChange('inoperante', e.target.checked)}
              />
              <label htmlFor="equipamento-inop">Equipamento inoperante</label>
            </div>
          </div>
        </div>

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
                  <div className="date-line">DATA:
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleDateChange(0, e.target.textContent)}
                    >
                      {formData.datas[0]}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="date-line">DATA:
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleDateChange(1, e.target.textContent)}
                    >
                      {formData.datas[1]}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="date-line">DATA:
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleDateChange(2, e.target.textContent)}
                    >
                      {formData.datas[2]}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="date-line">DATA:
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleDateChange(3, e.target.textContent)}
                    >
                      {formData.datas[3]}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
