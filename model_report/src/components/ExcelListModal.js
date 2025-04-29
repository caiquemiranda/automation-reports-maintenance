import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import '../styles/ListBlock.css';

const ExcelListModal = ({ isOpen, onClose, onInsert }) => {
  const fileInputRef = useRef();
  const [excelData, setExcelData] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        if (json.length === 0) {
          setError('A planilha está vazia.');
        } else {
          setExcelData(json);
        }
      } catch (err) {
        setError('Erro ao ler o arquivo Excel.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleInsert = () => {
    if (excelData && excelData.length > 0) {
      onInsert(excelData);
      setExcelData(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 600 }}>
        <h2>Importar Lista do Excel</h2>
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        {excelData && excelData.length > 0 && (
          <div style={{ marginTop: 16, maxHeight: 200, overflow: 'auto' }}>
            <table className="list-block-table">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((header, idx) => (
                    <th key={idx}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'even' : 'odd'}>
                    {Object.keys(excelData[0]).map((header, hidx) => (
                      <td key={hidx}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ marginRight: 8 }}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleInsert} disabled={!excelData || excelData.length === 0}>Inserir Lista</button>
        </div>
      </div>
    </div>
  );
};

export default ExcelListModal; 