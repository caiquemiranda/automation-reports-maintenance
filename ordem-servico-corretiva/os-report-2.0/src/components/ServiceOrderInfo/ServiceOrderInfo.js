import React from 'react';
import './ServiceOrderInfo.css';

const ServiceOrderInfo = () => (
    <section className="service-order-info">
        <div className="logo-section">
            <img src="/logo192.png" alt="Logo IBSistemas" className="logo" />
            <div className="company-info">
                <strong>IBSistemas</strong>
                <span>Facility Solutions</span>
            </div>
        </div>
        <h2>ORDEM DE SERVIÇO 305489</h2>
        <div className="checkbox-group">
            <label><input type="checkbox" checked readOnly /> MANUTENÇÃO CORRETIVA</label>
            <label><input type="checkbox" readOnly /> MANUTENÇÃO PLANEJADA</label>
        </div>
        <div className="info-grid">
            <div><strong>IAG do Equipamento:</strong> NL-IQ207-603</div>
            <div><strong>Data de Solicitação:</strong> 08/03/2023</div>
            <div><strong>Tipo de Equipamento:</strong> Detector de Fumaça</div>
            <div><strong>Data de Execução:</strong> DATA/2023</div>
            <div><strong>Localização:</strong> Depósito NL-140.215 Fábrica da Família</div>
            <div><strong>Prioridade:</strong> Baixa</div>
            <div><strong>Número da OS:</strong> 305489</div>
            <div><strong>Requisitante:</strong> Roberto Santos</div>
            <div><strong>Centro de custo:</strong> C007</div>
        </div>
    </section>
);

export default ServiceOrderInfo; 