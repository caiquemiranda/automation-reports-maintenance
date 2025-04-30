import React from 'react';
import './Conclusion.css';

const Conclusion = () => (
    <section className="conclusion-section">
        <strong>Conclusão:</strong>
        <div className="conclusion-buttons">
            <label>
                <input type="radio" name="conclusao" defaultChecked /> Equipamento normal
            </label>
            <label>
                <input type="radio" name="conclusao" /> Equipamento parcial
            </label>
            <label>
                <input type="radio" name="conclusao" /> Equipamento inoperante
            </label>
        </div>
    </section>
);

export default Conclusion; 