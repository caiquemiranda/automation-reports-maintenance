import React from 'react';
import './SignaturesSection.css';
import { useOrdemServico } from '../../../contexts/OrdemServicoContext';
import EditableField from '../../../components/common/EditableField';

const SignaturesSection = () => {
    const { dates, handleDateChange } = useOrdemServico();

    const handleFieldChange = (field) => (value) => {
        handleDateChange(field, value);
    };

    return (
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
                        <td>
                            <div className="signature-line"></div>
                        </td>
                        <td>
                            <div className="signature-line"></div>
                        </td>
                        <td>
                            <div className="signature-line"></div>
                        </td>
                        <td>
                            <div className="signature-line"></div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="date-line">
                                DATA:
                                <EditableField
                                    value={dates.assistenteDate}
                                    onChange={handleFieldChange('assistenteDate')}
                                />
                            </div>
                        </td>
                        <td>
                            <div className="date-line">
                                DATA:
                                <EditableField
                                    value={dates.clienteDate}
                                    onChange={handleFieldChange('clienteDate')}
                                />
                            </div>
                        </td>
                        <td>
                            <div className="date-line">
                                DATA:
                                <EditableField
                                    value={dates.supervisorDate}
                                    onChange={handleFieldChange('supervisorDate')}
                                />
                            </div>
                        </td>
                        <td>
                            <div className="date-line">
                                DATA:
                                <EditableField
                                    value={dates.frequenciaDate}
                                    onChange={handleFieldChange('frequenciaDate')}
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SignaturesSection; 