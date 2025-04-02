import React, { useRef } from 'react';
import './styles.css';
import ActionButton from '../../components/common/ActionButton';
import useDocumentActions from '../../hooks/useDocumentActions';
import { useOrdemServico } from '../../contexts/OrdemServicoContext';

// Componentes da OS
import Header from './components/Header';
import InfoSection from './components/InfoSection';
import ServiceSection from './components/ServiceSection';
import ObservationSection from './components/ObservationSection';
import ActionSection from './components/ActionSection';
import AttachmentSection from './components/AttachmentSection';
import ConclusionSection from './components/ConclusionSection';
import SignaturesSection from './components/SignaturesSection';

const OrdemServico = () => {
    const documentRef = useRef(null);
    const { handlePrint, handleSave } = useDocumentActions();

    return (
        <div className="main-container">
            <div className="edit-buttons">
                <ActionButton onClick={handleSave}>Salvar Documento</ActionButton>
                <ActionButton onClick={handlePrint}>Imprimir</ActionButton>
            </div>

            <div className="container" id="document" ref={documentRef}>
                <Header />
                <div className="divider"></div>
                <InfoSection />
                <div className="divider strong-divider"></div>
                <ServiceSection />
                <ObservationSection />
                <ActionSection />
                <AttachmentSection />
                <ConclusionSection />
                <SignaturesSection />
            </div>
        </div>
    );
};

export default OrdemServico; 