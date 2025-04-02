import React from 'react';
import './Header.css';
import { useOrdemServico } from '../../../contexts/OrdemServicoContext';
import EditableField from '../../../components/common/EditableField';

const Header = () => {
    const { numeroOs, handleOsNumberChange } = useOrdemServico();

    // Logo placeholder
    const logoPlaceholder = "https://via.placeholder.com/120x60?text=IBSystems";

    return (
        <div className="header">
            <div className="title">
                <h1 className="text-center">
                    ORDEM DE SERVIÇO CORRETIVA - OS-
                    <EditableField
                        id="numero-os"
                        value={numeroOs}
                        onChange={handleOsNumberChange}
                    />
                </h1>
                <div className="checkboxes">
                    <div className="checkbox-item">
                        <input type="checkbox" id="manutencao" name="manutencao" defaultChecked />
                        <label htmlFor="manutencao">MANUTENÇÃO CORRETIVA</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="naoprogramados" name="naoprogramados" />
                        <label htmlFor="naoprogramados">NÃO PROGRAMADOS</label>
                    </div>
                </div>
            </div>
            <div className="logo">
                <img src={logoPlaceholder} alt="IBSystems Logo" className="logo-img" />
            </div>
        </div>
    );
};

export default Header; 