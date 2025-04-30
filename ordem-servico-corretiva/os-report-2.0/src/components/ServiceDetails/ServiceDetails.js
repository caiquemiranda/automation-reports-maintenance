import React from 'react';
import './ServiceDetails.css';

const ServiceDetails = () => (
    <section className="service-details">
        <div className="service-row">
            <strong>Serviço:</strong>
            <span>Troca de laço, após o detector de fumaça (NL-140.215-F30)</span>
        </div>
        <div className="service-row">
            <strong>Observação:</strong>
            <span>O dispositivo estava com "falha de laço" ou "laço aberto" no final da inspeção, precisou formato secundário.</span>
        </div>
        <div className="service-row">
            <strong>Ação Corretiva:</strong>
            <ul>
                <li>Foi realizado teste do dispositivo por um novo laço de mesmo modelo (sensor de fumaça convencional, onde foi realizado a troca do laço e o detector voltou a funcionar normalmente, sem apresentar falha de laço).</li>
                <li>Teste de funcionamento do detector de fumaça após a troca do equipamento que apresentou problema.</li>
                <li>Laudo de funcionamento.</li>
                <li>Registro fotográfico do painel.</li>
                <li>Normalização do cadastro.</li>
            </ul>
        </div>
    </section>
);

export default ServiceDetails; 