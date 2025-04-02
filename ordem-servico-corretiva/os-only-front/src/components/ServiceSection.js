import React, { useState } from 'react';
import './ServiceSection.css';

const ServiceSection = () => {
    const [servico, setServico] = useState('Troca da lente, após o detector de Fumaça (N)-140.215.F30');

    const handleServicoChange = (e) => {
        setServico(e.target.textContent);
    };

    return (
        <div className="service-section">
            <div className="section-label">SERVIÇO:</div>
            <div
                className="section-content"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={handleServicoChange}
            >
                {servico}
            </div>
        </div>
    );
};

export default ServiceSection; 