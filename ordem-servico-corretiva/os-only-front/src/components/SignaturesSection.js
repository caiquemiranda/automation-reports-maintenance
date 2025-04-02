import React, { useState } from 'react';
import './SignaturesSection.css';

const SignaturesSection = () => {
    const [dates, setDates] = useState({
        assistenteDate: '__/__/____',
        clienteDate: '__/__/____',
        supervisorDate: '__/__/____',
        frequenciaDate: '__/__/____'
    });

    const handleDateChange = (field, e) => {
        setDates({
            ...dates,
            [field]: e.target.textContent
        });
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
                                <span
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => handleDateChange('assistenteDate', e)}
                                >
                                    {dates.assistenteDate}
                                </span>
                            </div>
                        </td>
                        <td>
                            <div className="date-line">
                                DATA:
                                <span
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => handleDateChange('clienteDate', e)}
                                >
                                    {dates.clienteDate}
                                </span>
                            </div>
                        </td>
                        <td>
                            <div className="date-line">
                                DATA:
                                <span
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => handleDateChange('supervisorDate', e)}
                                >
                                    {dates.supervisorDate}
                                </span>
                            </div>
                        </td>
                        <td>
                            <div className="date-line">
                                DATA:
                                <span
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => handleDateChange('frequenciaDate', e)}
                                >
                                    {dates.frequenciaDate}
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SignaturesSection; 