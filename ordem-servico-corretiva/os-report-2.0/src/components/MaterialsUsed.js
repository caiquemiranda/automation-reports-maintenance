import React, { useState } from 'react';
import './MaterialsUsed.css';

const DEFAULT_MATERIALS = [
    'Acionador simples modelo 2023/234',
    'Detector de fumaça convencional',
    'Cabos de conexão',
    'Fonte de alimentação',
    'Placa de circuito',
    'Parafusos e presilhas',
    'Componentes eletrônicos',
    'Peças de reposição',
];

const MaterialsUsed = ({ materials, setMaterials }) => {
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [customMaterial, setCustomMaterial] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    const addMaterial = () => {
        if (showCustomInput && customMaterial) {
            setMaterials([...materials, customMaterial]);
            setCustomMaterial('');
            setShowCustomInput(false);
        } else if (selectedMaterial) {
            setMaterials([...materials, selectedMaterial]);
            setSelectedMaterial('');
        }
    };

    const removeMaterial = (index) => {
        setMaterials(materials.filter((_, i) => i !== index));
    };

    return (
        <section className="materials-used">
            <h3>Materiais Utilizados</h3>
            <div className="materials-container">
                {materials.length > 0 ? (
                    <div className="materials-list">
                        {materials.map((material, index) => (
                            <div key={index} className="material-item">
                                <span>{material}</span>
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeMaterial(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-materials">
                        Nenhum material utilizado.
                    </div>
                )}

                <div className="materials-add">
                    {showCustomInput ? (
                        <div className="custom-material-input">
                            <input
                                type="text"
                                value={customMaterial}
                                onChange={(e) => setCustomMaterial(e.target.value)}
                                placeholder="Digite o nome do material"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCustomInput(false)}
                                className="cancel-btn"
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <select
                            value={selectedMaterial}
                            onChange={(e) => setSelectedMaterial(e.target.value)}
                        >
                            <option value="">Selecione um material</option>
                            {DEFAULT_MATERIALS.map((material, index) => (
                                <option key={index} value={material}>
                                    {material}
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="add-buttons">
                        <button
                            type="button"
                            onClick={addMaterial}
                            disabled={(showCustomInput && !customMaterial) || (!showCustomInput && !selectedMaterial)}
                            className="add-btn"
                        >
                            Adicionar
                        </button>

                        {!showCustomInput && (
                            <button
                                type="button"
                                onClick={() => setShowCustomInput(true)}
                                className="custom-btn"
                            >
                                Outro Material
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MaterialsUsed; 