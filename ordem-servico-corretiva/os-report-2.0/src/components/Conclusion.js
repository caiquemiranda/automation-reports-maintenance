import React from 'react';
import './Conclusion.css';

const Conclusion = ({ conclusion, setConclusion, errors }) => (
    <section className="conclusion-section">
        <div className="conclusion-header">
            <strong>Conclusão:</strong>
            <div className="conclusion-line" />
        </div>
        <div className="conclusion-options">
            <label className={conclusion === 'normal' ? 'selected' : ''}>
                <input
                    type="radio"
                    name="conclusao"
                    value="normal"
                    checked={conclusion === 'normal'}
                    onChange={() => setConclusion('normal')}
                    required
                />
                Equipamento normal
            </label>
            <label className={conclusion === 'parcial' ? 'selected' : ''}>
                <input
                    type="radio"
                    name="conclusao"
                    value="parcial"
                    checked={conclusion === 'parcial'}
                    onChange={() => setConclusion('parcial')}
                />
                Equipamento parcial
            </label>
            <label className={conclusion === 'inoperante' ? 'selected' : ''}>
                <input
                    type="radio"
                    name="conclusao"
                    value="inoperante"
                    checked={conclusion === 'inoperante'}
                    onChange={() => setConclusion('inoperante')}
                />
                Equipamento inoperante
            </label>
        </div>
        {errors && errors.conclusion && (
            <div className="error-msg">Selecione uma conclusão.</div>
        )}
    </section>
);

export default Conclusion; 